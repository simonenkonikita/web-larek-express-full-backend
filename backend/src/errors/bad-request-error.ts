import statusCode from './statusCode';

class BadRequestError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = statusCode.BAD_REQUEST;
  }
}
export default BadRequestError;
