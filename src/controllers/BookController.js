import { pool } from "../config/db.js";
/**
 * Encapsulates a controller.
 */
export class BookController {
  /**
   * Renders a view and sends the rendered HTML string as an HTTP response.
   * index GET.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  index(req, res, next) {
    res.render("member/index");
  }

  async findAuthor(req, res, next) {
    const { author } = req.body;
    console.log(author);
    const [rows] = await pool.query(
      "Select * FROM books where author like ? limit 20 ",
      ["%" + author + "%"]
    );
    /* console.log(rows[0]); */
    console.log(rows);
    return rows;
    /* return rows[0]; */
  }
}
