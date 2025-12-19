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
    const flash = req.session.flash;
    delete req.session.flash;

    res.render("login/index", { flash });
  }

  loginUser(req, res, next) {
    try {
      const { email, password } = req.body;

      console.log(email, password);

      // Check if email exist

      // Create new user and hash password

      // Send a success response

      req.session.flash = {
        type: "success",
        text: `Login successful.`,
      };
      console.log(req.session.flash);
      res.redirect("/");
    } catch (error) {
      console.error("Registration error:", error);
      req.session.flash = { type: "danger", text: "Wrong Email or Password" };
      res.render("login/index", { flash: req.session.flash });
    }
  }
}
