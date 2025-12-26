import { pool } from "../config/db.js";
/**
 * Encapsulates a controller.
 */
export class CheckoutController {
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

  async checkout(req, res, next) {
    const userid = req.session.user.id;
    /* const user = req.session.user.name; */
    /*     console.log('ALLT', req) */

    try {
      // 1. Hämta användarens adress
      const userSql = `
      SELECT fname, lname, address, city, zip
      FROM members
      WHERE userid = ?
    `;
      const [[member]] = await pool.query(userSql, [userid]);

      console.log(member);
      // 2. Hämta cart-innehåll
      const cartSql = `
      SELECT 
        b.isbn,
        b.title,
        b.price,
        c.qty,
        (b.price * c.qty) AS amount
      FROM cart c
      JOIN books b ON c.isbn = b.isbn
      WHERE c.userid = ?
    `;
      const [cartItems] = await pool.query(cartSql, [userid]);

      // 3. Skapa order
      const orderSql = `INSERT INTO orders
      (userid, created, shipAddress, shipCity, shipZip)
      VALUES (?, NOW(), ?, ?, ?)
    `;

      const [orderResult] = await pool.query(orderSql, [
        userid,
        member.address,
        member.city,
        member.zip,
      ]);

      const orderId = orderResult.insertId;

      // 4. Skapa order_details
      const detailSql = `
      INSERT INTO odetails (ono, isbn, qty, amount)
      VALUES (?, ?, ?, ?)
    `;

      for (const item of cartItems) {
        await pool.query(detailSql, [
          orderId,
          item.isbn,
          item.qty,
          item.amount,
        ]);
      }

      // 5. Töm cart
      await pool.query("DELETE FROM cart WHERE userid = ?", [userid]);

      // 6. Beräkna total & leveransdatum
      const orderTotal = cartItems.reduce((sum, item) => sum + item.amount, 0);
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 7);

      res.render("order/invoice", {
        orderId,
        member,
        cartItems,
        orderTotal,
        deliveryDate,
      });
    } catch (error) {
      next(error);
    }
  }
}
