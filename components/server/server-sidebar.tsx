import React from "react";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { channelType } from "@prisma/client";
import { redirect } from "next/navigation";
import { ServerHeader } from "./server-header";

type serverSideBarProps = {
  serverId: string;
};

const ServerSidebar = async ({ serverId }: serverSideBarProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const server = (await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  })) || { channels: [], members: [] };

  const textChannels = server?.channels?.filter(
    (channel) => channel.type === channelType.TEXT
  );

  const audioChannel = server?.channels?.filter(
    (channel) => channel.type === channelType.VOICE
  );

  const videoChannel = server?.channels?.filter(
    (channel) => channel.type === channelType.VIDEO
  );

  const members = server?.members?.filter(
    (member) => member.profileId !== profile.id
  );

  if (!server) {
    return redirect("/");
  }

  const role = server.members.find(
    (member) => member.profileId === profile.id
  )?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={server} role={role} />
    </div>
  );
};

export default ServerSidebar;
