import chalk from 'chalk';
import { table } from 'table';
import { listFeedbacks, getFeedbackDetail } from '../api/feedback';
import { CommandOptions, FeedbackData, ListResponse } from '../types';
import { CONFIG, MESSAGES } from '../config/constants';
import { validateUuid, validatePagination } from '../utils/validation';

// UUID regex pattern for detecting IDs
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Main feedback command handler
export async function handleFeedbackCommand(id: string | undefined, options: CommandOptions) {
  // If ID provided, show specific feedback details
  if (id) {
    if (!validateUuid(id)) {
      console.log(chalk.yellow('💡 Invalid feedback ID format'));
      console.log(chalk.black('Feedback ID should be a UUID like: 2ea8f556-052b-4f5c-bf86-833780b3d00d'));
      return;
    }
    return await showFeedback(id, options);
  }

  // If search query provided, search feedback
  if (options.search) {
    return await searchFeedback(options.search, options);
  }

  // Otherwise, list all feedback
  return await listFeedback(options);
}

// Helper functions
async function listFeedback(options: CommandOptions) {
  const { page, limit } = validatePagination(options.page, options.limit);
  const status = options.status;
  const search = options.search;

  const result = await listFeedbacks({
    page,
    limit,
    status,
    search
  });

  if (options.json) {
    console.log(JSON.stringify({ success: true, data: result }, null, 2));
    return;
  }

  const feedbacks = result.feedbacks || [];
  
  if (feedbacks.length === 0) {
    console.log(chalk.yellow('📝 No feedback found'));
    if (search) {
      console.log(chalk.gray(`Try a different search term or remove --search to see all feedback`));
    }
    return;
  }

  console.log(chalk.blue('\n🎯 AI-Generated Feedback:'));
  
  const tableData = [
    [
      chalk.bold('ID'),
      chalk.bold('Title'),
      chalk.bold('Severity'),
      chalk.bold('Input ID'),
      chalk.bold('Created')
    ]
  ];

  feedbacks.forEach((feedback: any) => {
    tableData.push([
      feedback.id,
      feedback.title || chalk.gray('null'),
      feedback.severity || 'medium',
      feedback.input_id || chalk.gray('null'),
      feedback.timestamp ? new Date(feedback.timestamp).toLocaleString() : 'Unknown'
    ]);
  });

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
    console.log(chalk.black(`\nPage ${result.pagination.page} of ${result.pagination.pages} (${result.pagination.total} total feedback)`));
    if (result.pagination.page < result.pagination.pages) {
      console.log(chalk.gray(`💡 Use --page ${result.pagination.page + 1} to see next page`));
    }
  }
}

async function showFeedback(id: string, options: CommandOptions) {
  try {
    const result = await getFeedbackDetail(id);
    
    if (options.json) {
      console.log(JSON.stringify({ success: true, data: result }, null, 2));
      return;
    }

    console.log(chalk.blue('\n🎯 Feedback Details:'));
    console.log(chalk.black('─'.repeat(50)));
    console.log(chalk.blue('ID:'), result.id);
    console.log(chalk.blue('Title:'), result.title || chalk.gray('null'));
    console.log(chalk.blue('Clarity:'), result.clarity || chalk.gray('null'));
    console.log(chalk.blue('Deal Blocker:'), result.deal_blocker ? chalk.red('Yes') : chalk.green('No'));
    console.log(chalk.blue('Pain Point:'), result.pain_point || chalk.gray('null'));
    console.log(chalk.blue('Workaround:'), result.workaround || chalk.gray('null'));
    console.log(chalk.blue('Competitor Gap:'), result.competitor_gap || chalk.gray('null'));
    console.log(chalk.blue('Willingness to Pay:'), result.willingness_to_pay || chalk.gray('null'));
    console.log(chalk.blue('Use Case:'), result.use_case || chalk.gray('null'));
    console.log(chalk.blue('Feature Area:'), result.feature_area || chalk.gray('null'));
    console.log(chalk.blue('Source URL:'), result.source_url || chalk.gray('null'));
    console.log(chalk.blue('Created:'), result.timestamp ? new Date(result.timestamp).toLocaleString() : 'Unknown');
  } catch (error: any) {
    if (options.json) {
      console.log(JSON.stringify({
        success: false,
        error: error.message,
        details: error.response?.data || 'Unknown error occurred'
      }, null, 2));
    } else {
      if (error.response?.status === 404) {
        console.error(chalk.red('❌ Feedback not found'));
        console.log(chalk.black('The feedback ID you provided does not exist or is not accessible.'));
      } else if (error.response?.status === 401) {
        console.error(chalk.red('❌ Authentication Error:'), 'Invalid API key');
        console.log(chalk.black('\n💡 To fix:'));
        console.log(chalk.black('   1. Get your free API key at: https://closedloop.sh'));
        console.log(chalk.black('   2. Run: cl config set --api-key <your-key>'));
      } else {
        console.error(chalk.red('❌ Error:'), error.message);
        console.log(chalk.black('\n💡 Get help: cl --help'));
      }
    }
    process.exit(1);
  }
}

async function searchFeedback(query: string, options: any) {
  const page = parseInt(options.page) || 1;
  const limit = parseInt(options.limit) || 20;

  const result = await listFeedbacks({
    page,
    limit,
    search: query
  });

  if (options.json) {
    console.log(JSON.stringify({ success: true, data: result }, null, 2));
    return;
  }

  const feedbacks = result.feedbacks || [];
  
  if (feedbacks.length === 0) {
    console.log(chalk.yellow(`📝 No feedback found for "${query}"`));
    console.log(chalk.gray('Try a different search term or remove --search to see all feedback'));
    return;
  }

  console.log(chalk.blue(`\n🔍 Search Results for "${query}":`));
  
  const tableData = [
    [
      chalk.bold('ID'),
      chalk.bold('Title'),
      chalk.bold('Severity'),
      chalk.bold('Input ID'),
      chalk.bold('Created')
    ]
  ];

  feedbacks.forEach((feedback: any) => {
    tableData.push([
      feedback.id,
      feedback.title || chalk.gray('null'),
      feedback.severity || 'medium',
      feedback.input_id || chalk.gray('null'),
      feedback.timestamp ? new Date(feedback.timestamp).toLocaleString() : 'Unknown'
    ]);
  });

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
    console.log(chalk.black(`Page ${result.pagination.page} of ${result.pagination.pages} (${result.pagination.total} total results)`));
  }
}

function handleError(error: any, options: any) {
  if (options.json) {
    console.log(JSON.stringify({
      success: false,
      error: error.message,
      details: error.response?.data || 'Unknown error occurred'
    }, null, 2));
  } else {
    if (error.response?.status === 404) {
      console.error(chalk.red('❌ Not found'));
      console.log(chalk.black('The requested resource does not exist or is not accessible.'));
    } else if (error.response?.status === 401) {
      console.error(chalk.red('❌ Authentication Error:'), 'Invalid API key');
      console.log(chalk.black('\n💡 To fix:'));
      console.log(chalk.black('   1. Get your free API key at: https://closedloop.sh'));
      console.log(chalk.black('   2. Run: cl config set --api-key <your-key>'));
    } else {
      console.error(chalk.red('❌ Error:'), error.message);
      console.log(chalk.black('\n💡 Get help: cl --help'));
    }
  }
  process.exit(1);
}