const dbConfig = require("../dbconfig");
const sql = require("mysql");
const parse_database_response = require("../utils");
const connection = sql.createConnection(dbConfig);
connection.connect();

const queryPromise = (sql, parse) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, (error, result) => {
      if (error) {
        reject(error);
      } else {
        if (parse && result.length > 0) {
          const [row] = result;
          if (Object.keys(row).includes("count(test_id)")) {
            resolve(Object.values(row)[0]);
          } else {
            resolve(result.map((data) => parse_database_response(data)));
          }
        } else {
          resolve(result);
        }
      }
    });
  });
};

const millisToMinutesAndSeconds = (millis) => {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return (
    (minutes < 10 ? "0" : "") +
    minutes +
    ":" +
    (seconds < 10 ? "0" : "") +
    seconds
  );
};

const getFailedTestsCount = async () => {
  try {
    const data = await queryPromise(
      'SELECT count(test_id) FROM testapitrellorunhistory WHERE lower(status) = "failed";',
      true
    );
    return data;
  } catch (err) {
    console.log(err);
  }
};
const getPassedTestsCount = async () => {
  try {
    const data = await queryPromise(
      'SELECT count(test_id) FROM testapitrellorunhistory WHERE lower(status) = "passed";',
      true
    );
    return data;
  } catch (err) {
    console.log(err);
  }
};
const getTimedOutTestsCount = async () => {
  try {
    const data = await queryPromise(
      'SELECT count(test_id) FROM testapitrellorunhistory WHERE lower(status) = "timedout";',
      true
    );
    return data;
  } catch (err) {
    console.log(err);
  }
};
const getInterruptedTestsCount = async () => {
  try {
    const data = await queryPromise(
      'SELECT count(test_id) FROM testapitrellorunhistory WHERE lower(status) = "interrupted";',
      true
    );
    return data;
  } catch (err) {
    console.log(err);
  }
};

const getCanceledTestsCount = async () => {
  try {
    const data = await queryPromise(
      'SELECT count(test_id) FROM testapitrellorunhistory WHERE lower(status) = "canceled";',
      true
    );
    return data;
  } catch (err) {
    console.log(err);
  }
};

const getTodayTests = async (filterDate) => {
  try {
    const data = await queryPromise(
      `SELECT * FROM testapitrellorunhistory WHERE date(test_date) = date("${filterDate}");`,
      true
    );
    return data;
  } catch (err) {
    console.log(err);
  }
};

const getAllTestPassedVSFailed = async () => {
  try {
    const data = await queryPromise(
      'SELECT test_name AS name, SUM(CASE WHEN lower(status) = "passed" THEN 1 ELSE 0 END) AS passed_count, SUM(CASE WHEN lower(status) = "failed" THEN 1 ELSE 0 END) AS failed_count FROM testapitrellorunhistory GROUP BY test_name',
      false
    );
    return data;
  } catch (err) {
    console.log(err);
  }
};

const getAverageDuration = async (date) => {
  try {
    const data = await queryPromise(
      `SELECT test_name, CONCAT(YEAR(test_date), '-', MONTH(test_date), '-', DAY(test_date)) AS test_date, AVG(total_duration) AS averageDuration FROM testapitrellorunhistory WHERE test_date BETWEEN "${date}" AND CURDATE() GROUP BY test_name, YEAR(test_date), MONTH(test_date), DAY(test_date);`,
      false
    );
    const returnData = data.map((test) => ({
      name: test.test_name,
      duration: millisToMinutesAndSeconds(test.averageDuration),
      date: test.test_date,
    }));
    return returnData;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getFailedTestsCount,
  getPassedTestsCount,
  getInterruptedTestsCount,
  getTimedOutTestsCount,
  getTodayTests,
  getCanceledTestsCount,
  getAllTestPassedVSFailed,
  getAverageDuration,
};
