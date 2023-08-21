"use client";
import { Provider } from "react-redux";
import mystore from "./store";

export function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={mystore}>{children}</Provider>;
}
