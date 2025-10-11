export class ForbiddenError extends Error {
  private static readonly CODE = 'FORBIDDEN_ERROR';

  code = ForbiddenError.CODE;
  status = 403;

  constructor(message?: string) {
    super(message ?? ForbiddenError.CODE);
  }
}
