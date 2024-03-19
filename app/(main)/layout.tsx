import NavigationSideBar from "@/components/navigation/navigation-sidebar";
import React from "react";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full flex w-full">
      <div className="hidden md:flex h-full w-[72px] z-30 flex-col inset-t-0">
        <NavigationSideBar />
      </div>
      <main className="h-full flex-1">{children}</main>
    </div>
  );
};

export default MainLayout;
