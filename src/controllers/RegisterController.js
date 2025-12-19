/**
 * Encapsulates a controller.
 */
export class RegisterController {
  /**
   * Renders a view and sends the rendered HTML string as an HTTP response.
   * index GET.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  index(req, res, next) {
    res.render("register/index");
  }

  registerUser(req, res, next) {
    try {
      const {
        firstName,
        lastName,
        address,
        city,
        zipCode,
        phoneNumber,
        email,
        password,
      } = req.body;

      console.log(
        firstName,
        lastName,
        address,
        city,
        zipCode,
        phoneNumber,
        email,
        password
      );

      // Check if email exist

      // Create new user and hash password

      // Send a success response
      req.session.flash = {
        type: "success",
        text: `Welcome, ${firstName}! Registration successful.`,
      };
      res.redirect("/");
    } catch (error) {
      console.error("FEL");
      /*       console.error("Registration error:", error);
      req.session.flash = { type: "danger", text: "ERROR" };
      res.redirect("/?registered=false"); */
    }
  }
}
