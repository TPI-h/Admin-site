import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Upload, X } from "lucide-react";

interface MultiImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  bucketName: string;
  label: string;
  maxImages?: number;
}

export const MultiImageUpload = ({ 
  images, 
  onImagesChange, 
  bucketName, 
  label, 
  maxImages = 10 
}: MultiImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
      return null;
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (images.length + files.length > maxImages) {
      toast({
        title: "Too many images",
        description: `Maximum ${maxImages} images allowed`,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    const newImages: string[] = [];

    for (const file of files) {
      const imageUrl = await uploadImage(file);
      if (imageUrl) {
        newImages.push(imageUrl);
      }
    }

    if (newImages.length > 0) {
      onImagesChange([...images, ...newImages]);
    }

    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (indexToRemove: number) => {
    const updatedImages = images.filter((_, index) => index !== indexToRemove);
    onImagesChange(updatedImages);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>{label}</Label>
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="image-upload"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || images.length >= maxImages}
            className="w-full"
          >
            <Upload className="mr-2 h-4 w-4" />
            {uploading ? "Uploading..." : `Upload Images (${images.length}/${maxImages})`}
          </Button>
        </div>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square w-full bg-muted rounded-md overflow-hidden">
                <img
                  src={imageUrl}
                  alt={`Image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};