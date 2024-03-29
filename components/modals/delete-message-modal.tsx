"use client";

import qs from "query-string";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-modal-store";
import { Button } from "../ui/button";
import { useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

export const DeleteMessageModal = () => {
  const { onOpen, isOpen, onClose, type, data } = useModal();

  const router = useRouter();
  const params = useParams();

  const { apiUrl, query } = data;
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query,
      });

      await axios.delete(url);
      onClose();
      router.push(`/servers/${params?.serverId}`);
      router.refresh();
      setIsLoading(false);
      onClose();
    } catch (error) {
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const isModalOpen = isOpen && type === "deleteMessage";

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center">
            Delete Channel
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to do this ? <br />
            The message will be permanently deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button disabled={isLoading} onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button disabled={isLoading} onClick={onClick} variant="primary">
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
