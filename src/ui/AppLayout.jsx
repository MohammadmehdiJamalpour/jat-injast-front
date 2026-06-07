import { Outlet, useLocation } from "@/lib/router-compat";
import Header from "./Header";
import HeroOnlyOnHome from './../components/home/HeroOnlyOnHome';

function AppLayout() {
  const { pathname } = useLocation();
  // Check if the current route is the home page
  const isHomePage = pathname === "/";


  return (
    <div className="  min-h-screen">
      <Header />
      
      {/* Conditionally render some component ONLY on the home page */}
      {isHomePage &&  <div className="">
        <HeroOnlyOnHome />
        </div>}

      <div className=" min-h-[85vh] flex flex-col">
        <Outlet />
      </div>
     
    </div>
  );
}

export default AppLayout;
