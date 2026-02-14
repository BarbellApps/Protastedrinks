"use client";

import { ReactNode } from "react";
import { LoadingProvider } from "./LoadingContext";

export default function Providers({ children }: { children: ReactNode }) {
    return <LoadingProvider>{children}</LoadingProvider>;
}
