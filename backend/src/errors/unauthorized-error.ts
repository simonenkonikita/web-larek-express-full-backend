import statusCode from './statusCode';

class UnauthorizedError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = statusCode.UNAUTHORIZED;
  }
}

export default UnauthorizedError;
