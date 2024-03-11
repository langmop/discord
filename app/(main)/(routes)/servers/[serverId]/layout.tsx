import { redirectToSignIn } from "@clerk/nextjs";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import ServerSidebar from "@/components/server/server-sidebar";

const ServerIdLayout = async ({
  children,
  params: { serverId },
}: {
  children: React.ReactNode;
  params: { serverId: string };
}) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const server = db.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (!server) {
    return redirect("/");
  }

  return (
    <div className="h-full">
      <div className="hidden  md:flex h-full w-60 z-20 flex-col inset-y-0">
        <ServerSidebar serverId={serverId} />
      </div>
      {children}
    </div>
  );
};

export default ServerIdLayout;
