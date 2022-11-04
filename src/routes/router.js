import { Router } from "express";

import productRouter from "./product/product.routes.js";
import authRouter from "./auth/auth.routes.js";
import categoryRouter from "./category/categories.routes.js";
import cartRouter from "./cart/cart.routes.js";
import orderRouter from "./order/order.routes.js";

const router = Router();

router.use("/products", productRouter);
router.use("/auth", authRouter);
router.use("/categories", categoryRouter);
router.use("/cart", cartRouter);
router.use("/orders", orderRouter);

export default router;
