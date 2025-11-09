import { ReactNode } from "react";
import Navbar from "./Navbar";
import Cart from "./Cart";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>{children}</main>
      <Cart />
    </div>
  );
};

export default Layout;
