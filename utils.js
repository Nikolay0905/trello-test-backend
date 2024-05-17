const parse_database_response = (data) => {
  return {
    id: data.test_id,
    name: data.test_name,
    fileLocation: data.file_location,
    status: data.status,
    duration: data.test_duration,
    date: data.test_date,
  };
};

module.exports = parse_database_response;
