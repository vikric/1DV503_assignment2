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

      const maxPagesToShow = 8;

      const startPage = Math.max(1, currentPage - 1);

      const endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);

      const viewData = {
        books: rows,
        totalPages: totalPages,
        currentPage: currentPage,
        limit: currentLimit,
        author: author,
        title: title,
        subject: subject,
        startPage,
        endPage,
      };
      res.render("home/index", {
        viewData,
      });
    } catch (error) {
      next(error);
    }
  }

  async addToCart(req, res, next) {
    /* const userid = req.session.user.id; */
    const { id, isbn, amount } = req.body;
    const qty = parseInt(amount);
    console.log(amount)

    try {
      // Check if book exist in cart
      const checkSql = `
      SELECT qty 
      FROM cart 
      WHERE userid = ? AND isbn = ?
    `;

      const [rows] = await pool.query(checkSql, [id, isbn]);

      // Update Cart if book already exist
      if (rows.length > 0) {
        const updateSql = `
        UPDATE cart 
        SET qty = qty + ? 
        WHERE userid = ? AND isbn = ?
      `;

        await pool.query(updateSql, [qty, id, isbn]);
      } else {
        const insertSql = `INSERT INTO cart (userid, isbn, qty) 
        VALUES (?, ?, ?)`;
        await pool.query(insertSql, [id, isbn, qty]);
      }
      const data = {
        userid: id,
        isbn,
        qty: amount,
      };

      res.redirect("/books");
    } catch (error) {
      console.error("❌ DB ERROR");
      console.error(error.message);
      throw error;
    }
  }
}
