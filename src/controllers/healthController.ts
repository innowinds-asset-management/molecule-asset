import { Request, Response } from 'express';
import DatabaseConnection from '../database/connection';
import config from '../config';

export class HealthController {
  private dbConnection: DatabaseConnection;

  constructor() {
    this.dbConnection = DatabaseConnection.getInstance();
  }

  public getHealth = async (_req: Request, res: Response): Promise<void> => {
    try {
      const dbHealth = await this.dbConnection.healthCheck();
      
      const healthStatus = {
        status: dbHealth ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
        service: 'Consumer Service',
        version: '1.0.0',
        environment: config.nodeEnv,
        checks: {
          database: dbHealth ? 'healthy' : 'unhealthy',
          memory: this.getMemoryUsage(),
          uptime: process.uptime()
        }
      };

      const statusCode = dbHealth ? 200 : 503;
      res.status(statusCode).json(healthStatus);
    } catch (error) {
      res.status(503).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        service: 'Consumer Service',
        error: 'Health check failed'
      });
    }
  };

  public getReadiness = async (_req: Request, res: Response): Promise<void> => {
    try {
      const dbHealth = await this.dbConnection.healthCheck();
      
      if (dbHealth) {
        res.status(200).json({
          status: 'ready',
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(503).json({
          status: 'not ready',
          timestamp: new Date().toISOString(),
          reason: 'Database connection failed'
        });
      }
    } catch (error) {
      res.status(503).json({
        status: 'not ready',
        timestamp: new Date().toISOString(),
        reason: 'Service unavailable'
      });
    }
  };

  public getLiveness = (_req: Request, res: Response): void => {
    res.status(200).json({
      status: 'alive',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  };

  private getMemoryUsage() {
    const usage = process.memoryUsage();
    return {
      rss: `${Math.round(usage.rss / 1024 / 1024 * 100) / 100} MB`,
      heapTotal: `${Math.round(usage.heapTotal / 1024 / 1024 * 100) / 100} MB`,
      heapUsed: `${Math.round(usage.heapUsed / 1024 / 1024 * 100) / 100} MB`,
      external: `${Math.round(usage.external / 1024 / 1024 * 100) / 100} MB`
    };
  }
} 