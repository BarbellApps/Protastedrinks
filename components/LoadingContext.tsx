"use client";

import {
    createContext,
    useContext,
    useState,
    ReactNode,
    Dispatch,
    SetStateAction,
} from "react";

interface LoadingContextType {
    isLoading: boolean;
    setIsLoading: Dispatch<SetStateAction<boolean>>;
    progress: number;
    setProgress: Dispatch<SetStateAction<number>>;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    return (
        <LoadingContext.Provider value={{ isLoading, setIsLoading, progress, setProgress }}>
            {children}
        </LoadingContext.Provider>
    );
}

export function useLoading() {
    const context = useContext(LoadingContext);
    if (context === undefined) {
        throw new Error("useLoading must be used within a LoadingProvider");
    }
    return context;
}
