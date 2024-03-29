import { withAuth } from "next-auth/middleware";

export default withAuth({
  // Matches the pages config in `[...nextauth]`
  pages: {
    signIn: "/auth/signin",
  },
});

// Khi người dùng truy cập các trang này thì sẽ bị ktra xem đã đăng nhập chưa -> nếu chưa
// thì sẽ đẩy sang bên trang signin bên trên
export const config = { matcher: ["/playlist", "/track/upload", "/like"] };
