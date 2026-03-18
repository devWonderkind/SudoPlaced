"use client";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
import "@blocknote/core/fonts/inter.css";
import { useTheme } from "next-themes";

export default function BlockNoteEditor({ initialContent, onChange, editable = true }) {
    const { resolvedTheme } = useTheme();

    const editor = useCreateBlockNote({
        initialContent: (Array.isArray(initialContent) && initialContent.length === 0) 
            ? undefined 
            : (initialContent || undefined),
    });

    return (
        <div className="blocknote-editor-wrapper">
            <BlockNoteView
                editor={editor}
                theme={resolvedTheme === "dark" ? "dark" : "light"}
                editable={editable}
                onChange={() => {
                    if (onChange) {
                        onChange(editor.document);
                    }
                }}
            />
        </div>
    );
}
