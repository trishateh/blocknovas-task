const cron = require("node-cron");
const { getWhaleAccounts } = require("../services/TransactionServices");

const fetchWhaleAccounts = async (req, res) => {
  try {
    const whaleAccounts = await getWhaleAccounts();
    res.status(200).json({
      success: true,
      data: whaleAccounts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch whale accounts",
    });
  }
};

let cronTask = null; // To store the cron job task
let cronInterval = "*/5 * * * *"; // Default cron interval (5 minutes)

// Function to start or restart the cron job
const startCronJob = (interval) => {
  if (cronTask) {
    cronTask.stop(); // Stop the existing cron job if it's running
  }

  cronTask = cron.schedule(interval, async () => {
    console.log(`Fetching whale accounts at interval: ${interval}`);
    const whaleAccounts = await getWhaleAccounts();
  });

  cronTask.start();
};

// Controller method to set the cron interval dynamically
const setCronInterval = (req, res) => {
  const { interval } = req.body;

  if (!interval) {
    return res
      .status(400)
      .json({ success: false, message: "Interval is required" });
  }

  try {
    startCronJob(interval); // Start or restart the cron job with the new interval
    cronInterval = interval; // Update the global interval variable
    res
      .status(200)
      .json({ success: true, message: `Cron interval set to ${interval}` });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to set cron interval" });
  }
};

module.exports = {
  fetchWhaleAccounts,
  setCronInterval,
};
