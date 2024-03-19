import { useEffect, useState } from "react";

type ChatScrollProps = {
  chatRef: React.RefObject<HTMLDivElement>;
  bottomRef: React.RefObject<HTMLDivElement>;
  shouldLoadMore: boolean;
  loadMore: () => void;
  count: number;
};

export const useChatScroll = ({
  chatRef,
  bottomRef,
  shouldLoadMore,
  loadMore,
  count,
}: ChatScrollProps) => {
  const [hasInitiated, setHasInitiated] = useState(false);

  useEffect(() => {
    const topDiv = chatRef.current;

    const handleScroll = () => {
      const scrollTop = topDiv?.scrollTop;
      if (scrollTop === 0 && shouldLoadMore) {
        loadMore();
      }
    };

    topDiv?.addEventListener("scroll", handleScroll);

    return () => {
      topDiv?.removeEventListener("scroll", handleScroll);
    };
  }, [shouldLoadMore, loadMore, chatRef]);

  useEffect(() => {
    const bottomDiv = bottomRef.current;
    const topDiv = chatRef.current;
    const shouldAutoScroll = () => {
      if (!hasInitiated && bottomDiv) {
        setHasInitiated(true);
        return true;
      }

      if (!topDiv) return false;

      const distanceToBottom =
        topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;

      return distanceToBottom <= 100;
    };

    if (shouldAutoScroll()) {
      bottomDiv?.scrollIntoView({ behavior: "smooth" });
    }
  }, [bottomRef, chatRef, count, hasInitiated]);
};
