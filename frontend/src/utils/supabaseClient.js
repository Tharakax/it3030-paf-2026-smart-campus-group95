import { createClient } from "@supabase/supabase-js";
import toast from "react-hot-toast";

// Initialize Supabase client
const supabaseUrl = "https://ombvnpeoietugpxelugs.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tYnZucGVvaWV0dWdweGVsdWdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5ODM2ODYsImV4cCI6MjA2NzU1OTY4Nn0.mv9NsqrC2tckMmHa2w0X8Vg0fGtjsQXYYbMG1LRy9K4";
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

            supabase.storage.from('cropcartimages').upload(`public/${newFileName}`, file, {
                cacheControl: '3600',
                upsert: false
            }).then(
                () => {
                    const url = supabase.storage.from('cropcartimages').getPublicUrl(`public/${newFileName}`).data.publicUrl;
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
