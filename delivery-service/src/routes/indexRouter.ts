const express = require("express");
import deliverRoute from "./delieryRoute";
const router = express.Router();
router.use("/order", deliverRoute);
export default router;
