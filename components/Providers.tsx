"use client";

import { createContext, useContext, type ReactNode } from "react";
import useSWR, { SWRConfig } from "swr";
import { api, fetcher } from "@/lib/client";

type PlannerState = {
  planner: boolean;
  logIn: (password: string) => Promise<void>;
  logOut: () => Promise<void>;
};

const PlannerContext = createContext<PlannerState>({
  planner: false,
  logIn: async () => {},
  logOut: async () => {},
});

function PlannerProvider({ children }: { children: ReactNode }) {
  const { data, mutate } = useSWR<{ planner: boolean }>("/api/auth", fetcher, {
    refreshInterval: 0,
  });

  const value: PlannerState = {
    planner: data?.planner ?? false,
    async logIn(password) {
      await api("/api/auth", "POST", { password });
      await mutate({ planner: true }, { revalidate: false });
    },
    async logOut() {
      await api("/api/auth", "DELETE");
      await mutate({ planner: false }, { revalidate: false });
    },
  };

  return <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>;
}

export function usePlanner() {
  return useContext(PlannerContext);
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SWRConfig value={{ fetcher, refreshInterval: 20_000, revalidateOnFocus: true }}>
      <PlannerProvider>{children}</PlannerProvider>
    </SWRConfig>
  );
}
