const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const User = require('../models/user');

const { JWT_SECRET } = process.env;

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
};

const jwtLogin = new JwtStrategy(jwtOptions, async function jwtStrategy(payload, done) {
  try {
    const user = await User.findById(payload.sub);
    done(null, user);
  } catch (error) {
    done(error, false);
  }
});

passport.use(jwtLogin);

const authenticate = passport.authenticate('jwt', { session: false });

module.exports = {
  passport,
  authenticate,
};
