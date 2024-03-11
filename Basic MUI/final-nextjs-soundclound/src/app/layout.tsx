import ThemeRegistry from "@/components/theme-registry/theme.registry";
import NextAuthWrapper from "@/lib/next.auth.wrapper";
import { TrackContextProvider } from "@/lib/track.wrapper";
import { ToastProvider } from "@/utils/toast";

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
          <NextAuthWrapper>
            {/* Toast dùng để hiển thị thông báo */}
            <ToastProvider>
              {/* TrackContextProvider dùng để chia sẻ state giữa các components */}
              <TrackContextProvider>{props.children}</TrackContextProvider>
            </ToastProvider>
          </NextAuthWrapper>
        </ThemeRegistry>
      </body>
    </html>
  );
}
