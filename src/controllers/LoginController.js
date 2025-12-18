/**
 * Encapsulates a controller.
 */
export class LoginController {
  /**
   * Renders a view and sends the rendered HTML string as an HTTP response.
   * index GET.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  index(req, res, next) {
    res.render("login/index");
  }
  fisk(req, res, next) {
    console.log("FISKE");
  }
}
