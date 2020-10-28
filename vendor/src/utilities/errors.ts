export namespace ErrorConst {
  // Http codes
  export const BAD_REQUEST = 400;
  export const UNAUTHORIZED = 401;
  export const FORBIDDEN = 403;
  export const NOT_FOUND = 404;
  export const REQUEST_TIME_OUT = 408;
  export const CONFLICT = 409;
  export const INTERNAL_SERVER_ERROR = 500;
  export const BAD_GATEWAY = 502;
  export const SERVICE_UNAVAILABLE = 503;
  export const GATEWAY_TIMEOUT = 504;

  // Error Messages
  export const GENERAL_ERROR_MSG = 'Internal Server Error';
  export const DUPLICATE_SELLER = 'Vendor already present';
  export const VALIDATION_ERROR_MSG = 'Please pass valid payload';
  export const SELLER_NOT_FOUND = 'Vendor not found';
}

export class CustomError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
    this.status = status;
  }
}
