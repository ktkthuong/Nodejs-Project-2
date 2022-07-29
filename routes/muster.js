const express = require("express");

const musterController = require("../controllers/muster");

const router = express.Router();

router.get("/muster", musterController.getMuster);

router.get("/muster/checkin", musterController.getCheckIn);

router.post("/muster/checkin", musterController.postCheckIn);

router.post("/muster/checkout", musterController.postCheckOut);

router.get("/muster/off", musterController.getOff);

router.post("/muster/off", musterController.postOff);

module.exports = router;
