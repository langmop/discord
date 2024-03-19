"use client";
import { Member, Profile } from "@prisma/client";
import * as z from "zod";
import React, { use, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

import UserAvatar from "../user-avatar";
import ActionToolTip from "../action-tooltip";
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import qs from "query-string";
import axios from "axios";
import { useModal } from "@/hooks/use-modal-store";

interface ChatItemProps {
  id: string;
  content: string;
  member: Member & {
    profile: Profile;
  };
  timestamp: string;
  fileUrl: string | null;
  deleted: boolean;
  currentMember: Member;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="w-4 h-4 ml-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="w-4 h-4 ml-2 text-rose-500" />,
};

const formSchema = z.object({
  content: z.string().min(1),
});

const ChatItem = ({
  id,
  content,
  member,
  timestamp,
  fileUrl,
  deleted,
  currentMember,
  isUpdated,
  socketUrl,
  socketQuery,
}: ChatItemProps) => {
  const [isEditing, setIsEditing] = React.useState(false);

  const { onOpen } = useModal();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: content,
    },
  });

  const router = useRouter();
  const params = useParams();
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      });

      await axios.patch(url, values);
      form.reset();
      setIsEditing(false);
    } catch (error) {}
  };

  const onMemberClick = () => {
    if (member.id === currentMember.id) {
      return;
    }

    router.push(`/servers/${params?.serverId}/members/${member.id}`);
  };

  useEffect(() => {
    form.reset({ content });
  }, [content]);

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "Escape" || event.keyCode == 27) {
        setIsEditing(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const fileType = (fileUrl || "").split(".").pop();

  const isAdmin = currentMember.role === "ADMIN";
  const isOwner = currentMember.id === member.id;
  const isModerator = currentMember.role === "MODERATOR";

  const canDeleteMessage = !deleted && (isAdmin || isOwner || isModerator);
  const canEditMessage = !deleted && isOwner && !fileUrl;
  const isPDF = fileType == "pdf" && fileUrl;
  const isImage = !isPDF && fileUrl;

  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
      <div className="group flex gap-x-2 items-start w-full">
        <div
          onClick={onMemberClick}
          className="cursor-pointer hover:drop-shadow-md transition"
        >
          <UserAvatar className="block" src={member.profile.imageUrl} />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p
                onClick={onMemberClick}
                className="font-semibild text-sm hover:underline cursor-pointer "
              >
                {member.profile.name}
              </p>
              <ActionToolTip label={member.role}>
                {roleIconMap[member.role]}
              </ActionToolTip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {timestamp}
            </span>
          </div>
          {isImage && (
            <a
              href=""
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
            >
              <Image
                src={fileUrl}
                alt={content}
                fill
                className="object-cover"
              />
            </a>
          )}
          {isPDF && (
            <div className="relative items-center p-2 mt-2 rounded-md bg-background/10">
              <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-indigo-500 text-sm dark:text-indigo-400 hover:underline"
              >
                PDF File
              </a>
            </div>
          )}
          {!fileUrl && !isEditing && (
            <p
              className={cn(
                "text-sm text-zinc-600 dark:text-zinc-300 ",
                deleted &&
                  "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1"
              )}
            >
              {content}
              {isUpdated && !deleted && (
                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400 ">
                  {"edited"}
                </span>
              )}
            </p>
          )}
          {!fileUrl && isEditing && (
            <Form {...form}>
              <form
                className="flex items-center w-full gap-x-2 pt-2"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  name="content"
                  control={form.control}
                  render={({ field }) => {
                    return (
                      <FormItem className="flex-1">
                        <FormControl>
                          <div className="relative w-full">
                            <Input
                              disabled={isLoading}
                              className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-0ffset-0 text-zinc-600 dark:text-zinc-200"
                              placeholder="Edited Message"
                              {...field}
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    );
                  }}
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  size="sm"
                  variant="primary"
                >
                  Save
                </Button>
              </form>
              <span className="text-[10px] mt-1 text-zinc-400">
                Press escape to cancel, enter to save
              </span>
            </Form>
          )}
        </div>
      </div>
      {canDeleteMessage && !isEditing && (
        <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
          {canEditMessage && (
            <ActionToolTip label="Edit">
              <Edit
                onClick={() => setIsEditing(true)}
                className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
              />
            </ActionToolTip>
          )}
          <ActionToolTip label="Edit">
            <Trash
              onClick={() => {
                onOpen("deleteMessage", {
                  apiUrl: `${socketUrl}/${id}`,
                  query: socketQuery,
                });
              }}
              className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
            />
          </ActionToolTip>
        </div>
      )}
    </div>
  );
};

export default ChatItem;
