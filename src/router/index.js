const User = require('../models/user');

module.exports = app => {
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
      return res.send(user);
    } catch (error) {
      return next(error);
    }
  });
};
