import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import { table } from 'table';
import { submitFeedback } from '../api/feedback';
import { listIngests as listIngestsAPI, getIngestDetail, getIngestStatus } from '../api/ingest';
import { CommandOptions, InputData, ListResponse } from '../types';
import { CONFIG, MESSAGES } from '../config/constants';
import { validateUuid, validateAndSanitizeInput, validatePagination } from '../utils/validation';

// UUID regex pattern for detecting IDs
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Main ingest command handler
export async function handleIngestCommand(content: string | undefined, options: CommandOptions) {
  // Check for common command mistakes
  if (content && ['list', 'show', 'status', 'help'].includes(content.toLowerCase())) {
    console.log(chalk.yellow('💡 Did you mean one of these commands?'));
    console.log(chalk.black(''));
    console.log(chalk.blue('  cl ingest') + chalk.black('                    # List all ingested feedback'));
    console.log(chalk.blue('  cl ingest <id>') + chalk.black('              # Show specific ingested feedback details'));
    console.log(chalk.blue('  cl ingest "your content"') + chalk.black('     # Ingest new feedback for analysis'));
    console.log(chalk.black(''));
    console.log(chalk.gray('Examples:'));
    console.log(chalk.gray('  cl ingest "Dashboard is confusing"'));
    console.log(chalk.gray('  cl ingest 74e3dd87-878f-41cf-8e5a-87527bbf7770'));
    return;
  }

  // If content looks like a UUID, treat it as an ID and show details
  if (content && validateUuid(content)) {
    return await showIngest(content, options);
  }

  // If content provided and not a UUID, create new ingest
  if (content) {
    return await createIngest(content, options);
  }

  // If no content provided, list ingests
  return await listIngests(options);
}

// Helper functions
async function createIngest(content: string, options: CommandOptions) {
  // Validate and sanitize input data
  const validatedData = validateAndSanitizeInput({
    content,
    title: options.title,
    source_url: options.url,
    customer_id: options.customer,
    reporter_name: options.name,
    reporter_email: options.email
  });
  
  let feedbackData: Partial<InputData> = validatedData;

  if (options.interactive || !content) {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'content',
        message: 'What customer feedback would you like to ingest for analysis?',
        validate: (input) => input.length >= 10 || 'Input must be at least 10 characters',
        default: content
      },
      {
        type: 'input',
        name: 'title',
        message: 'Title for this input (optional):',
        default: options.title
      },
      {
        type: 'input',
        name: 'url',
        message: 'Source URL (optional):',
        default: options.url
      },
      {
        type: 'input',
        name: 'customer_id',
        message: 'Customer ID (optional):',
        default: options.customer
      },
      {
        type: 'input',
        name: 'reporter_name',
        message: 'Reporter name (optional):',
        default: options.name
      },
      {
        type: 'input',
        name: 'reporter_email',
        message: 'Reporter email (optional):',
        default: options.email
      }
    ]);

    feedbackData = {
      content: answers.content,
      ...(answers.title && { title: answers.title }),
      ...(answers.url && { source_url: answers.url }),
      ...(answers.customer_id && { customer_id: answers.customer_id }),
      ...(answers.reporter_name && { reporter_name: answers.reporter_name }),
      ...(answers.reporter_email && { reporter_email: answers.reporter_email })
    };
  } else {
    feedbackData = {
      content,
      ...(options.title && { title: options.title }),
      ...(options.url && { source_url: options.url }),
      ...(options.customer && { customer_id: options.customer }),
      ...(options.name && { reporter_name: options.name }),
      ...(options.email && { reporter_email: options.email })
    };
  }

  const spinner = ora('Ingesting your feedback...').start();
  
  const result = await submitFeedback(feedbackData);
  spinner.succeed('Submitted!');
  
  if (options.wait) {
    if (options.json) {
      // For JSON, we'll output the final result after waiting
    } else {
      console.log(chalk.blue(`Ingest ID: ${result.id}`));
    }
    
    const waitSpinner = ora('Processing...').start();
    let attempts = 0;
    const maxAttempts = CONFIG.MAX_RETRY_ATTEMPTS;

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, CONFIG.POLL_INTERVAL_MS));
      
      try {
        const statusResult = await getIngestStatus(result.id);
        
        if (statusResult.status === 'completed') {
          waitSpinner.succeed('Processing complete!');
          
          if (options.json) {
            console.log(JSON.stringify({ success: true, data: statusResult }, null, 2));
          } else {
            console.log(chalk.blue(`📊 Results: ${statusResult.feedback_count || 0} customer product feedback generated, ${statusResult.credits_consumed || 0} credits used`));
            if (statusResult.feedback_count > 0) {
              console.log(chalk.black('Run "cl feedback" to see generated feedback'));
            }
          }
          break;
        } else if (statusResult.status === 'failed') {
          waitSpinner.fail('Processing failed');
          if (options.json) {
            console.log(JSON.stringify({ success: false, error: 'Processing failed', data: statusResult }, null, 2));
          } else {
            console.log(chalk.red('\n❌ Processing failed. Check the status for more details.'));
          }
          break;
        } else {
          waitSpinner.text = `Processing... (${statusResult.status})`;
        }
      } catch (error) {
        waitSpinner.text = 'Processing... (checking status)';
      }
      attempts++;
    }

    if (attempts >= maxAttempts) {
      waitSpinner.warn('Processing is taking longer than expected');
      if (options.json) {
        console.log(JSON.stringify({ success: false, error: 'Processing timeout', data: { id: result.id, message: 'Processing is taking longer than expected' } }, null, 2));
      } else {
        console.log(chalk.yellow('\n⏳ Processing is still in progress. You can check status manually:'));
        console.log(chalk.black(`   cl input status ${result.id}`));
      }
    }
  } else {
    spinner.succeed('Submitted!');
    
    if (options.json) {
      console.log(JSON.stringify({ success: true, data: result }, null, 2));
    } else {
      console.log(chalk.green('✅ Submitted!'));
      console.log(chalk.blue(`Ingest ID: ${result.id}`));
        console.log(chalk.black('Run "cl ingest status ' + result.id + '" to check progress'));
        console.log(chalk.black('Or use "cl ingest --wait" to wait for completion'));
    }
  }
}

async function listRecentIngests(options: any) {
  const result = await listIngestsAPI(1, 5);
  const inputs = result.inputs || [];

  if (options.json) {
    console.log(JSON.stringify({ success: true, data: { inputs, pagination: result.pagination } }, null, 2));
    return;
  }

  if (inputs.length === 0) {
    console.log(chalk.yellow('No recent ingests found.'));
    console.log(chalk.black('Ingest your first feedback: cl ingest "Your customer feedback here"'));
    return;
  }

  console.log(chalk.blue('\n📝 Recent Ingested Feedback:'));
    console.log(chalk.black('─'.repeat(60)));

  inputs.forEach((input: any, index: number) => {
    const statusColor = input.status === 'completed' ? 'green' : 
                       input.status === 'processing' ? 'yellow' : 'red';
    
    console.log(chalk.blue(`${index + 1}.`), chalk.bold(input.title || 'Untitled'));
    console.log(chalk.black(`   ID: ${input.id}`));
    console.log(chalk.black(`   Status: ${chalk[statusColor](input.status || 'unknown')}`));
    console.log(chalk.black(`   Content: ${input.content ? input.content.substring(0, 100) + (input.content.length > 100 ? '...' : '') : 'N/A'}`));
    console.log(chalk.black(`   Submitted: ${input.created_at ? new Date(input.created_at).toLocaleString() : 'Unknown'}`));
    console.log();
  });

      console.log(chalk.black('Run "cl ingest list" to see all ingests'));
}

async function listIngests(options: CommandOptions) {
  const { page, limit } = validatePagination(options.page, options.limit);
  const status = options.status;

  const result = await listIngestsAPI(page, limit);
  const inputs = result.inputs || [];

  if (options.json) {
    console.log(JSON.stringify({ success: true, data: { inputs, pagination: result.pagination } }, null, 2));
    return;
  }

  if (inputs.length === 0) {
    console.log(chalk.yellow('No ingests found.'));
    console.log(chalk.black('Ingest your first feedback: cl ingest "Your customer feedback here"'));
    return;
  }

  // Create table
  const tableData = [
    [
      chalk.bold('ID'),
      chalk.bold('Title'),
      chalk.bold('Status'),
      chalk.bold('Feedback'),
      chalk.bold('Credits'),
      chalk.bold('Submitted')
    ]
  ];

  inputs.forEach((input: any) => {
    const statusColor = input.status === 'completed' ? 'green' : 
                       input.status === 'processing' ? 'yellow' : 'red';
    
    tableData.push([
      input.id,
      input.title || chalk.gray('null'),
      chalk[statusColor](input.status || 'unknown'),
      input.feedback_count || 0,
      input.credits_consumed || 0,
      input.created_at ? new Date(input.created_at).toLocaleString() : 'Unknown'
    ]);
  });

  console.log(chalk.blue('\n📝 Ingested Feedback:'));
  console.log(table(tableData, {
    border: {
      topBody: '─',
      topJoin: '┬',
      topLeft: '┌',
      topRight: '┐',
      bottomBody: '─',
      bottomJoin: '┴',
      bottomLeft: '└',
      bottomRight: '┘',
      bodyLeft: '│',
      bodyRight: '│',
      bodyJoin: '│',
      joinBody: '─',
      joinLeft: '├',
      joinRight: '┤',
      joinJoin: '┼'
    }
  }));

  if (result.pagination) {
    console.log(chalk.black(`\nPage ${result.pagination.page} of ${result.pagination.pages} (${result.pagination.total} total ingests)`));
    if (result.pagination.page < result.pagination.pages) {
      console.log(chalk.gray(`💡 Use --page ${result.pagination.page + 1} to see next page`));
    }
  }
}

async function showIngest(id: string, options: CommandOptions) {
  const result = await getIngestDetail(id);

  if (options.json) {
    console.log(JSON.stringify({ success: true, data: result }, null, 2));
    return;
  }

  console.log(chalk.blue('\n📝 Ingest Details:'));
  console.log(chalk.black('─'.repeat(50)));
  console.log(chalk.blue('ID:'), result.id);
  console.log(chalk.blue('Title:'), result.title || chalk.gray('null'));
  console.log(chalk.blue('Status:'), result.status);
  console.log(chalk.blue('Content:'), result.content || 'No content');
  console.log(chalk.blue('Source URL:'), result.source_url || chalk.gray('null'));
  console.log(chalk.blue('Customer ID:'), result.customer_id || chalk.gray('null'));
  console.log(chalk.blue('Reporter:'), result.reporter_name || chalk.gray('null'));
  console.log(chalk.blue('Email:'), result.reporter_email || chalk.gray('null'));
  console.log(chalk.blue('AI Feedback Generated:'), result.feedback_count || 0);
  console.log(chalk.blue('Credits Used:'), result.credits_consumed || 0);
  console.log(chalk.blue('Submitted:'), result.created_at ? new Date(result.created_at).toLocaleString() : 'Unknown');
  console.log(chalk.blue('Updated:'), result.updated_at ? new Date(result.updated_at).toLocaleString() : 'Unknown');
}

async function checkIngestStatus(id: string, options: CommandOptions) {
  const result = await getIngestStatus(id);

  if (options.json) {
    console.log(JSON.stringify({ success: true, data: result }, null, 2));
    return;
  }

  console.log(chalk.blue('\n📊 Processing Status:'));
  console.log(chalk.black('─'.repeat(40)));
  console.log(chalk.blue('ID:'), result.id);
  console.log(chalk.blue('Status:'), result.status);
  console.log(chalk.blue('Created:'), result.created_at ? new Date(result.created_at).toLocaleString() : 'Unknown');
  console.log(chalk.blue('Updated:'), result.updated_at ? new Date(result.updated_at).toLocaleString() : 'Unknown');
}

function handleError(error: any, options: any) {
  if (options.json) {
    console.log(JSON.stringify({
      success: false,
      error: error.message,
      details: error.response?.data || 'Unknown error occurred'
    }, null, 2));
  } else {
    if (error.response?.status === 400) {
      const errorData = error.response.data;
      if (errorData?.code === 'VALIDATION_ERROR') {
        console.error(chalk.red('❌ Validation Error:'), errorData.error);
        console.log(chalk.black('\n💡 Common issues:'));
        console.log(chalk.black('   • Content must be at least 10 characters'));
        console.log(chalk.black('   • Check that all required fields are provided'));
        console.log(chalk.black('   • Ensure API key is valid: cl config'));
      } else if (errorData?.code === 'PROCESSING_ERROR') {
        console.error(chalk.red('❌ Processing Error:'), errorData.error);
        console.log(chalk.black('\n💡 This usually means:'));
        console.log(chalk.black('   • The content could not be processed by our AI'));
        console.log(chalk.black('   • Try rephrasing your input'));
        console.log(chalk.black('   • Make sure the content is clear and meaningful'));
        console.log(chalk.black('   • Check API key: cl config'));
      } else {
        console.error(chalk.red('❌ Bad Request:'), errorData?.error || 'Invalid input provided');
        console.log(chalk.black('\n💡 Try:'));
        console.log(chalk.black('   • Check your input content'));
        console.log(chalk.black('   • Verify API key: cl config'));
        console.log(chalk.black('   • Get help: cl input --help'));
      }
    } else if (error.response?.status === 401) {
      console.error(chalk.red('❌ Authentication Error:'), 'Invalid API key');
      console.log(chalk.black('\n💡 To fix:'));
      console.log(chalk.black('   1. Get your free API key at: https://closedloop.sh'));
      console.log(chalk.black('   2. Run: cl config set-api-key <your-key>'));
    } else if (error.response?.status === 429) {
      console.error(chalk.red('❌ Rate Limited:'), 'Too many requests');
      console.log(chalk.black('\n💡 Wait a moment and try again'));
    } else if (error.response?.status >= 500) {
      console.error(chalk.red('❌ Server Error:'), 'Our servers are having issues');
      console.log(chalk.black('\n💡 Try again in a few minutes'));
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      console.error(chalk.red('❌ Connection Error:'), 'Cannot connect to ClosedLoop AI servers');
      console.log(chalk.black('\n💡 Check your internet connection and try again'));
    } else {
      console.error(chalk.red('❌ Error:'), error.message);
      console.log(chalk.black('\n💡 Get help: cl --help'));
    }
  }
  process.exit(1);
}

