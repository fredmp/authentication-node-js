const jwt = require('jwt-simple');
const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local');
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

const localOptions = {
  usernameField: 'email',
};

const localLogin = new LocalStrategy(localOptions, async function localStrategy(
  email,
  password,
  done,
) {
  try {
    const user = await User.findOne({ email });
    user.comparePassword(password, function comparePasswordCallback(error, isMatch) {
      if (error) return done(error);
      return done(null, isMatch ? user : false);
    });
  } catch (error) {
    done(error, false);
  }
});

function tokenForUser({ id }) {
  return jwt.encode({ sub: id, iat: new Date().getTime() }, JWT_SECRET);
}

passport.use(jwtLogin);
passport.use(localLogin);

const requireJWT = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

module.exports = {
  passport,
  requireJWT,
  requireSignin,
  tokenForUser,
};
