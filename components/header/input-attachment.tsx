import React, { useRef } from "react";

interface InputAttachmentProps {
  id: string;
  className?: string;
  accept?: string;
  onChange: (file: File) => void;
}

export const InputAttachment: React.FC<InputAttachmentProps> = ({
  id,
  className,
  accept,
  onChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onChange(file);
    }
  };

  return (
    <div className={className} onClick={handleClick}>
      <input
        ref={inputRef}
        type="file"
        id={id}
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
};
