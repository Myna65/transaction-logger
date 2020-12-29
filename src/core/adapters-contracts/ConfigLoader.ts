import { Config } from '../Config';

export interface ConfigLoader {
  loadConfig(): Config;
}
