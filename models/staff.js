const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const staffSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  doB: {
    type: Date,
    required: true,
  },
  salaryScale: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  annualLeave: {
    type: Number,
  },
  position: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  workStatus: { type: Boolean },
  isConfirm: { type: Boolean },
  workTimes: [
    {
      startTime: { type: Date },
      workPlace: { type: String },
      endTime: { type: Date },
      hours: { type: Number },
    },
  ],
  totalTimesWork: { type: Number },
  leaveInfoList: [
    {
      dayStartLeave: { type: Date },
      dayEndLeave: { type: Date },
      totalDateLeave: { type: Number },
      timesLeave: { type: Number },
      reason: { type: String },
    },
  ],
  bodyTemperature: [
    {
      temperature: { type: Number },
      date: { type: Date },
      time: { type: String },
    },
  ],
  vaccineInfo: [
    {
      nameVaccine1: { type: String },
      date1: { type: Date },
      nameVaccine2: { type: String },
      date2: { type: Date },
    },
  ],
  infectCovidInfo: [
    {
      datePositive: { type: Date },
      dateRecover: { type: Date },
    },
  ],
});

staffSchema.methods.addStartWorkTimes = function (startWorkTimes, workStatus) {
  const updateWorkTimes = [...this.workTimes];
  updateWorkTimes.push(startWorkTimes);
  this.workTimes = updateWorkTimes;
  this.workStatus = workStatus;
  return this.save();
};

staffSchema.methods.addEndTime = function (newEndTime, workStatus) {
  if (this.workTimes[this.workTimes.length - 1].endTime === null) {
    const lastIndexWorkTime = this.workTimes.length - 1;

    // Thay đổi workStatus nav-chil
    this.workStatus = workStatus;
    // Cập nhật thêm thời gian kết thúc làm
    this.workTimes[lastIndexWorkTime].endTime = newEndTime.endTime;
    // Cập nhật thời gian làm cho 1 lần checkin-checkout
    this.workTimes[this.workTimes.length - 1].hours = newEndTime.hours;
    return this.save();
  } else {
    return this.save();
  }
};

staffSchema.methods.addLeaveInfoList = function (leaveInfoList) {
  const updateLeaveInfoList = [...this.leaveInfoList];
  updateLeaveInfoList.push(leaveInfoList);
  this.leaveInfoList = updateLeaveInfoList;
  this.annualLeave = this.annualLeave - leaveInfoList.totalDateLeave;
  return this.save();
};

staffSchema.methods.handleTotalTimes = function (totalTimes) {
  let total = 0;
  totalTimes.workTimes.forEach((workOneTime) => {
    return (total += new Number(workOneTime.hours));
  });
  console.log("total", total);
  this.totalTimesWork = total.toFixed(2);
  return this.save();
};

staffSchema.methods.addBodyTemperature = function (bodyTemperature) {
  console.log("bodyTemperature", bodyTemperature);
  const updateBodyTemperature = [...this.bodyTemperature];
  updateBodyTemperature.push(bodyTemperature);
  this.bodyTemperature = updateBodyTemperature;
  return this.save();
};

staffSchema.methods.addVaccineInfo = function (vaccineInfo) {
  console.log("vaccineInfo", vaccineInfo);
  const updateVaccineInfo = [...this.vaccineInfo];
  updateVaccineInfo.push(vaccineInfo);
  this.vaccineInfo = updateVaccineInfo;
  return this.save();
};

staffSchema.methods.addInfectCovidInfo = function (infectCovidInfo) {
  console.log("infectCovidInfo", infectCovidInfo);
  const updateInfectCovidInfo = [...this.infectCovidInfo];
  updateInfectCovidInfo.push(infectCovidInfo);
  this.infectCovidInfo = updateInfectCovidInfo;
  return this.save();
};

module.exports = mongoose.model("Staff", staffSchema);
