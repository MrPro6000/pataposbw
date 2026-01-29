import { useState, useRef, useCallback } from "react";
import { Camera, Upload, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface IDPhotoUploadProps {
  type: "front" | "back";
  userId: string;
  onUploadComplete: (url: string) => void;
  uploadedUrl?: string;
  isDark: boolean;
}

const IDPhotoUpload = ({ type, userId, onUploadComplete, uploadedUrl, isDark }: IDPhotoUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(uploadedUrl || null);
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);

      // Upload to storage
      const fileName = `${userId}/id-${type}-${Date.now()}.${file.name.split(".").pop()}`;
      const { data, error } = await supabase.storage
        .from("kyc-documents")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("kyc-documents")
        .getPublicUrl(data.path);

      onUploadComplete(urlData.publicUrl);
      toast({
        title: "Photo uploaded",
        description: `ID ${type} photo uploaded successfully`,
      });
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload photo",
        variant: "destructive",
      });
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setShowCamera(true);
    } catch (error: any) {
      toast({
        title: "Camera access denied",
        description: "Please allow camera access to scan your ID",
        variant: "destructive",
      });
    }
  };

  const capturePhoto = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      canvas.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], `id-${type}.jpg`, { type: "image/jpeg" });
          await handleFileSelect(file);
        }
      }, "image/jpeg", 0.9);
    }

    stopCamera();
  }, [type]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const removePhoto = () => {
    setPreview(null);
    onUploadComplete("");
  };

  return (
    <div className={`rounded-2xl p-4 ${isDark ? "bg-[#2a2a2a] border border-white/10" : "bg-white border border-[#e0e0e0]"}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className={`font-medium ${isDark ? "text-white" : "text-[#141414]"}`}>
          ID {type === "front" ? "Front" : "Back"}
        </h3>
        {preview && (
          <CheckCircle className="w-5 h-5 text-green-500" />
        )}
      </div>

      {showCamera ? (
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full rounded-xl aspect-[16/10] object-cover bg-black"
          />
          <canvas ref={canvasRef} className="hidden" />
          <div className="flex gap-2 mt-3">
            <Button
              onClick={capturePhoto}
              className="flex-1 bg-[#00C8E6] text-white hover:bg-[#00b8d4]"
            >
              <Camera className="w-4 h-4 mr-2" />
              Capture
            </Button>
            <Button
              onClick={stopCamera}
              variant="outline"
              className={`${isDark ? "border-white/20 text-white hover:bg-white/10" : ""}`}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : preview ? (
        <div className="relative">
          <img
            src={preview}
            alt={`ID ${type}`}
            className="w-full rounded-xl aspect-[16/10] object-cover"
          />
          <button
            onClick={removePhoto}
            className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          className={`aspect-[16/10] rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 ${
            isDark ? "border-white/20" : "border-[#e0e0e0]"
          }`}
        >
          <div className={`p-3 rounded-full ${isDark ? "bg-white/10" : "bg-[#f5f5f5]"}`}>
            <Upload className={`w-6 h-6 ${isDark ? "text-white/60" : "text-[#141414]/60"}`} />
          </div>
          <p className={`text-sm ${isDark ? "text-white/60" : "text-[#141414]/60"}`}>
            Upload or scan your ID {type}
          </p>
          <div className="flex gap-2">
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              size="sm"
              disabled={uploading}
              className={isDark ? "border-white/20 text-white hover:bg-white/10" : ""}
            >
              <Upload className="w-4 h-4 mr-1" />
              Upload
            </Button>
            <Button
              onClick={startCamera}
              size="sm"
              disabled={uploading}
              className="bg-[#00C8E6] text-white hover:bg-[#00b8d4]"
            >
              <Camera className="w-4 h-4 mr-1" />
              Scan
            </Button>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file);
        }}
      />

      {uploading && (
        <div className="mt-3 flex items-center gap-2">
          <div className="animate-spin w-4 h-4 border-2 border-[#00C8E6] border-t-transparent rounded-full"></div>
          <span className={`text-sm ${isDark ? "text-white/60" : "text-[#141414]/60"}`}>
            Uploading...
          </span>
        </div>
      )}
    </div>
  );
};

export default IDPhotoUpload;
