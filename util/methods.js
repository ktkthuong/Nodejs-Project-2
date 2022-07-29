class Methods {
  CheckIsStarted = (staff) => {
    console.log("staff.workTimes.length", staff.workTimes.length);
    if (staff.workTimes && staff.workTimes.length > 0) {
      const workTimeLength = staff.workTimes.length - 1;
      const lastStart = staff.workTimes[workTimeLength];
      if (lastStart.endTime) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  };
}
module.exports = new Methods();
