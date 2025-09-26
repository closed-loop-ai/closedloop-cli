import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { CommandOptions } from '../types';
import { getTeamWebsite, updateTeamWebsite } from '../api/team';

export const teamCommand = new Command('team')
  .description('Manage team settings')
  .action(async (options: CommandOptions) => {
    console.log(chalk.yellow('Use team subcommands to manage team settings'));
    console.log(chalk.black('Available commands: website'));
  });

// Team website subcommand
const teamWebsiteCommand = new Command('website')
  .description('Show or set team website')
  .argument('[website]', 'Team website URL (must include http:// or https://)')
  .option('--json', 'Output in JSON format')
  .action(async (website: string | undefined, options: CommandOptions) => {
    if (website) {
      // Set website
      try {
        const spinner = ora('Updating team website...').start();
        
        const result = await updateTeamWebsite(website);
        
        spinner.succeed('Team website updated successfully');
        
        if (options.json) {
          console.log(JSON.stringify({
            success: true,
            data: {
              website: result.website,
              updated_at: result.updated_at
            }
          }, null, 2));
        } else {
          console.log(chalk.green(`Website: ${result.website}`));
          console.log(chalk.gray(`Updated: ${result.updated_at}`));
        }
        
      } catch (error: any) {
        ora().fail('Failed to update team website');
        console.error(chalk.red(error.message));
        process.exit(1);
      }
    } else {
      // Show current website
      try {
        const spinner = ora('Fetching team website...').start();
        
        const result = await getTeamWebsite();
        
        spinner.succeed('Team website retrieved');
        
        if (options.json) {
          console.log(JSON.stringify({
            success: true,
            data: {
              website: result.website || null,
              updated_at: result.updated_at
            }
          }, null, 2));
        } else {
          if (result.website) {
            console.log(chalk.green(`Website: ${result.website}`));
            console.log(chalk.gray(`Updated: ${result.updated_at}`));
          } else {
            console.log(chalk.yellow('No website set for this team'));
          }
        }
        
      } catch (error: any) {
        ora().fail('Failed to fetch team website');
        console.error(chalk.red(error.message));
        process.exit(1);
      }
    }
  });
teamCommand.addCommand(teamWebsiteCommand);
