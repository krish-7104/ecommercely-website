const { DateTime } = require("luxon");

const dateFormaterHandler = (date: string) => {
  const utcTimestamp = DateTime.fromISO(date, {
    zone: "utc",
  });
  const istTimestamp = utcTimestamp.setZone("Asia/Kolkata");
  return istTimestamp.toFormat("dd-MM-yyyy HH:mm:ss");
};
export default dateFormaterHandler;
