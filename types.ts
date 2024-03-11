import { Member, Profile } from "@prisma/client";
import { Server } from "http";

export type serverWithMembersWithProfile = Server & {
  members: (Member & { profile: Profile })[];
};
