import { pool } from "../config/db.js";
import { hashPassword, validateUser } from "../middleware/helper.js";
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

  async checkForExistingMember(req, res, email) {
    const [rows] = await pool.query("Select * FROM members where email = ? ", [
      email,
    ]);
    if (rows.length > 0) {
      req.session.flash = {
        type: "danger",
        text: `Mail, ${email} already exist! `,
      };
      res.render("register/index", { flash: req.session.flash });
    }
  }

  async registerUser(req, res, next) {
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

      let user = {
        firstName,
        lastName,
        address,
        city,
        zipCode,
        phoneNumber,
        email,
        password,
      };

      validateUser(req, res, user);

      // Check if email exist
      await this.checkForExistingMember(email);

      // Create new user and hash password
      const newPass = await hashPassword(user.password);
      console.log("old: ", user.password);
      user.password = newPass;

      console.log("New : ", user.password);
      await this.createUser(user);
      // Send a success response
      req.session.flash = {
        type: "success",
        text: `Welcome, ${firstName}! Registration successful.`,
      };
      res.redirect("/");
    } catch (error) {
      console.error("FEL");
    }
  }

  async createUser(user) {
    try {
      const sql = `INSERT INTO members ( fname, lname, address, city, zip, phone, email, password ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
      const values = Object.values(user);

      const [result] = await pool.query(sql, values);
      return result;
    } catch (error) {
      console.error("❌ DB ERROR");
      console.error(error.message);
      throw error;
    }
  }


}
