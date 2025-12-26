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
    const { author, title, limit, subject, page } = req.query;

    // Set default-values
    const currentLimit = parseInt(limit) || 2;
    const currentPage = parseInt(page) || 1;
    const offset = (currentPage - 1) * currentLimit;
    let query = "SELECT * FROM books WHERE 1=1 ";
    let countQuery = "SELECT COUNT(*) AS total FROM books WHERE 1=1 ";
    let params = [];
    console.log("STUFF", req.query);

    if (author) {
      countQuery += "AND author LIKE ?";
      query += "AND author LIKE ?";
      params.push(`%${author}%`);
    }

    if (title) {
      countQuery += "AND title LIKE ?";
      query += "AND title LIKE ?";
      params.push(`%${title}%`);
    }

    if (subject) {
      countQuery += "AND subject LIKE ?";
      query += "AND subject LIKE ?";
      params.push(`%${subject}%`);
    }

    query += " LIMIT ? OFFSET ?";
    params.push(currentLimit, offset);

    try {
      // Get books from filter
      const [rows] = await pool.query(query, params);

      // Count books from filter
      const [countRows] = await pool.query(countQuery, params);

      // Get total book amount from filter
      const totalBooks = countRows[0].total;
      const totalPages = Math.ceil(totalBooks / currentLimit);

      const viewData = {
        books: rows,
        totalPages: totalPages,
        currentPage: currentPage,
        limit: currentLimit,
        author: author,
        title: title,
        subject: subject,
      };
      res.render("home/index", {
        viewData,
      });
    } catch (error) {
      next(error);
    }
  }

  async addToCart(req, res, next) {
    console.log("BODY", req.body);

    console.log(req.session.user.id);

    res.render("home/index", {
      viewData: {
        books: [],
      },
    });
  }
}
