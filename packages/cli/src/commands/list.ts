import { Command } from 'commander';
import chalk from 'chalk';
import { table } from 'table';
import { listFeedbacks } from '../api/feedback';
import { CommandOptions, FeedbackData, ListResponse } from '../types';
import { CONFIG, MESSAGES } from '../config/constants';

export const listCommand = new Command('list')
  .description('List customer inputs and generated AI feedback')
  .option('-p, --page <number>', 'Page number to show', '1')
  .option('-l, --limit <number>', 'How many items to show per page', '20')
  .option('-s, --status <status>', 'Show only items with this status (processing, completed, failed)')
  .option('--new', 'Show only inputs that are still being processed')
  .option('--json', 'Output in JSON format')
  .action(async (options: CommandOptions) => {
    try {
      const params: CommandOptions = {
        page: options.page || 1,
        limit: options.limit || CONFIG.DEFAULT_PAGE_SIZE
      };

      if (options.status) {
        params.status = options.status;
      }

      const result = options.new 
        ? await listFeedbacks(params, true) // new feedbacks
        : await listFeedbacks(params, false); // processed feedbacks

      const feedbacks = result.feedbacks || result.data || [];
      if (feedbacks.length === 0) {
        if (options.json) {
          console.log(JSON.stringify({ success: true, data: [], pagination: result.pagination || {} }, null, 2));
        } else {
          console.log(chalk.yellow('No customer inputs found.'));
        }
        return;
      }

      if (options.json) {
        console.log(JSON.stringify({ success: true, data: feedbacks, pagination: result.pagination || {} }, null, 2));
        return;
      }

      // Create table data
      const tableData = [
        ['ID', 'Title', 'Status', 'AI Feedback', 'Credits Used', 'Submitted']
      ];

      feedbacks.forEach((item: any) => {
        const statusColor = item.status === 'completed' ? 'green' : 
                           item.status === 'processing' ? 'yellow' : 
                           item.status === 'pending_step2' ? 'yellow' :
                           item.status === 'failed' ? 'red' :
                           item.status === 'new' ? 'blue' :
                           item.status === 'in_review' ? 'yellow' :
                           item.status === 'addressed' ? 'green' :
                           item.status === 'archived' ? 'gray' : 'red';
        
        tableData.push([
          item.id,
          item.title || 'Untitled',
          chalk[statusColor](item.status || 'unknown'),
          (item.feedbackCount || 0).toString(),
          (item.creditsConsumed || 0).toString(),
          item.timestamp ? new Date(item.timestamp).toLocaleString() : 'Unknown'
        ]);
      });

      console.log(chalk.blue('\n📋 Customer Inputs & AI Feedback:'));
      console.log(table(tableData));

      // Pagination info
      const pagination = result.pagination || {};
      if (pagination.pages > 1) {
        console.log(chalk.gray(`\nPage ${pagination.page} of ${pagination.pages} (${pagination.total} total items)`));
        console.log(chalk.gray('Use --page <number> to see more'));
      }

    } catch (error: any) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });
