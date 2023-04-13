import React, { useEffect, useRef } from "react";

interface WCProps {
  ref: React.MutableRefObject<HTMLElement | null>;
  filename: string;
  size: number;
  type?: string;
  progress?: number;
  error?: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface IntrinsicElements {
      "goa-file-upload-card": WCProps & React.HTMLAttributes<HTMLElement>;
    }
  }
}

/* eslint-disable-next-line */
interface FileUploadCardProps {
  filename: string;
  size: number;
  type?: string;
  progress?: number;
  error?: string;
  onDelete?: () => void;
  onCancel?: () => void;
}

export function GoAFileUploadCard({
  filename,
  size,
  type,
  progress,
  error,
  onDelete,
  onCancel,
}: FileUploadCardProps) {
  const el = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!el.current) return;

    const current = el.current;
    const deleteHandler = () => onDelete?.();
    const cancelHandler = () => onCancel?.();
    current.addEventListener("_delete", deleteHandler);
    current.addEventListener("_cancel", cancelHandler);
    return () => {
      current.removeEventListener("_delete", deleteHandler);
      current.removeEventListener("_cancel", cancelHandler);
    };
  }, [el, onDelete, onCancel]);

  return (
    <goa-file-upload-card
      ref={el}
      filename={filename}
      size={size}
      type={type}
      progress={progress}
      error={error}
    />
  );
}

export default GoAFileUploadCard;