import dotenv from 'dotenv';

dotenv.config();

export interface Config {
  // Server Configuration
  port: number;
  nodeEnv: string;
  
  // Database Configuration
  database: {
    url: string;
  };
  

  
  // Security Configuration
  security: {
    rateLimitWindowMs: number;
    rateLimitMaxRequests: number;
  };
  
  // Logging Configuration
  logging: {
    level: string;
    enableConsole: boolean;
    enableFile: boolean;
  };
  

}

export const config: Config = {
  port: parseInt(process.env['PORT'] || '3000'),
  nodeEnv: process.env['NODE_ENV'] || 'development',
  
  database: {
    url: process.env['DATABASE_URL'] || 'mysql://root@localhost:3306/asset_atom',
  },
  

  
  security: {
    rateLimitWindowMs: parseInt(process.env['RATE_LIMIT_WINDOW_MS'] || '900000'),
    rateLimitMaxRequests: parseInt(process.env['RATE_LIMIT_MAX_REQUESTS'] || '100'),
  },
  
  logging: {
    level: process.env['LOG_LEVEL'] || 'info',
    enableConsole: process.env['LOG_ENABLE_CONSOLE'] !== 'false',
    enableFile: process.env['LOG_ENABLE_FILE'] === 'true',
  },
  

};

export default config; 