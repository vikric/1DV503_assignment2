import express from "express";
import { CartController } from "../controllers/CartController.js";

export const router = express.Router();

const controller = new CartController();

router.get("/", (req, res, next) => controller.viewCart(req, res, next));

