const http = require("http");

const PORT = process.env.PORT;

http
  .createServer(require("./app"))
  .listen(PORT || 3001, () =>
    console.log(`Server listening on port ${PORT || 3001}`)
  );
