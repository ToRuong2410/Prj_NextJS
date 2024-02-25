import AppFooter from "@/components/footer/app.footer";
import AppHeader from "@/components/header/app.header";
import ThemeRegistry from "@/components/theme-registry/theme.registry";
interface ILayout {
  children: React.ReactNode;
}
export default function RootLayout(props: ILayout) {
  return (
    <html lang="en">
      <body>
        <AppHeader />
        <ThemeRegistry>{props.children}</ThemeRegistry>
        <AppFooter />
      </body>
    </html>
  );
}
