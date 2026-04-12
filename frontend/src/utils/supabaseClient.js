import { createClient } from "@supabase/supabase-js";
import toast from "react-hot-toast";

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Uploads a file to Supabase Storage and returns the public URL.
 * @param {File} file - The file to upload.
 * @returns {Promise<string>} - The public URL of the uploaded image.
 */
export default function MediaUpload(file) {
    const promise = new Promise(
        (resolve, reject) => {
            if (file == null) {
                reject("No file selected");
                return;
            }
            const timeStamp = new Date().getTime();
            const newFileName = `${timeStamp}-${file.name}`;

            const bucketName = import.meta.env.VITE_SUPABASE_BUCKET;

            supabase.storage.from(bucketName).upload(`public/${newFileName}`, file, {
                cacheControl: '3600',
                upsert: false
            }).then(
                () => {
                    const url = supabase.storage.from(bucketName).getPublicUrl(`public/${newFileName}`).data.publicUrl;
                    resolve(url);
                }
            ).catch((error) => {
                console.error("Error uploading image:", error);
                toast.error("Error uploading image");
                reject("error uploading image");
            });
        }
    );
    return promise;
}
