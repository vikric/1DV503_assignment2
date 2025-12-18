import crypto from 'crypto'

/**
 * Middleware to generate a CSRF token and set it as a cookie.
 *
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
export const generateCsrfToken = (req, res, next) => {
  const csrfToken = crypto.randomBytes(32).toString('hex')
  res.cookie('XSRF-TOKEN', csrfToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  })

  res.locals.csrfToken = csrfToken
  next()
}

/**
 * Middleware to validate the CSRF token.
 *
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {void}
 */
export const validateCsrfToken = (req, res, next) => {
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    const csrfToken = req.body._csrf || req.cookies['XSRF-TOKEN']

    if (!csrfToken || csrfToken !== req.cookies['XSRF-TOKEN']) {
      console.error('CSRF token validation failed')
      return res.status(404).send('Invalid CSRF token')
    }
  }
  next()
}
