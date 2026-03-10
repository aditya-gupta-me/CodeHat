import { Outlet } from "react-router-dom";
import Header from "../Navigation/Header";
import Footer from "../Navigation/Footer";

/**
 * Shared page layout with consistent Header and Footer.
 * Uses React Router's <Outlet /> to render nested route content.
 */
export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
