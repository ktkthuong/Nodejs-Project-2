const express = require("express");

const otherInfoController = require("../controllers/other-info");

const router = express.Router();

router.get("/staff-info", otherInfoController.getStaffInfo);

router.get("/work-info", otherInfoController.getWorkInfo);

router.get("/covid-info", otherInfoController.getCovidInfo);

router.post("/covid-info/temperature", otherInfoController.postBodyTemperature);

router.post("/covid-info/vaccineInfo", otherInfoController.postVaccineInfo);

router.post(
  "/covid-info/infectCovidInfo",
  otherInfoController.postInfectCovidInfo
);

module.exports = router;
