import cron from "cron";
import https from "https";

const job = new cron.CronJob("*/14 * * * *", () => {
  https
    .get(process.env.API_REFRESH_URL, (res) => {
      if (res.statusCode === 200) {
        console.log("API refreshed");
      } else {
        console.log("API refresh failed");
      }
    })
    .on("error", (error) => {
      console.error("Error refreshing API:", error);
    });
});

export default job;
