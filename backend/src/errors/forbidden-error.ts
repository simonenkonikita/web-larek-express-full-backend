import statusCode from './statusCode';

class ForbiddenError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = statusCode.FORBIDDEN;
  }
}

export default ForbiddenError;
