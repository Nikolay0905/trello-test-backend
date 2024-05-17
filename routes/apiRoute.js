const router = require("express").Router();
const { StatusCodes } = require("http-status-codes");
const dbOperations = require("../dbOperations/api");
const moment = require("moment");

router.get("/chart_status", async (_, res) => {
  const passed = await dbOperations.getPassedTestsCount();
  const failed = await dbOperations.getFailedTestsCount();
  const interrupted = await dbOperations.getInterruptedTestsCount();
  const timedOut = await dbOperations.getTimedOutTestsCount();
  const canceled = await dbOperations.getCanceledTestsCount();
  res
    .send({
      passed: passed,
      failed: failed,
      interrupted: interrupted,
      timedOut: timedOut,
      canceled: canceled,
    })
    .status(StatusCodes.OK);
});

router.get("/today", async (req, res) => {
  const filterDate = req.query.date
    ? moment(req.query.date).format("YYYY-MM-DD")
    : moment().format("YYYY-MM-DD");
  const data = await dbOperations.getTodayTests(filterDate);
  res.send(data).status(StatusCodes.OK);
});

router.get("/passed_failed", async (_, res) => {
  const data = await dbOperations.getAllTestPassedVSFailed();
  res.send(data).status(StatusCodes.OK);
});

router.get("/average_duration", async (req, res) => {
  const filterDate = req.query.date
    ? moment(req.query.date).format("YYYY-MM-DD")
    : "";
  const data = await dbOperations.getAverageDuration(filterDate);
  res.send(data).status(StatusCodes.OK);
});

module.exports = router;
