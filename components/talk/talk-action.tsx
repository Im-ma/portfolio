"use client";

import { Button } from "@/components/button/button";
import { useTalk } from "./talk-provider";

export function TalkAction({
  action,
  variant = "primary",
  arrow,
  full,
  className,
  children,
}: {
  action: string;
  variant?: "primary" | "secondary";
  arrow?: boolean;
  full?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const { openTalk } = useTalk();
  return (
    <Button
      variant={variant}
      arrow={arrow}
      full={full}
      className={className}
      onClick={() => openTalk(action)}
    >
      {children}
    </Button>
  );
}
