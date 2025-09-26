import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

interface Config {
  apiKey?: string;
  baseUrl?: string;
}

class ConfigManager {
  private configPath: string;
  private config: Config = {};

  constructor() {
    this.configPath = path.join(os.homedir(), '.closedloop', 'config.json');
    this.load();
  }

  private load(): void {
    try {
      if (fs.existsSync(this.configPath)) {
        const data = fs.readFileSync(this.configPath, 'utf8');
        this.config = JSON.parse(data);
      }
    } catch (error) {
      // Ignore config load errors
    }
  }

  private save(): void {
    try {
      const dir = path.dirname(this.configPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
    } catch (error) {
      throw new Error('Failed to save configuration');
    }
  }

  get(key?: keyof Config): any {
    if (key) {
      return this.config[key];
    }
    return { ...this.config };
  }

  set(key: keyof Config, value: any): void {
    this.config[key] = value;
    this.save();
  }

  getConfigPath(): string {
    return fs.existsSync(this.configPath) ? this.configPath : 'Not created yet';
  }
}

export const config = new ConfigManager();
