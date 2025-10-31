export class UnauthorizedError extends Error {
  code = 401;
  status = 'UNAUTHORIZED';
}
