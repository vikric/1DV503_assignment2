import express from "express";
import http from "node:http";
import { router as homeRouter } from "./homeRouter.js";
import { router as LoginRouter } from "./loginRouter.js";
import { router as RegisterRouter } from "./registerRouter.js";
import { router as BookRouter } from "./bookRouter.js";
import { router as CartRouter } from "./cartRouter.js";
import { router as CheckoutRouter } from "./checkoutRouter.js";

export const router = express.Router();

router.use("/", homeRouter);
router.use("/login", LoginRouter);
router.use("/register", RegisterRouter);
router.use("/books", BookRouter);
router.use("/cart", CartRouter);
router.use("/checkout", CheckoutRouter);

// Catch 404 (ALWAYS keep this as the last route).
router.use((req, res, next) => {
  const statusCode = 404;
  const error = new Error(http.STATUS_CODES[statusCode]);
  error.status = statusCode;
  next(error);
});
