"use client";

import { createContext, useContext } from "react";
import type { User } from "@supabase/supabase-js";
import type { UserProfile } from "@/types";

type UserContextValue = {
  user: User | null;
  profile: UserProfile | null;
  configured: boolean;
};

const UserContext = createContext<UserContextValue | null>(null);

type UserProviderProps = UserContextValue & {
  children: React.ReactNode;
};

export function UserProvider({
  user,
  profile,
  configured,
  children,
}: UserProviderProps) {
  return (
    <UserContext.Provider value={{ user, profile, configured }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUserContext must be used within UserProvider.");
  }

  return context;
}
