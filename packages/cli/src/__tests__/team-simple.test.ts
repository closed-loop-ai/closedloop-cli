import { teamCommand } from '../commands/team';

// Mock chalk and ora
jest.mock('chalk', () => ({
  green: (text: string) => text,
  yellow: (text: string) => text,
  gray: (text: string) => text,
  red: (text: string) => text,
  black: (text: string) => text
}));

jest.mock('ora', () => {
  const mockSpinner = {
    start: jest.fn().mockReturnThis(),
    succeed: jest.fn().mockReturnThis(),
    fail: jest.fn().mockReturnThis()
  };
  return jest.fn(() => mockSpinner);
});

describe('Team Commands - Simple Tests', () => {
  it('should be a valid Command instance', () => {
    expect(teamCommand).toBeDefined();
    expect(teamCommand.name()).toBe('team');
  });

  it('should have website subcommand', () => {
    const websiteCommand = teamCommand.commands.find(cmd => cmd.name() === 'website');
    expect(websiteCommand).toBeDefined();
    expect(websiteCommand?.name()).toBe('website');
  });

  it('should show help when no subcommand provided', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    await teamCommand.parseAsync(['team']);
    
    expect(consoleSpy).toHaveBeenCalledWith('Use team subcommands to manage team settings');
    expect(consoleSpy).toHaveBeenCalledWith('Available commands: website');
    
    consoleSpy.mockRestore();
  });
});
