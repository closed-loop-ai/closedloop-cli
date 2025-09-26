#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { handleInputCommand } from './commands/input';
import { handleFeedbackCommand } from './commands/feedback';
import { configCommand } from './commands/config';
import { teamCommand } from './commands/team';
import { CliError, handleApiError } from './utils/errors';
import { CommandOptions } from './types';

// Create the main program
const program = new Command();

program
  .name('cl')
  .description('ClosedLoop AI CLI - AI-powered customer feedback analysis for product management')
  .version('0.2.0')
  .addHelpText('before', chalk.blue(`
╔══════════════════════════════════════════════════════════════════════════════╗
║                        ClosedLoop AI CLI v0.2.0                            ║
║                    AI-Powered Customer Feedback Analysis                     ║
╚══════════════════════════════════════════════════════════════════════════════╝
`))
  .addHelpText('after', chalk.black(`
Commands:
  input [content]              Submit customer input for AI analysis
  input                        List all customer inputs
  input <id>                   Show specific input details

  feedback                     List AI-generated feedback
  feedback <id>                Show specific feedback details

  team                         Manage team settings
  team website update <url>    Update team website

  config                       Show current configuration
  config set --api-key <key>   Set API key

  version                      Show version information
  help [command]               Show help for a command

Examples:
  $ cl input "Dashboard is confusing"
  $ cl input
  $ cl input 74e3dd87-878f-41cf-8e5a-87527bbf7770
  $ cl feedback
  $ cl feedback 2ea8f556-052b-4f5c-bf86-833780b3d00d
  $ cl team website update "https://example.com"
  $ cl config set --api-key your-api-key-here

Pagination:
  $ cl input --page 2 --limit 10
  $ cl feedback --page 2

Get API keys for free at https://closedloop.sh
`));

// Add input command
program
  .command('input [content]')
  .description('Submit customer input for AI analysis or list inputs')
  .option('-t, --title <title>', 'Title for this input')
  .option('-u, --url <url>', 'Source URL (support ticket, survey, etc.)')
  .option('-c, --customer <id>', 'Customer identifier')
  .option('-n, --name <name>', 'Name of person who provided the input')
  .option('-e, --email <email>', 'Email of person who provided the input')
  .option('--interactive', 'Fill in details step by step')
  .option('-w, --wait', 'Wait until processing is completed')
  .option('--json', 'Output in JSON format')
  .option('--page <number>', 'Page number for list', '1')
  .option('--limit <number>', 'Items per page for list', '20')
  .option('--status <status>', 'Filter by status (processing, completed, failed)')
  .option('--search <query>', 'Search in input content')
  .action(async (content, options: CommandOptions) => {
    try {
      await handleInputCommand(content, options);
    } catch (error: any) {
      handleError(error, options);
    }
  });

// Add feedback command
program
  .command('feedback [id]')
  .description('List AI-generated feedback or show specific feedback details')
  .option('--json', 'Output in JSON format')
  .option('--page <number>', 'Page number for list', '1')
  .option('--limit <number>', 'Items per page for list', '20')
  .option('--search <query>', 'Search feedback by content')
  .action(async (id, options: CommandOptions) => {
    try {
      await handleFeedbackCommand(id, options);
    } catch (error: any) {
      handleError(error, options);
    }
  });

// Add config command
program.addCommand(configCommand);

// Add team command
program.addCommand(teamCommand);

// Add version command
program
  .command('version')
  .description('Show version information')
  .action(() => {
    console.log(chalk.blue('ClosedLoop AI CLI v0.2.0'));
    console.log(chalk.gray('AI-Powered Customer Feedback Analysis'));
    console.log(chalk.gray('Get started: https://closedloop.sh'));
  });

// Add help command
program
  .command('help [command]')
  .description('Show help for a command')
  .action((command) => {
    if (command) {
      program.outputHelp();
    } else {
      program.outputHelp();
    }
  });

// Error handling function
function handleError(error: any, options: CommandOptions) {
  if (options.json) {
    console.log(JSON.stringify({
      success: false,
      error: error.message,
      code: error.code || 'UNKNOWN_ERROR',
      details: error.response?.data || 'Unknown error occurred'
    }, null, 2));
  } else {
    if (error instanceof CliError) {
      console.error(chalk.red('❌ Error:'), error.message);
      if (error.code === 'NO_API_KEY') {
        console.log(chalk.black('\n💡 To fix:'));
        console.log(chalk.black('   1. Get your free API key at: https://closedloop.sh'));
        console.log(chalk.black('   2. Run: cl config set --api-key <your-key>'));
      }
    } else {
      const cliError = handleApiError(error);
      console.error(chalk.red('❌ Error:'), cliError.message);
      console.log(chalk.black('\n💡 Get help: cl --help'));
    }
  }
  process.exit(error.exitCode || 1);
}

// Handle unknown commands
program.on('command:*', (operands) => {
  console.error(chalk.red(`Unknown command: ${operands[0]}`));
  console.log(chalk.gray('Run "cl --help" to see available commands'));
  process.exit(1);
});

// Parse command line arguments
program.parse();

// If no command provided, show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}