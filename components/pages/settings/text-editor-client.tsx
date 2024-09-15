"use client";

import React, { forwardRef, useCallback, useEffect, useState } from "react";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Type,
  Underline as UnderlineIcon,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TipTapEditorProps {
  value: string;
  onChange: (value: string) => void;
}

interface ToolbarButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isActive: boolean;
  icon: LucideIcon;
  tooltip: string;
}

const ToolbarButton = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ onClick, isActive, icon: Icon, tooltip }, ref) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            ref={ref}
            onClick={(e) => {
              e.preventDefault();
              onClick(e);
            }}
            className={`p-2 rounded-sm ${isActive ? "bg-gray-200" : "hover:bg-gray-100"}`}
          >
            <Icon size={18} />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
);

ToolbarButton.displayName = "ToolbarButton";

const TipTapEditorClient: React.FC<TipTapEditorProps> = ({
  value,
  onChange,
}) => {
  const [linkUrl, setLinkUrl] = useState<string>("");
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [isEditingLink, setIsEditingLink] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
        linkOnPaste: true,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none",
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && !isLinkDialogOpen) {
      setIsEditingLink(false);
    }
  }, [editor, isLinkDialogOpen]);

  const setLink = useCallback(() => {
    if (linkUrl === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor
        ?.chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .run();
    }
    setLinkUrl("");
    setIsLinkDialogOpen(false);
    setIsEditingLink(false);
  }, [editor, linkUrl]);

  const handleLinkButtonClick = useCallback(() => {
    if (editor?.isActive("link")) {
      const attrs = editor.getAttributes("link");
      setLinkUrl(attrs.href || "");
      setIsEditingLink(true);
    } else {
      setLinkUrl("");
      setIsEditingLink(false);
    }
    setIsLinkDialogOpen(true);
  }, [editor]);

  const toggleBulletList = useCallback(() => {
    editor?.chain().focus().toggleBulletList().run();
  }, [editor]);

  const toggleOrderedList = useCallback(() => {
    editor?.chain().focus().toggleOrderedList().run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mt-8 border rounded-lg overflow-hidden">
      <style jsx global>{`
        .ProseMirror {
          outline: none;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          color: #adb5bd;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
        .ProseMirror ul,
        .ProseMirror ol {
          padding-left: 1.5em;
        }
        .ProseMirror ul {
          list-style-type: disc;
        }
        .ProseMirror ol {
          list-style-type: decimal;
        }
      `}</style>
      <div className="flex flex-wrap items-center space-x-1 p-2 border-b bg-gray-50">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          icon={Bold}
          tooltip="Bold"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          icon={Italic}
          tooltip="Italic"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          icon={UnderlineIcon}
          tooltip="Underline"
        />
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          isActive={editor.isActive({ textAlign: "left" })}
          icon={AlignLeft}
          tooltip="Align Left"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          isActive={editor.isActive({ textAlign: "center" })}
          icon={AlignCenter}
          tooltip="Align Center"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          isActive={editor.isActive({ textAlign: "right" })}
          icon={AlignRight}
          tooltip="Align Right"
        />
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <ToolbarButton
          onClick={toggleBulletList}
          isActive={editor.isActive("bulletList")}
          icon={List}
          tooltip="Bullet List"
        />
        <ToolbarButton
          onClick={toggleOrderedList}
          isActive={editor.isActive("orderedList")}
          icon={ListOrdered}
          tooltip="Ordered List"
        />
        <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
          <DialogTrigger asChild>
            <ToolbarButton
              onClick={handleLinkButtonClick}
              isActive={editor.isActive("link")}
              icon={LinkIcon}
              tooltip="Insert/Edit Link"
            />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEditingLink ? "Edit Link" : "Insert Link"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                id="link"
                placeholder="Enter URL"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              />
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsLinkDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={setLink}>
                  {isEditingLink ? "Atualizar" : "Aplicar"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().clearNodes().unsetAllMarks().run()
          }
          isActive={false}
          icon={Type}
          tooltip="Clear Formatting"
        />
      </div>
      <EditorContent editor={editor} className="p-4 min-h-[200px]" />
    </div>
  );
};

export default TipTapEditorClient;
