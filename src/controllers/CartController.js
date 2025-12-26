import { pool } from "../config/db.js";
/**
 * Encapsulates a controller.
 */
export class CartController {
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

  async viewCart(req, res, next) {
    const userid = req.session.user.id; // eller req.body.id

    try {
      const sql = `
      SELECT 
        b.isbn,
        b.title,
        b.price,
        c.qty,
        (b.price * c.qty) AS row_total
      FROM cart c
      JOIN books b ON c.isbn = b.isbn
      WHERE c.userid = ?
    `;

      const [rows] = await pool.query(sql, [userid]);

      // Get total sum
      const total = rows.reduce((sum, item) => {
        return sum + item.row_total;
      }, 0);

      res.render("cart/index", {
        cartItems: rows,
        total,
      });
    } catch (error) {
      next(error);
    }
  }
}
