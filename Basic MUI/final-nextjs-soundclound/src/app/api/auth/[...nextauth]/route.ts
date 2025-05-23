import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";
import NextAuth from "next-auth";
import dayjs from "dayjs";

import { sendRequest } from "@/utils/api";
import { AuthOptions } from "next-auth/";

async function refreshAccessToken(token: JWT) {
  const res = await sendRequest<IBackendRes<JWT>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/refresh`,
    method: "POST",
    body: { refresh_token: token?.refresh_token },
  });

  if (res.data) {
    return {
      // Thực hiện ghi đè lại thông tin cũ
      ...token,
      access_token: res.data?.access_token ?? "",
      refresh_token: res.data?.refresh_token ?? "",
      // Mỗi khi signIn thành công, gán vào access_expire thời gian cho biết khi nào token hết hạn
      // -> không phải nhờ tới BE để biết token này hết hạn hay không
      access_expire: dayjs(new Date())
        .add(
          +(process.env.TOKEN_EXPIRE_NUMBER as string),
          process.env.TOKEN_EXPIRE_UNIT as any
        )
        .unix(),
      error: "",
    };
  } else {
    //failed to refresh token => do nothing
    // console.log(">>> run error: ", "RefreshAccessTokenError");

    return {
      ...token,
      error: "RefreshAccessTokenError", // This is used in the front-end, and if present, we can force a re-login, or similar
    };
  }
}

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials, req) {
        const res = await sendRequest<IBackendRes<JWT>>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/login`,
          method: "POST",
          body: {
            username: credentials?.username,
            password: credentials?.password,
          },
        });

        if (res && res.data) {
          return res.data as any;
        } else {
          throw new Error(res?.message as string);
        }
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    // callback này được gọi khi token được tạo (khi signIn, update - việc sử dụng Session ở phía client)
    async jwt({ token, user, account, profile, trigger }) {
      if (trigger === "signIn" && account?.provider !== "credentials") {
        const res = await sendRequest<IBackendRes<JWT>>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/social-media`,
          method: "POST",
          body: {
            type: account?.provider.toLocaleUpperCase(),
            username: user.name,
            email: user.email, // -> Cấu hình dữ liệu trả về, do truyền mội email nên nó lấy mối email Google thôi, chưa lấy được thông tin avatar và name
          },
        });
        if (res.data) {
          token.access_token = res.data.access_token;
          token.refresh_token = res.data.refresh_token;
          token.user = res.data.user;
          token.name = res.data.name;
          // token.picture = res.data.picture;
          token.email = res.data.email;

          // Mỗi khi signIn thành công, gán vào access_expire thời gian cho biết khi nào token hết hạn
          // -> không phải nhờ tới BE để biết token này hết hạn hay không
          token.access_expire = dayjs(new Date())
            .add(
              +(process.env.TOKEN_EXPIRE_NUMBER as string),
              process.env.TOKEN_EXPIRE_UNIT as any
            )
            .unix();
        }
      }
      if (trigger === "signIn" && account?.provider === "credentials") {
        // @ts-ignore
        token.access_token = user.access_token;
        // @ts-ignore
        token.refresh_token = user.refresh_token;
        // @ts-ignore
        token.user = user.user;
        // Mỗi khi signIn thành công, gán vào access_expire thời gian cho biết khi nào token hết hạn
        // -> không phải nhờ tới BE để biết token này hết hạn hay không
        //@ts-ignore
        token.access_expire = dayjs(new Date())
          .add(
            +(process.env.TOKEN_EXPIRE_NUMBER as string),
            process.env.TOKEN_EXPIRE_UNIT as any
          )
          .unix();
      }

      // Tính toán thời gian hết hạn -> nếu hết hạn thì gọi đến hàm refresh,
      // ngược lại vẫn trả ra token bình thường
      const isTimeAfter = dayjs(dayjs(new Date())).isAfter(
        dayjs.unix((token?.access_expire as number) ?? 0)
      );

      // console.log(
      //   ">>> Refresh token in Session: ",
      //   token.refresh_token?.slice(-5),
      //   "should refresh = ",
      //   isTimeAfter
      // );

      if (isTimeAfter) {
        return refreshAccessToken(token);
      }

      return token;
    },
    session({ session, token, user }) {
      // console.log("thong tin session--------", session);
      // console.log("thong tin user--------", user);
      // console.log("thong tin token--------", token);

      if (token) {
        // Thực hiện gán dữ liệu vào session
        session.access_token = token.access_token;
        session.refresh_token = token.refresh_token;
        session.user = token.user;
        session.access_expire = token.access_expire;
        session.error = token.error;
        session.user.username = token.user.username;
        session.user.email = token.user.email;
      }
      return session;
    },
  },
  // pages: {
  //   signIn: "/auth/signin",
  // },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
