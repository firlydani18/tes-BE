const { exampleMiddleware } = require("../middleware");
const exampleController = require("../controllers/exampleController");

// module.exports = (app) => {
//   app.use((req, res, next) => {
//     res.header(
//       "Access-Control-Allow-Headers",
//       "x-access-token, Origin, Content-Type, Accept"
//     );
//     next();
//   });

//   const router = require("express").Router();

//   router.get(
//     "/",
//     [exampleMiddleware.exampleMiddleware],
//     exampleController.exampleFunction
//   );

//   router.get(
//     "/",
//     [exampleMiddleware.exampleMiddleware],
//     exampleController.exampleFunction
//   );

//   app.use("/api/data", router);
// };

module.exports = (app, server) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  const router = require("express").Router();

  // WebSocket setup
  callmeWebSocket(server); 


  router.get(
    "/example",
    [authenticateToken], 
    exampleController.exampleFunction
  );

  
  router.post(
    "/fetch-data",
    [authenticateToken, authorizeRoles('admin')], // Only admin 
    fetchAndStoreData
  );

  // Route for getting data with Redis caching
  router.get(
    "/attacks",
    [authenticateToken], // JWT authentication for normal users
    getData
  );

  app.use("/api/data", router);
};