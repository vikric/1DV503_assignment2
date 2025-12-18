/**
 * Error handling middleware.
 *
 * @param {Error} err - The error object.
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {void}
 */
export const errorHandler = (err, req, res, next) => {
  console.error(err) // Log error for debugging
  // Handle 403 Forbidden
  if (err.status === 403) {
    req.session.flash = {
      type: 'danger', text: err.message
    }
    return res.redirect('../')
  }

  // Handle 404 Not Found
  if (err.status === 404) {
    if (err.message !== 'Not Found') {
      req.session.flash = {
        type: 'danger', text: err.message
      }
      return res.redirect('../')
    }
    return res.status(404).render('errors/404')
  }

  // Handle other errors (500 Internal Server Error)
  if (process.env.NODE_ENV === 'production') {
    return res.status(500).render('errors/500')
  }

  // Show detailed error in development
  res.status(err.status || 500).render('errors/error', { error: err })
}

/**
 * Formats error messages based on the model schema.
 *
 * @param {string} message - The error message to format.
 * @param {object} model - The model containing schema information.
 * @returns {string} - The formatted error message.
 */
export const formatString = (message, model) => {
  const errMessageSplit = message.split('Path')
    .filter(part => !part.includes('validation')) // Remove validation start text
    .map(part => {
      if (part.includes('username')) {
        if (part.includes('maximum')) {
          return `Username: is longer than the maximum allowed length (${model.schema.path('username').options.maxlength}).`
        } else return `Username: is shorter than the minimum allowed length (${model.schema.path('username').options.minlength}).`
      }

      if (part.includes('password')) {
        if (part.includes('maximum')) {
          return `Password: is longer than the maximum allowed length (${model.schema.path('password').options.maxlength}).`
        } if (part.includes('invalid')) {
          return 'Password: Requires atleast 1 digit'
        } else return `Password: is shorter than the minimum allowed length (${model.schema.path('password').options.minlength}).`
      }

      if (part.includes('description')) {
        if (part.includes('maximum')) {
          return `Description: is longer than the maximum allowed length (${model.schema.path('description').options.maxlength}).`
        } else return `Description: is shorter than the minimum allowed length (${model.schema.path('description').options.minlength}).`
      }

      if (part.includes('snippet')) {
        if (part.includes('maximum')) {
          return `Snippet: is longer than the maximum allowed length (${model.schema.path('snippet').options.maxlength}).`
        } else return `Snippet: is shorter than the minimum allowed length (${model.schema.path('snippet').options.minlength}).`
      }

      return part
    })

  return errMessageSplit.join(' ') // Join parts with space instead of comma
}
