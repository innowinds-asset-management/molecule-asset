import { Response } from 'express';

class ResponseHandler {
    static success(res: Response, msg: string = "Success", payload: any = [], code: string = "", status: number = 200) {
      return res.status(status).json({
        success: 1,
        msg,
        code,
        payload: Array.isArray(payload) ? payload : payload,
      });
    }
  
    static error(res: Response, msg: string = "Something went wrong", code: string = "", status: number = 500, payload: any = []) {
      return res.status(status).json({
        success: 0,
        msg,
        code,
        payload: Array.isArray(payload) ? payload : payload,
      });
    }
  }
  
export default ResponseHandler;
