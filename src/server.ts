import { PrismaClient } from '@prisma/client';
import app from './app';

const prisma = new PrismaClient();
const PORT = parseInt(process.env['PORT'] || '8080');
const HOST = process.env['HOST'] || '0.0.0.0'; // Listen on all interfaces

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  console.log(`Received ${signal}. Closing HTTP server and database connection...`);
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Start server
try {
  app.listen(PORT, HOST, () => {
    console.log(`Consumer service running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`API Base URL: http://localhost:${PORT}${process.env['API_PREFIX'] || '/api/v1'}`);
  });
} catch (error) {
  console.error('Error starting server:', error);
  process.exit(1);
}


export default app; 