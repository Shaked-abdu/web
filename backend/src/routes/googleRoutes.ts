import { session } from 'express-session';
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Request, Response, Router } from "express";

const googleRouter = Router();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_OOAUTH_REDIRECT_URL,
      passReqToCallback: true,
    },
    (request, accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

// Serialize user to session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user from session
passport.deserializeUser((user, done) => {
  done(null, user);
});

googleRouter.get(
  "/google-login",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

googleRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/auth/protected",
    failureRedirect: "/google/failure",
  })
);

const isLoggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
};

export interface GoogleAuthRequest extends Request {
  user?: { displayName: string };
  session?: { destroy: () => void };
}

googleRouter.get("/protected", isLoggedIn, (req: Request, res: Response) => {
  const name = (req as GoogleAuthRequest).user.displayName;
  res.send(`You are authenticated ${name}`);
});

googleRouter.get("/google-logout", (req, res) => {
  (req as GoogleAuthRequest).session.destroy();
  res.send();
});

export default googleRouter;
