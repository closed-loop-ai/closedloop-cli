import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { CommandOptions } from '../types';
import { updateTeamWebsite } from '../api/team';

export const teamCommand = new Command('team')
  .description('Manage team settings')
  .action(async (options: CommandOptions) => {
    console.log(chalk.yellow('Use team subcommands to manage team settings'));
    console.log(chalk.black('Available commands: website'));
  });

// Team website subcommand
const teamWebsiteCommand = new Command('website')
  .description('Manage team website')
  .action(async (options: CommandOptions) => {
    console.log(chalk.yellow('Use website subcommands to manage team website'));
    console.log(chalk.black('Available commands: update'));
  });

// Update team website
const teamWebsiteUpdateCommand = new Command('update')
  .description('Update team website')
  .argument('<website>', 'Team website URL (must include http:// or https://)')
  .action(async (website: string, options: CommandOptions) => {
    try {
      const spinner = ora('Updating team website...').start();
      
      const result = await updateTeamWebsite(website);
      
      spinner.succeed('Team website updated successfully');
      console.log(chalk.green(`Website: ${result.website}`));
      console.log(chalk.gray(`Updated: ${result.updated_at}`));
      
    } catch (error: any) {
      ora().fail('Failed to update team website');
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

teamWebsiteCommand.addCommand(teamWebsiteUpdateCommand);
teamCommand.addCommand(teamWebsiteCommand);
