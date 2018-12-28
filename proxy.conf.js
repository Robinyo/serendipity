var PROXY_CONFIG = [
  {
    context: [
      "/flowable-task"
    ],
    target: "http://localhost:8080",
    secure: false,
    logLevel: "debug"
  }
];

module.exports = PROXY_CONFIG;
