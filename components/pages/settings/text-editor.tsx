import React from "react";
import dynamic from "next/dynamic";

const TextEditorClient = dynamic(() => import("./text-editor-client"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ value, onChange }) => {
  return <TextEditorClient value={value} onChange={onChange} />;
};

export default TextEditor;
