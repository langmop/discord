import { Ghost, Menu } from "lucide-react";
import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "./ui/button";
import NavigationSideBar from "./navigation/navigation-sidebar";
import ServerSidebar from "./server/server-sidebar";

const MobileToggle = ({ serverId }: { serverId: string }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"ghost"} size={"icon"} className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 flex gap-0">
        <div>
          <NavigationSideBar />
        </div>
        <div className="w-[100%]">
          <ServerSidebar serverId={serverId} />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileToggle;
