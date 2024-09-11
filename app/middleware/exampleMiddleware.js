const db = require("../models");
// const model = db.model;

exampleMiddlewareFunction = (req, res, next) => {
  // do something
  const token = req.headers['authorization'];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, 'your_jwt_secret', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

const verify = {
  exampleMiddlewareFunction: exampleMiddlewareFunction,
};

module.exports = verify;

function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, 'your_jwt_secret', (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
  });
}

function authorizeRoles(...roles) {
  return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
          return res.status(403).json({ success: false, message: 'Forbidden: Insufficient permissions' });
      }
      next();
  };
}