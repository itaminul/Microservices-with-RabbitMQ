const express = require("express");
import orderRoute from "./orderRoute";
const router = express.Router();
router.use("/order", orderRoute);
export default router;
