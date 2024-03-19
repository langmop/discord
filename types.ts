import { Member, Profile } from "@prisma/client";
import { Server } from "http";
import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as ServerIOServer } from "socket.io";

export type serverWithMembersWithProfile = Server & {
  members: (Member & { profile: Profile })[];
};

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: ServerIOServer;
    };
  };
};
