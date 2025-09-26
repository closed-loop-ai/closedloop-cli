import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { config } from '../config';
import { validateApiKey } from '../api/auth';
import { CommandOptions } from '../types';
import { CONFIG, MESSAGES, URLS } from '../config/constants';
import { validateApiKey as validateApiKeyFormat } from '../utils/validation';

// Create config command
export const configCommand = new Command('config')
  .description('Configure your API key and settings')
  .option('--set-api-key <key>', 'Set your API key')
  .option('--set-team <team>', 'Set your team (future feature)')
  .option('--json', 'Output in JSON format')
  .action(async (options: CommandOptions) => {
    try {
      await handleConfig(options);
    } catch (error: any) {
      handleError(error, options);
    }
  });

// Create config subcommands
const configSetCommand = new Command('set')
  .description('Set configuration values')
  .option('--api-key <key>', 'Set API key')
  .option('--team <team>', 'Set team (future feature)')
  .action(async (options: CommandOptions) => {
    try {
      await handleConfigSet(options);
    } catch (error: any) {
      handleError(error, options);
    }
  });

const configShowCommand = new Command('show')
  .description('Show current configuration')
  .option('--json', 'Output in JSON format')
  .action(async (options: CommandOptions) => {
    try {
      await handleConfigShow(options);
    } catch (error: any) {
      handleError(error, options);
    }
  });

// Add subcommands to main config command
configCommand.addCommand(configSetCommand);
configCommand.addCommand(configShowCommand);

// Helper functions
async function handleConfig(options: CommandOptions) {
  const currentConfig = config.get();

  if (options.setApiKey) {
    await setApiKey(options.setApiKey, options);
    return;
  }

  if (options.setTeam) {
    console.log(chalk.yellow('⚠️  Team configuration is not yet implemented'));
    console.log(chalk.black('This feature will be available in a future update.'));
    return;
  }

  // Show current config
  await showConfig(currentConfig, options);
}

async function handleConfigSet(options: CommandOptions) {
  if (options.apiKey) {
    await setApiKey(options.apiKey, options);
  } else if (options.team) {
    console.log(chalk.yellow('⚠️  Team configuration is not yet implemented'));
    console.log(chalk.black('This feature will be available in a future update.'));
  } else {
    console.log(chalk.red('❌ No configuration option specified'));
    console.log(chalk.black('Use --api-key or --team to set values'));
    process.exit(1);
  }
}

async function handleConfigShow(options: CommandOptions) {
  const currentConfig = config.get();
  await showConfig(currentConfig, options);
}

async function setApiKey(apiKey: string, options: CommandOptions) {
  try {
    // Validate API key format
    const validatedApiKey = validateApiKeyFormat(apiKey);
    
    // Validate API key by making a test request
    const spinner = ora('Validating API key...').start();
    
    try {
      await validateApiKey(validatedApiKey);
      spinner.succeed('API key validated successfully!');
      
      // Save the API key
      config.set('apiKey', validatedApiKey);
      
      if (options.json) {
        console.log(JSON.stringify({
          success: true,
          message: 'API key set successfully',
          data: {
            apiKey: validatedApiKey.substring(0, 8) + '...',
            configFile: config.getConfigPath(),
            configured: true
          }
        }, null, 2));
      } else {
        console.log(chalk.green('✅ API key set successfully!'));
        console.log(chalk.black(`Config file: ${config.getConfigPath()}`));
      }
    } catch (error: any) {
      spinner.fail('API key validation failed');
      
      if (error.response?.status === 401) {
        console.error(chalk.red('❌ Invalid API key'));
        console.log(chalk.black('\n💡 To get a valid API key:'));
        console.log(chalk.black('   1. Visit: https://closedloop.sh'));
        console.log(chalk.black('   2. Sign up or log in'));
        console.log(chalk.black('   3. Generate an API key'));
        console.log(chalk.black('   4. Run: cl config set-api-key <your-key>'));
      } else {
        console.error(chalk.red('❌ Validation Error:'), error.message);
        console.log(chalk.black('\n💡 Check your internet connection and try again'));
      }
      process.exit(1);
    }
  } catch (error: any) {
    console.error(chalk.red('❌ Invalid API key. Get your free API key at https://closedloop.sh'));
    process.exit(1);
  }
}

async function showConfig(currentConfig: any, options: CommandOptions) {
  if (options.json) {
    console.log(JSON.stringify({
      success: true,
      data: {
        apiKey: currentConfig.apiKey ? currentConfig.apiKey.substring(0, 8) + '...' : null,
        configFile: config.getConfigPath(),
        configured: !!currentConfig.apiKey
      }
    }, null, 2));
    return;
  }

  console.log(chalk.blue('\n⚙️  Configuration:'));
  console.log(chalk.black('─'.repeat(40)));
  
  if (currentConfig.apiKey) {
    console.log(chalk.blue('API Key:'), chalk.green('✓ Configured'));
  } else {
    console.log(chalk.blue('API Key:'), chalk.red('✗ Not configured'));
    console.log(chalk.black('Run: cl config set-api-key <your-key>'));
  }
  
  console.log(chalk.blue('Config File:'), config.getConfigPath());
  
  if (!currentConfig.apiKey) {
    console.log(chalk.yellow('\n💡 Get started:'));
    console.log(chalk.black('   1. Get your free API key at: https://closedloop.sh'));
    console.log(chalk.black('   2. Run: cl config set-api-key <your-key>'));
    console.log(chalk.black('   3. Submit your first input: cl input "Your feedback here"'));
  }
}

function handleError(error: any, options: CommandOptions) {
  if (options.json) {
    console.log(JSON.stringify({
      success: false,
      error: error.message,
      details: error.response?.data || 'Unknown error occurred'
    }, null, 2));
  } else {
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      console.error(chalk.red('❌ Connection Error:'), 'Cannot connect to ClosedLoop servers');
      console.log(chalk.black('\n💡 Check your internet connection and try again'));
    } else {
      console.error(chalk.red('❌ Error:'), error.message);
      console.log(chalk.black('\n💡 Get help: cl --help'));
    }
  }
  process.exit(1);
}

export { configCommand as default };