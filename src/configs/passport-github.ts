import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import dotenv from "dotenv";
import { prisma } from "@/utils/prisma";

dotenv.config();
// type Test = ConstructorParameters<typeof GitHubStrategy>[1];

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      callbackURL: process.env.GITHUB_CALLBACK as string,
    },
    async function (
      _accessToken: any,
      _refreshToken: any,
      profile: any,
      done: any
    ) {
      try {
        const githubId: string = (profile.id as number).toString();

        if (!githubId) {
          return done(new Error("Invalid GitHub identification"), false);
        }

        let user = await prisma.user.findUnique({
          where: { oauthId: githubId },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              password: "",
              email: "",
              oauthId: githubId,
              profilePic: profile.avatar_url,
              name: profile.name ?? profile.login ?? "",
            },
          });
        }
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

export default passport;
