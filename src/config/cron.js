import cron from "cron";
import http from "http";

const job = new cron.CronJob("*/14 * * * *", async () => {
  http.get(process.env.API_REFRESH_URL, (res) => {
    if (res.statusCode === 200) {
      console.log("API refreshed");
    } else {
      console.log("API refresh failed");
    }
  });
});

export default job;