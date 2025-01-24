export class ApiErrorResponse {
    success: boolean;
    message: string;
    error: any;
  
    constructor(success: boolean, message: string, error: any) {
      this.success = success;
      this.message = message;
      this.error = error;
    }
  }