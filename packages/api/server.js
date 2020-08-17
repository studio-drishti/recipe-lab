const app = require("./app");

const PORT = process.env.PORT || 4000;

app.listen(PORT, (err) => {
  if (err) throw err;
  if (process.env.NODE_ENV === "development") {
    console.info(`ready - started api server on http://localhost:${PORT}`);
  } else {
    console.info(`API server is ready and listening on port ${PORT}`);
  }
});
