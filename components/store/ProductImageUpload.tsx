import { useState } from "react";
import { Upload, X, Loader2, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProductImageUpload({
  onUpload,
}: {
  onUpload: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string>("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    setUploading(true);
    setUploadSuccess(false);
    setError(null);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to server
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.url) {
        onUpload(data.url);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 2000);
      } else {
        setError(data.error || "Upload failed");
        setPreview("");
      }
    } catch (err) {
      setError("Upload failed. Please try again.");
      setPreview("");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview("");
    onUpload("");
    setUploadSuccess(false);
    setError(null);
  };

  return (
    <div className="space-y-3">
      {preview ? (
        <div className="relative group">
          <div className="relative aspect-video w-full rounded-lg border-2 border-border overflow-hidden bg-muted">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            {uploadSuccess && (
              <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center backdrop-blur-sm animate-in fade-in duration-300">
                <div className="bg-green-500 text-white rounded-full p-3">
                  <Check size={32} strokeWidth={3} />
                </div>
              </div>
            )}
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleRemove}
          >
            <X size={16} />
          </Button>
        </div>
      ) : (
        <label
          htmlFor="image-upload"
          className={`
            relative flex flex-col items-center justify-center
            aspect-video w-full rounded-lg border-2 border-dashed
            cursor-pointer transition-all duration-200
            ${
              uploading
                ? "border-primary bg-primary/5"
                : error
                ? "border-destructive/50 bg-destructive/5"
                : "border-muted-foreground/25 hover:border-primary hover:bg-primary/5"
            }
          `}
        >
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />

          {uploading ? (
            <div className="flex flex-col items-center gap-3 text-primary">
              <div className="relative">
                <Loader2 size={48} className="animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-primary/10" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">Uploading image...</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Please wait while we process your file
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 text-muted-foreground px-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Upload size={32} className="text-primary" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">
                  Click to upload image
                </p>
                <p className="text-xs mt-1">PNG, JPG, GIF up to 5MB</p>
              </div>
            </div>
          )}
        </label>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
          <AlertCircle size={16} className="text-destructive shrink-0" />
          <p className="text-xs text-destructive font-medium">{error}</p>
        </div>
      )}

      {preview && !uploadSuccess && !error && (
        <p className="text-xs text-muted-foreground text-center">
          Image uploaded successfully
        </p>
      )}
    </div>
  );
}
