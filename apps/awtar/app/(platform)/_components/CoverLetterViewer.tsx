"use client";

import LinkExt from "@tiptap/extension-link";
import UnderlineExt from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

type Props = {
    html: string;
    className?: string;
};

export function CoverLetterViewer({ html, className = "" }: Props) {
    const editor = useEditor({
        immediatelyRender: false,
        editable: false,
        extensions: [StarterKit, UnderlineExt, LinkExt.configure({ openOnClick: true })],
        content: html,
        editorProps: {
            attributes: {
                class: "outline-none",
            },
        },
    });

    return (
        <>
            <style>{`
                .cover-letter-viewer .tiptap ul { list-style-type: disc; padding-left: 1.5rem; margin: 0.25rem 0; }
                .cover-letter-viewer .tiptap ol { list-style-type: decimal; padding-left: 1.5rem; margin: 0.25rem 0; }
                .cover-letter-viewer .tiptap li { margin: 0.125rem 0; }
                .cover-letter-viewer .tiptap blockquote { border-left: 3px solid #E5E7EB; padding-left: 1rem; color: #6B7280; margin: 0.5rem 0; }
                .cover-letter-viewer .tiptap a { color: #2563EB; text-decoration: underline; }
                .cover-letter-viewer .tiptap p { margin: 0; }
                .cover-letter-viewer .tiptap p + p { margin-top: 0.5rem; }
            `}</style>
            <div className={`cover-letter-viewer text-sm font-medium leading-7 ${className}`}>
                <EditorContent editor={editor} />
            </div>
        </>
    );
}
