const express = require("express");
const router = express.Router();

const addStaffController = require("../controllers/add-staff");

router.get("/add-staff", addStaffController.getAddStaff);

router.post("/add-staff", addStaffController.postAddStaff);

module.exports = router;
