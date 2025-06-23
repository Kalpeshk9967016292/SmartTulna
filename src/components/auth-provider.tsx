"use client";
import { AuthProvider as Provider } from "@/hooks/use-auth";
import type { ReactNode } from "react";

export default function AuthProvider({ children }: { children: ReactNode }) {
    return <Provider>{children}</Provider>;
}
