import ThemeRegistry from "@/components/theme-registry/theme.registry";
import NextAuthWrapper from "@/lib/next.auth.wrapper";

interface ILayout {
  children: React.ReactNode;
}
export default function RootLayout(props: ILayout) {
  return (
    <html lang="en">
      <body>
        {/* xử lý MUI -> render component nhanh hơn */}
        <ThemeRegistry>
          {/* chia sẻ session giữa các component */}
          <NextAuthWrapper>{props.children}</NextAuthWrapper>
        </ThemeRegistry>
      </body>
    </html>
  );
}
