'use client';
import React from "react";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";

interface userAvatarProps {
  src?: string;
  className?: string;
}

const UserAvatar = ({ src, className }: userAvatarProps) => {
  return (
    <Avatar className={cn("h-7 w-7 md:h-10 md:w-10", className)}>
      <AvatarImage className="rounded-full" src={src} />
    </Avatar>
  );
};

export default UserAvatar;
