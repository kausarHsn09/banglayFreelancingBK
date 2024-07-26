exports.handleError = (res, error, status = 500) => {
  console.error(error);
  res.status(status).json({ message: error.message });
};