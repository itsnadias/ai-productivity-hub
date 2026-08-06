import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import type { ToolId } from "@/lib/prompts";

export type SessionEntry = {
  id: string;
  tool: ToolId;
  label: string;
  createdAt: number;
};

type SessionContextValue = {
  entries: SessionEntry[];
  record: (tool: ToolId, label: string) => void;
  clear: () => void;
  countFor: (tool: ToolId) => number;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<SessionEntry[]>([]);

  const record = useCallback((tool: ToolId, label: string) => {
    setEntries((prev) => [
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        tool,
        label: label.trim() || "Untitled",
        createdAt: Date.now(),
      },
      ...prev,
    ]);
  }, []);

  const clear = useCallback(() => setEntries([]), []);

  const value = useMemo<SessionContextValue>(
    () => ({
      entries,
      record,
      clear,
      countFor: (tool) => entries.filter((entry) => entry.tool === tool).length,
    }),
    [entries, record, clear],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
