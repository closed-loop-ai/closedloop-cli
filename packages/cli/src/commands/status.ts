import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { getFeedbackStatus } from '../api/feedback';
import { CommandOptions, FeedbackData } from '../types';
import { CONFIG, MESSAGES } from '../config/constants';

export const statusCommand = new Command('status')
  .description('Check processing status of a feedback submission')
  .argument('<id>', 'Feedback submission ID')
  .option('-w, --watch', 'Watch for status changes')
  .option('--json', 'Output in JSON format')
  .action(async (id, options: CommandOptions) => {
    try {
      if (options.watch) {
        // Watch mode - check status every few seconds
        const spinner = ora('Watching for status changes...').start();
        
        const checkStatus = async () => {
          try {
            const result = await getFeedbackStatus(id);
            
            if (result.status === 'completed') {
              spinner.succeed(chalk.green(`✅ Processing completed! Generated ${result.feedbackCount} insights`));
              process.exit(0);
            } else if (result.status === 'failed') {
              spinner.fail(chalk.red('❌ Processing failed'));
              process.exit(1);
            } else {
              spinner.text = `Processing... (${result.status})`;
            }
          } catch (error: any) {
            spinner.fail(chalk.red('Error checking status:') + ' ' + error.message);
            process.exit(1);
          }
        };

        // Check immediately
        await checkStatus();
        
        // Then check every few seconds
        const interval = setInterval(checkStatus, CONFIG.POLL_INTERVAL_MS);
        
        // Stop watching on Ctrl+C
        process.on('SIGINT', () => {
          clearInterval(interval);
          spinner.stop();
          console.log(chalk.yellow('\nStopped watching.'));
          process.exit(0);
        });
        
      } else {
        // Single check
        const spinner = ora('Checking status...').start();
        
        const result = await getFeedbackStatus(id);
        
        spinner.stop();
        
        if (options.json) {
          console.log(JSON.stringify({ success: true, data: result }, null, 2));
          return;
        }
        
        console.log(chalk.blue('\n📊 Status Information:'));
        console.log(chalk.gray('─'.repeat(40)));
        console.log(chalk.blue('ID:'), result.id);
        console.log(chalk.blue('Title:'), result.signal_title || result.title);
        console.log(chalk.blue('Status:'), 
          result.status === 'completed' ? chalk.green(result.status) :
          result.status === 'processing' ? chalk.yellow(result.status) :
          result.status === 'pending_step2' ? chalk.yellow('pending') :
          result.status === 'failed' ? chalk.red(result.status) :
          result.status === 'new' ? chalk.blue(result.status) :
          result.status === 'in_review' ? chalk.yellow(result.status) :
          result.status === 'addressed' ? chalk.green(result.status) :
          result.status === 'archived' ? chalk.gray(result.status) :
          chalk.red(result.status)
        );
        console.log(chalk.blue('Created:'), result.created_at ? new Date(result.created_at).toLocaleString() : 'Unknown');
        console.log(chalk.blue('Updated:'), result.updated_at ? new Date(result.updated_at).toLocaleString() : 'Unknown');
        console.log(chalk.blue('Credits Used:'), result.creditsConsumed || 'Unknown');
        console.log(chalk.blue('AI Feedback Generated:'), result.feedbackCount || 0);
        
        if (result.status === 'completed' && (result.feedbackCount || 0) > 0) {
          console.log(chalk.green('\n🎯 Use "cl list" to see the generated AI feedback!'));
        } else if (result.status === 'processing') {
          console.log(chalk.yellow('\n⏳ Still processing... Use "cl status <id> --watch" to monitor'));
        }
      }

    } catch (error: any) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });
