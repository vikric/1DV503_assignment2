import express from "express";
import { CheckoutController } from "../controllers/CheckoutController.js";

export const router = express.Router();

const controller = new CheckoutController();

router.get("/", (req, res, next) => controller.viewCart(req, res, next));
router.post("/", (req, res, next) => controller.checkout(req, res, next));
