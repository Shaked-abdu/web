import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Request, Response, Router } from "express";
import userModel from "../models/userModel";
import bcrypt from "bcrypt";

const googleRouter = Router();

let email = ""
let password = ""

const registerGoogleUser = async (email: string, password: string) => {
  try {
    const user = await userModel.findOne({ email: email });
    if (!(user != null)) {
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(password, salt);
      const user = new userModel({
        email: email,
        password: hash,
        firstName: email,
      });
      await user.save();
    }
  } catch (error) {
    console.log(error);
  }
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_OOAUTH_REDIRECT_URL,
      passReqToCallback: true,
    },
    (request, accessToken, refreshToken, profile, done) => {
      const profileEmail = profile._json.email;
      const profileId = profile.id;
      console.log(profileId);
      email = profileEmail
      password = profileId

      registerGoogleUser(profileEmail, profileId);
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
  "/google/callback",(req: Request, res: Response, next) => {
    passport.authenticate("google", (err, user) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.redirect("/google/failure");
      }

      // Construct the destination URL with parameters
      const destinationURL = `${process.env.CLIENT_BASE_PATH}/register-google/${email}/${password}`

      // Redirect to the destination URL
      return res.redirect(destinationURL);
    })(req, res, next);
  }
  // passport.authenticate("google", {
  //   successRedirect: `${process.env.CLIENT_BASE_PATH}/register-google`,
  //   failureRedirect: "/google/failure",
  // })
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
