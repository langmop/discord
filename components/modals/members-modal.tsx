"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-modal-store";

import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from "lucide-react";
import { ReactElement, useState } from "react";
import { serverWithMembersWithProfile } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import UserAvatar from "@/components/user-avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuTrigger,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { MemberRole } from "@prisma/client";
import qs from "query-string";
import axios from "axios";
import { useRouter } from "next/navigation";

export const MembersModal = () => {
  const router = useRouter();

  const { onOpen, isOpen, onClose, type, data } = useModal();

  const [loadingId, setLoadingId] = useState("");

  const { server } = data as { server: serverWithMembersWithProfile | any };

  const isModalOpen = isOpen && type === "members";

  const roleIconMap: { [key: string]: null | ReactElement<ImageData> } = {
    GUEST: null,
    MODERATOR: <ShieldCheck className="h-4 w-4 ml-2" />,
    ADMIN: <ShieldAlert className="h-4 w-4 text-rose-500 ml-2" />,
  };

  const onRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
        },
      });

      const response = await axios.patch(url, { role });

      router.refresh();

      onOpen("members", { server: response.data });
    } catch (error) {
    } finally {
      setLoadingId("");
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center">
            Manage Members
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500 ">
            {server?.members?.length} Members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          {server?.members?.map(
            (member: {
              profileId: string;
              id: string;
              role: MemberRole;
              profile: {
                imageUrl: string;
                name: string;
                email: string;
              };
            }) => {
              return (
                <div key={member.id} className="flex items-center gap-x-2 mb-6">
                  <UserAvatar src={member?.profile?.imageUrl} />
                  <div className="flex flex-col gap-y-1">
                    <div className="text-xs font-semibold flex items-center">
                      {member?.profile?.name}
                      {roleIconMap[member?.role]}
                    </div>
                    <p className="text-xs text-zinc-500">
                      {member?.profile?.email}
                    </p>
                  </div>
                  {server.profileId !== member.profileId &&
                    loadingId !== member.id && (
                      <div className="ml-auto">
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <MoreVertical className="w-4 h-4 text-zinc-500" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent side="left">
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger className="flex items-center">
                                <ShieldQuestion className="w-4 h-4 mr-2" />
                                <span>Role</span>
                              </DropdownMenuSubTrigger>
                              <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      onRoleChange(member.id, "GUEST")
                                    }
                                  >
                                    <Shield className="h-4 w-4 mr-2" />
                                    Guest
                                    {member.role == "GUEST" && (
                                      <Check className="h-4 w-4 ml-auto" />
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      onRoleChange(member.id, "MODERATOR")
                                    }
                                  >
                                    <ShieldCheck className="h-4 w-4 mr-2" />
                                    Moderator
                                  </DropdownMenuItem>
                                </DropdownMenuSubContent>
                              </DropdownMenuPortal>
                            </DropdownMenuSub>
                            <DropdownMenuSeparator>
                              <DropdownMenuItem>
                                <Gavel className="w-4 h-4 mr-2" />
                                Kick
                              </DropdownMenuItem>
                            </DropdownMenuSeparator>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        {loadingId == member.id && (
                          <div className="text-black">hello</div>
                        )}
                      </div>
                    )}
                </div>
              );
            }
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
