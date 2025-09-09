import { Response } from 'express';

class ResponseHandler {
    static success(res: Response, msg: string = "Success", payload: any = [], code: string = "", status: number = 200) {
      // Handle null/undefined payload by defaulting to empty array
      const safePayload = payload === null || payload === undefined ? [] : payload;
      
      return res.status(status).json({
        success: 1,
        msg,
        code,
        payload: safePayload,
      });
    }
  
    static error(res: Response, msg: string = "Something went wrong", code: string = "", status: number = 500, payload: any = []) {
      // For errors, always use empty array as default to maintain consistency
      const safePayload = payload === null || payload === undefined ? [] : payload;
      
      return res.status(status).json({
        success: 0,
        msg,
        code,
        payload: safePayload,
      });
    }
  }
  
export default ResponseHandler;
