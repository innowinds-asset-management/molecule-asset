import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';

import { errorHandler } from './middleware/errorHandler';
import { HealthController } from './controllers/healthController';
import { specs } from './swagger';
import assetTypeRoutes from './routes/assetType.route';
import assetSubTypeRoutes from './routes/assetSubType.route';
import assetRoutes from './routes/asset.route';
import installationRoutes from './routes/installation.route';
import poRoutes from './routes/po.route';
import poLineItemRoutes from './routes/poLineItem.route';
import grnRoutes from './routes/grn.route';
import grnItemRoutes from './routes/grnItem.route';
import departmentRoutes from './routes/department.route';
import locationRoutes from './routes/location.route';
import warrantyRoutes from './routes/warranty.route';
import serviceRequestRoutes from './routes/serviceRequest.route';
import serviceRequestStatusRoutes from './routes/serviceRequestStatus.route';
import assetConditionRoutes from './routes/assetCondition.route';
import consumerRoutes from './routes/consumer.route';
import supplierRoutes from './routes/supplier.route';
import consumerSupplierRoutes from './routes/consumerSupplier.route';
import warrantyTypeRoutes from './routes/warrantyType.route';
import entityIdRoutes from './routes/entityId.route';
import inventoryRoutes from './routes/inventory.route';
dotenv.config();

const app = express();
const healthController = new HealthController();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env['CORS_ORIGIN'] || '*',
  credentials: true
}));

// Compression middleware
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env['RATE_LIMIT_WINDOW_MS'] || '100'), // 10 minutes
  max: parseInt(process.env['RATE_LIMIT_MAX_REQUESTS'] || '100000'), // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use(limiter);

// Logging middleware
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Get service health status
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthStatus'
 *       503:
 *         description: Service is unhealthy
 */
app.get('/health', healthController.getHealth);

/**
 * @swagger
 * /ready:
 *   get:
 *     summary: Check if service is ready to handle requests
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is ready
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "ready"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       503:
 *         description: Service is not ready
 */
app.get('/ready', healthController.getReadiness);

/**
 * @swagger
 * /live:
 *   get:
 *     summary: Check if service is alive
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is alive
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "alive"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 uptime:
 *                   type: number
 *                   description: Service uptime in seconds
 */
app.get('/live', healthController.getLiveness);

// API routes
const apiPrefix = process.env['API_PREFIX'] || '/api/v1';
// Asset Type routes
app.use(`${apiPrefix}/asset-type`, assetTypeRoutes);
// Asset Sub Type routes
app.use(`${apiPrefix}/asset-sub-type`, assetSubTypeRoutes);
// Asset routes
app.use(`${apiPrefix}/asset`, assetRoutes);
// Installation routes
app.use(`${apiPrefix}/installation`, installationRoutes);
// Purchase Order routes
app.use(`${apiPrefix}/po`, poRoutes);
// Purchase Order Line Item routes
app.use(`${apiPrefix}/po-line-item`, poLineItemRoutes);
// Goods Received Note routes
app.use(`${apiPrefix}/grn`, grnRoutes);
// Goods Received Note Item routes
app.use(`${apiPrefix}/grn-item`, grnItemRoutes);
// Department routes
app.use(`${apiPrefix}/department`, departmentRoutes);
// Location routes
app.use(`${apiPrefix}/location`, locationRoutes);
// Warranty routes
app.use(`${apiPrefix}/warranty`, warrantyRoutes);
// Service Request routes
app.use(`${apiPrefix}/servicerequest`, serviceRequestRoutes);
// Service Request Status routes
app.use(`${apiPrefix}/service-request-status`, serviceRequestStatusRoutes);
// Asset Condition routes
app.use(`${apiPrefix}/asset-condition`, assetConditionRoutes);
// Consumer routes
app.use(`${apiPrefix}/consumer`, consumerRoutes);
// Supplier routes
app.use(`${apiPrefix}/supplier`, supplierRoutes);
// Consumer Supplier routes
app.use(`${apiPrefix}/consumer-supplier`, consumerSupplierRoutes);
// Warranty Type routes
app.use(`${apiPrefix}/warranty-type`, warrantyTypeRoutes);
// Entity ID routes
app.use(`${apiPrefix}/entity-id`, entityIdRoutes);
// Inventory routes (includes unit measures)
app.use(`${apiPrefix}/inventory`, inventoryRoutes);
// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Asset Atom Service API Documentation'
}));

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (_req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

export default app; 