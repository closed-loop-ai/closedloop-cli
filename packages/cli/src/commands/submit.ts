import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import { submitFeedback, getFeedbackStatus } from '../api/feedback';
import { CommandOptions, InputData } from '../types';
import { CONFIG, MESSAGES } from '../config/constants';

export const submitCommand = new Command('submit')
  .description('Submit customer input for AI analysis and insight generation')
  .argument('[content]', 'Customer input content to analyze')
  .option('-t, --title <title>', 'Title for this customer input')
  .option('-u, --url <url>', 'Where this input came from (support ticket, survey, etc.)')
  .option('-c, --customer <id>', 'Customer identifier')
  .option('-n, --name <name>', 'Name of person who provided the input')
  .option('-e, --email <email>', 'Email of person who provided the input')
  .option('--interactive', 'Fill in details step by step')
  .option('-w, --wait', 'Wait until processing is completed')
  .option('--json', 'Output in JSON format')
  .action(async (content, options: CommandOptions) => {
    try {
      let feedbackData: Partial<InputData> = {};

      if (options.interactive || !content) {
        // Interactive mode
        const answers = await inquirer.prompt([
          {
            type: 'input',
            name: 'content',
            message: 'What customer input would you like to analyze?',
            validate: (input) => input.length >= 10 || 'Input must be at least 10 characters',
            default: content
          },
          {
            type: 'input',
            name: 'title',
            message: 'What should we call this input? (optional):',
            default: options.title
          },
          {
            type: 'input',
            name: 'sourceUrl',
            message: 'Where did this come from? (support ticket, survey, etc.) (optional):',
            default: options.url
          },
          {
            type: 'input',
            name: 'customerId',
            message: 'Customer identifier (optional):',
            default: options.customer
          },
          {
            type: 'input',
            name: 'reporterName',
            message: 'Who provided this input? (optional):',
            default: options.name
          },
          {
            type: 'input',
            name: 'reporterEmail',
            message: 'Their email address (optional):',
            default: options.email
          }
        ]);

        feedbackData = {
          content: answers.content,
          title: answers.title,
          source_url: answers.sourceUrl,
          customer_id: answers.customerId,
          reporter_name: answers.reporterName,
          reporter_email: answers.reporterEmail
        };
      } else {
        // Command line mode
        feedbackData = {
          content,
          title: options.title,
          source_url: options.url,
          customer_id: options.customer,
          reporter_name: options.name,
          reporter_email: options.email
        };
      }

      const spinner = ora('Submitting customer input for AI analysis...').start();
      
      const result = await submitFeedback(feedbackData);
      
      if (options.wait) {
        // Wait for processing to complete
        if (options.json) {
          // For JSON, we'll output the final result after waiting
        } else {
          console.log(chalk.green('✅ Customer input submitted successfully!'));
          console.log(chalk.blue(`Submission ID: ${result.id}`));
        }
        
        const waitSpinner = ora('Processing...').start();
        let attempts = 0;
        const maxAttempts = CONFIG.MAX_RETRY_ATTEMPTS;

        while (attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, CONFIG.POLL_INTERVAL_MS));
          
          try {
            const statusResult = await getFeedbackStatus(result.id);
            
            if (statusResult.status === 'completed') {
              waitSpinner.succeed('Processing completed!');
              
              if (options.json) {
                console.log(JSON.stringify({ success: true, data: statusResult }, null, 2));
              } else {
                console.log(chalk.blue(`Feedback generated: ${statusResult.feedbackCount || 0}`));
                console.log(chalk.blue(`Credits used: ${statusResult.creditsConsumed || 0}`));
                if ((statusResult.feedbackCount || 0) > 0) {
                  console.log(chalk.gray('Run "cl list" to see all feedback'));
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
              // Still processing
              waitSpinner.text = `Processing... (${statusResult.status})`;
            }
          } catch (error) {
            // Continue waiting on API errors
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
            console.log(chalk.gray(`   cl status ${result.id}`));
          }
        }
      } else {
        if (options.json) {
          console.log(JSON.stringify({ success: true, data: result }, null, 2));
        } else {
          console.log(chalk.green('✅ Customer input submitted successfully!'));
          console.log(chalk.blue(`Submission ID: ${result.id}`));
          console.log(chalk.gray('Run "cl status ' + result.id + '" to check progress'));
          console.log(chalk.gray('Or use "cl submit --wait" to wait for completion'));
        }
      }

    } catch (error: any) {
      if (options.json) {
        console.log(JSON.stringify({ 
          success: false, 
          error: error.message,
          details: error.response?.data || 'Unknown error occurred'
        }, null, 2));
      } else {
        // User-friendly error messages
        if (error.response?.status === 400) {
          const errorData = error.response.data;
          if (errorData?.code === 'VALIDATION_ERROR') {
            console.error(chalk.red('❌ Validation Error:'), errorData.error);
            console.log(chalk.gray('\n💡 Common issues:'));
            console.log(chalk.gray('   • Content must be at least 10 characters'));
            console.log(chalk.gray('   • Check that all required fields are provided'));
            console.log(chalk.gray('   • Ensure API key is valid: cl config'));
          } else if (errorData?.code === 'PROCESSING_ERROR') {
            console.error(chalk.red('❌ Processing Error:'), errorData.error);
            console.log(chalk.gray('\n💡 This usually means:'));
            console.log(chalk.gray('   • The content could not be processed by our AI'));
            console.log(chalk.gray('   • Try rephrasing your input'));
            console.log(chalk.gray('   • Make sure the content is clear and meaningful'));
            console.log(chalk.gray('   • Check API key: cl config'));
          } else {
            console.error(chalk.red('❌ Bad Request:'), errorData?.error || 'Invalid input provided');
            console.log(chalk.gray('\n💡 Try:'));
            console.log(chalk.gray('   • Check your input content'));
            console.log(chalk.gray('   • Verify API key: cl config'));
            console.log(chalk.gray('   • Get help: cl submit --help'));
          }
        } else if (error.response?.status === 401) {
          console.error(chalk.red('❌ Authentication Error:'), 'Invalid API key');
          console.log(chalk.gray('\n💡 To fix:'));
          console.log(chalk.gray('   1. Get your free API key at: https://closedloop.sh'));
          console.log(chalk.gray('   2. Run: cl config --set-api-key <your-key>'));
        } else if (error.response?.status === 429) {
          console.error(chalk.red('❌ Rate Limited:'), 'Too many requests');
          console.log(chalk.gray('\n💡 Wait a moment and try again'));
        } else if (error.response?.status >= 500) {
          console.error(chalk.red('❌ Server Error:'), 'Our servers are having issues');
          console.log(chalk.gray('\n💡 Try again in a few minutes'));
        } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
          console.error(chalk.red('❌ Connection Error:'), 'Cannot connect to ClosedLoop servers');
          console.log(chalk.gray('\n💡 Check your internet connection and try again'));
        } else {
          console.error(chalk.red('❌ Error:'), error.message);
          console.log(chalk.gray('\n💡 Get help: cl --help'));
        }
      }
      process.exit(1);
    }
  });
