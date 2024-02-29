import AppFooter from "@/components/footer/app.footer";
import AppHeader from "@/components/header/app.header";

interface ILayout {
  children: React.ReactNode;
}
export default function RootLayout(props: ILayout) {
  return (
    <>
      <AppHeader />
      {props.children}
      <AppFooter />
    </>
  );
}
