const ServiceError = (status, message) => ({
  name: "ServiceError",
  status,
  message,
});

module.exports = { ServiceError };
