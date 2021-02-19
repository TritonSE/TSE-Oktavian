const ServiceError = (status, message) => {
  return {
    name: "ServiceError",
    status: status,
    message: message,
  };
};

module.exports = { ServiceError };
