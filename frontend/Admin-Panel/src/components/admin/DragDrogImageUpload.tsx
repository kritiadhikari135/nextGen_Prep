import { useState, useCallback } from "react";
import { Upload } from "lucide-react";
import { X } from "lucide-react";
import { Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DragDropImageUploadProps {
  value: { url: string } | File | null;
  onChange: (value: File | null) => void;
  label: string;
  error?: string;
}

export const DragDropImageUpload: React.FC<DragDropImageUploadProps> = ({
  value,
  onChange,
  label,
  error,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string>("");

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files && files[0]) {
        const file = files[0];
        if (file.type.startsWith("image/")) {
          // Send the File object to parent
          onChange(file);

          // Create preview URL
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreview(reader.result as string);
          };
          reader.readAsDataURL(file);
        }
      }
    },
    [onChange]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files[0]) {
        const file = files[0];
        if (file.type.startsWith("image/")) {
          // Send the File object to parent
          onChange(file);

          // Create preview URL
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreview(reader.result as string);
          };
          reader.readAsDataURL(file);
        }
      }
    },
    [onChange]
  );

  const handleRemove = useCallback(() => {
    onChange(null);
    setPreview("");
  }, [onChange]);

  // Get the preview URL - either from new upload or existing value
  const getPreviewUrl = () => {
    if (preview) return preview;
    if (value && typeof value === "object" && "url" in value) return value.url;
    return "";
  };

  const previewUrl = getPreviewUrl();
  const fileName = value instanceof File ? value.name : "Image uploaded";

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>

      {!value && !preview ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          }`}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-foreground">
              Drag and drop an image here, or click to browse
            </p>
            <p className="text-xs text-muted-foreground">
              Supports: JPG, PNG, GIF, WebP
            </p>
          </div>
        </div>
      ) : (
        <div className="relative border border-border rounded-lg p-4">
          <div className="flex items-start gap-4">
            <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <ImageIcon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <p className="text-sm text-foreground truncate">{fileName}</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleRemove}
                  className="flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Click the × button to remove and upload a new image
              </p>
            </div>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};
