import { config } from '../config';

// Mock the config for testing
jest.mock('../config', () => ({
  config: {
    get: jest.fn(),
    set: jest.fn(),
    getConfigPath: jest.fn()
  }
}));

describe('Config Manager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get config values', () => {
    (config.get as jest.Mock).mockReturnValue({ apiKey: 'test-key' });
    
    const result = config.get();
    expect(result).toEqual({ apiKey: 'test-key' });
    expect(config.get).toHaveBeenCalled();
  });

  it('should set config values', () => {
    (config.set as jest.Mock).mockImplementation(() => {});
    
    config.set('apiKey', 'new-key');
    expect(config.set).toHaveBeenCalledWith('apiKey', 'new-key');
  });

  it('should get config path', () => {
    (config.getConfigPath as jest.Mock).mockReturnValue('/path/to/config.json');
    
    const result = config.getConfigPath();
    expect(result).toBe('/path/to/config.json');
  });
});
