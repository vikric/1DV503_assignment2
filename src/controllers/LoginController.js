import { pool } from "../config/db.js";
import bcrypt from "bcrypt";
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
  async index(req, res, next) {
    const flash = req.session.flash;
    delete req.session.flash;

    res.render("login/index", { flash });
  }

  async findUser(email) {
    const [rows] = await pool.query("Select * FROM members where email = ? ", [
      email,
    ]);
    return rows[0];
  }
  async comparePassword(dbUser, enteredPassword) {
    return bcrypt.compare(enteredPassword, dbUser.password);
  }
  async loginUser(req, res, next) {
    try {
      const { email, password } = req.body;

      console.log(email, password);
      // Find user
      const user = await this.findUser(email);
      // Compare passwords
      const compare = await this.comparePassword(user, password);

      if (!compare) {
        req.session.flash = { type: "danger", text: "Wrong Email or Password" };
        res.render("login/index", { flash: req.session.flash });
      }

      // Send a success response

      req.session.user = {
        id: user.id,
        email: user.email,
      };
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
