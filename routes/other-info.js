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
//get pdf router
router.get("/covid-info/:covidId", otherInfoController.getPDF);

// salary router
router.post('/salary', otherInfoController.postSalary);
router.get('/salary', otherInfoController.getSalary);

module.exports = router;
