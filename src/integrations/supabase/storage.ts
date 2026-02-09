import { supabase } from "./client";

// Upload file to Supabase Storage
export const uploadFile = async (
  bucket: string,
  path: string,
  file: File
): Promise<{ url: string | null; error: string | null }> => {
  try {
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      return { url: null, error: uploadError.message };
    }

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);

    return { url: urlData.publicUrl, error: null };
  } catch (error: any) {
    console.error("Error uploading file:", error);
    return { url: null, error: error.message };
  }
};

// Upload KYC document — returns the storage path (not public URL) for private bucket
export const uploadKYCDocument = async (
  userId: string,
  documentType: "id_front" | "id_back",
  file: File
) => {
  const path = `${userId}/${documentType}_${Date.now()}.${file.name.split(".").pop()}`;
  try {
    const { error: uploadError } = await supabase.storage
      .from("kyc-documents")
      .upload(path, file, { cacheControl: "3600", upsert: true });

    if (uploadError) {
      return { url: null, error: uploadError.message };
    }

    // Return the path so it can be stored in the DB and signed later
    return { url: path, error: null };
  } catch (error: any) {
    return { url: null, error: error.message };
  }
};

// Upload business logo
export const uploadBusinessLogo = async (userId: string, file: File) => {
  const path = `logos/${userId}/logo_${Date.now()}`;
  return uploadFile("my-bucket", path, file);
};

// Delete file from Supabase Storage
export const deleteFile = async (bucket: string, path: string) => {
  try {
    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Get file URL (signed URL for private buckets)
export const getFileUrl = async (bucket: string, path: string) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, 3600); // 1 hour expiry

    if (error) {
      return { url: null, error: error.message };
    }

    return { url: data.signedUrl, error: null };
  } catch (error: any) {
    return { url: null, error: error.message };
  }
};
