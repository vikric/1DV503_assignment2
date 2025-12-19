/**
 * Middleware to handle flash messages.
 *
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
export const flashMessages = (req, res, next) => {
  res.locals.flash = null

  if (req.query.flash) {
    res.locals.flash = { type: 'success', text: decodeURIComponent(req.query.flash) }
  }

  if (req.session.flash) {
    res.locals.flash = req.session.flash
    delete req.session.flash // Remove after displaying
  }

  next()
}
