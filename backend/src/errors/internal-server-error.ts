import statusCode from './statusCode';

class InternalServerError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = statusCode.INTERNAL_SERVER_ERROR;
  }
}

export default InternalServerError;
