const express = require("express");

const otherInfoController = require("../controllers/other-info");

const router = express.Router();

router.get("/staff-info", otherInfoController.getStaffInfo);

router.post("/staff-info", otherInfoController.postStaffInfo);

router.get("/work-info", otherInfoController.getWorkInfo);

router.get("/covid-info", otherInfoController.getCovidInfo);

router.post("/covid-info/temperature", otherInfoController.postBodyTemperature);

router.post("/covid-info/vaccineInfo", otherInfoController.postVaccineInfo);

router.post(
  "/covid-info/infectCovidInfo",
  otherInfoController.postInfectCovidInfo
);

router.get("/covid-info/:covidId", otherInfoController.getPDF);

// router.get("/test", otherInfoController.getPDFTest)

module.exports = router;
