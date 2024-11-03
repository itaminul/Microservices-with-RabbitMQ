const express = require("express");
import deliverRoute from "./delieryRoute";
const router = express.Router();
router.use("/deliver", deliverRoute);
export default router;
