/**
 * Throws an error with a specified status and message, and passes it to the next middleware.
 *
 * @param {number} status - The HTTP status code of the error.
 * @param {string} message - The error message.
 * @param {Function} next - The next middleware function.
 */
export const throwError = (status, message, next) => {
  const error = new Error(message)
  error.status = status
  next(error)
}
