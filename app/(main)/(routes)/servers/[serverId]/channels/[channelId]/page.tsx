import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";
import { MediaRoom } from "@/components/media-room";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";

interface channelIdProps {
  params: {
    serverId: string;
    channelId: string;
  };
}

const ChannelConversationPage = async ({
  params: { serverId, channelId },
}: channelIdProps) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirectToSignIn();
  }

  const channel = await db.channel.findUnique({
    where: {
      id: channelId,
    },
  });

  const member = await db.member.findFirst({
    where: {
      serverId: serverId,
      profileId: profile.id,
    },
  });

  if (!channel || !member) {
    return redirect("/");
  }

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId}
        type="channel"
      />
      <div className="flex-1 flex flex-col overflow-auto">
        {channel.type === ChannelType.TEXT && (
          <>
            <ChatMessages
              chatId={channel.id}
              member={member}
              name={channel.name}
              type="channel"
              apiUrl="/api/messages"
              socketUrl="/api/socket/messages"
              socketQuery={{
                channelId: channel.id,
                serverId: channel.serverId,
              }}
              paramKey="channelId"
              paramValue={channel.id}
            />
            <ChatInput
              name={channel.name}
              type="channel"
              apiUrl="/api/socket/messages"
              query={{
                channelId: channel.id,
                serverId: channel.serverId,
              }}
            />
          </>
        )}
        {channel.type === ChannelType.AUDIO && (
          <MediaRoom chatId={channel.id} video={false} audio={true} />
        )}
        {channel.type === ChannelType.VIDEO && (
          <MediaRoom chatId={channel.id} video={true} audio={false} />
        )}
      </div>
    </div>
  );
};

export default ChannelConversationPage;
