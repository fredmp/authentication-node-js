const User = require('../models/user');
const { requireJWT, requireSignin, tokenForUser } = require('../services/passport');

module.exports = app => {
  app.get('/', requireJWT, (req, res) => {
    res.send({ hi: 'hello' });
  });

  app.post('/signin', requireSignin, (req, res) => {
    res.set('Authorization', `Bearer ${tokenForUser(req.user)}`).send();
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
      return res
        .status(201)
        .set('Authorization', `Bearer ${tokenForUser(user)}`)
        .send();
    } catch (error) {
      return next(error);
    }
  });
};
