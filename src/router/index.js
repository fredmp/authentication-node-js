const jwt = require('jwt-simple');
const User = require('../models/user');
const { authenticate } = require('../services/passport');

const { JWT_SECRET } = process.env;

function tokenForUser({ id }) {
  return jwt.encode({ sub: id, iat: new Date().getTime() }, JWT_SECRET);
}

module.exports = app => {
  app.get('/', authenticate, (req, res) => {
    res.send({ hi: 'hello' });
  });

  app.post('/signup', async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).send({ error: 'You must provide email and password' });
    }

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(422).send({ error: 'Email is in use' });
      }
      const user = await new User({ email, password }).save();
      return res.json({ token: tokenForUser(user) });
    } catch (error) {
      return next(error);
    }
  });
};
