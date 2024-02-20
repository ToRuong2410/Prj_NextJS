import ThemeRegistry from "@/components/theme-registry/theme.registry";
interface ILayout {
  children: React.ReactNode;
}
export default function RootLayout(props: ILayout) {
  return (
    <html lang="en">
      <body>
        <div>hoidanit layout</div>
        <ThemeRegistry>{props.children}</ThemeRegistry>
      </body>
    </html>
  );
}
