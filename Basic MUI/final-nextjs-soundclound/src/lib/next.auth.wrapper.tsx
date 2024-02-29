"use client";
import { SessionProvider } from "next-auth/react";

interface ILayout {
  children: React.ReactNode;
}
export default function NextAuthWrapper(props: ILayout) {
  return <SessionProvider>{props.children}</SessionProvider>;
}
