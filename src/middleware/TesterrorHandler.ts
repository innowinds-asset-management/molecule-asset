// import { Request, Response, NextFunction } from 'express';
// import ResponseHandler from '../helper/responseHandler';

// export interface CustomError extends Error {
//   statusCode?: number;
//   code?: string;
// }

// export const errorHandler = (
//   err: CustomError,
//   req: Request,
//   res: Response,
//   _next: NextFunction
// ): void => {
//   let error = { ...err };
//   error.message = err.message;

//   // Log error for debugging
//   console.error('Error:', {
//     message: err.message,
//     stack: err.stack,
//     url: req.url,
//     method: req.method,
//     body: req.body,
//     params: req.params,
//     query: req.query,
//     userAgent: req.get('User-Agent'),
//     ip: req.ip
//   });

//   // Prisma errors
//   if (err.code === 'P2002') {
//     const message = 'Duplicate field value entered';
//     error = { message, statusCode: 400 } as CustomError;
//   }

//   if (err.code === 'P2014') {
//     const message = 'Invalid ID value';
//     error = { message, statusCode: 400 } as CustomError;
//   }

//   if (err.code === 'P2003') {
//     const message = 'Foreign key constraint failed';
//     error = { message, statusCode: 400 } as CustomError;
//   }

//   if (err.code === 'P2025') {
//     const message = 'Record not found';
//     error = { message, statusCode: 404 } as CustomError;
//   }

//   // Mongoose bad ObjectId
//   if (err.name === 'CastError') {
//     const message = 'Resource not found';
//     error = { message, statusCode: 404 } as CustomError;
//   }

//   // Mongoose duplicate key
//   if (err.code === '11000') {
//     const message = 'Duplicate field value entered';
//     error = { message, statusCode: 400 } as CustomError;
//   }

//   // Mongoose validation error
//   if (err.name === 'ValidationError') {
//     const message = Object.values((err as any).errors).map((val: any) => val.message).join(', ');
//     error = { message, statusCode: 400 } as CustomError;
//   }

//   // JWT errors
//   if (err.name === 'JsonWebTokenError') {
//     const message = 'Invalid token';
//     error = { message, statusCode: 401 } as CustomError;
//   }

//   if (err.name === 'TokenExpiredError') {
//     const message = 'Token expired';
//     error = { message, statusCode: 401 } as CustomError;
//   }

//   // Rate limit errors
//   if ((err as any).status === 429) {
//     const message = 'Too many requests, please try again later';
//     error = { message, statusCode: 429 } as CustomError;
//   }

//   // Default error
//   const statusCode = error.statusCode || (err as any).statusCode || 500;
//   const message = error.message || err.message || 'Server Error';

//   // res.status(statusCode).json({
//   //   success: false,
//   //   error: message,
//   //   ...(process.env['NODE_ENV'] === 'development' && { stack: err.stack })
//   // });

//   ResponseHandler.error(res, message, err.code || "SERVER_ERROR", statusCode, {
//     stack: process.env["NODE_ENV"] === "development" ? err.stack : undefined,
//   });
// }; 