export class BadRequestError extends Error {
  private static readonly CODE = 'BAD_REQUEST_ERROR';

  code = BadRequestError.CODE;
  status = 400;

  constructor(message?: string) {
    super(message ?? BadRequestError.CODE);
  }
}
