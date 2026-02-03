import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./client";

// Upload file to Firebase Storage
export const uploadFile = async (
  path: string,
  file: File
): Promise<{ url: string | null; error: string | null }> => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return { url: downloadUrl, error: null };
  } catch (error: any) {
    console.error("Error uploading file:", error);
    return { url: null, error: error.message };
  }
};

// Upload KYC document
export const uploadKYCDocument = async (
  userId: string,
  documentType: "id_front" | "id_back",
  file: File
) => {
  const path = `kyc/${userId}/${documentType}_${Date.now()}`;
  return uploadFile(path, file);
};

// Upload business logo
export const uploadBusinessLogo = async (userId: string, file: File) => {
  const path = `logos/${userId}/logo_${Date.now()}`;
  return uploadFile(path, file);
};

// Delete file from Firebase Storage
export const deleteFile = async (path: string) => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Get file URL
export const getFileUrl = async (path: string) => {
  try {
    const storageRef = ref(storage, path);
    const url = await getDownloadURL(storageRef);
    return { url, error: null };
  } catch (error: any) {
    return { url: null, error: error.message };
  }
};
