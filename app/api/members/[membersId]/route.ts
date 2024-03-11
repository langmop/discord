import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  {
    params: { membersId },
  }: {
    params: { membersId: string };
  }
) {
  try {
    const profile = await currentProfile();

    const { searchParams } = new URL(req.url);
    const { role } = await req.json();

    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }

    if (!serverId) {
      return new NextResponse("Server ID Missing", {
        status: 400,
      });
    }

    if (!membersId) {
      return new NextResponse("Member ID Missing", {
        status: 400,
      });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: membersId,
              profileId: {
                not: profile.id,
              },
            },
            data: {
              role,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[MEMBERS_ID_PATCH]", error);
    return new Response("Internal Server Error", {
      status: 500,
    });
  }
}
