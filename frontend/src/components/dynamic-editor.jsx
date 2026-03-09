"use client";

import dynamic from "next/dynamic";

export const Editor = dynamic(() => import("./blocknote-editor"), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center h-64 rounded-lg border border-border bg-muted/30">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
                <span className="text-sm">Loading editor...</span>
            </div>
        </div>
    ),
});
