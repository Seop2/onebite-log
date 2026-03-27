import { BUCKET_NAME } from "@/lib/constants";
import supabase from "@/lib/supabase";

/**
 * 이미지 업로드
 * @param param0
 * @returns
 */
export async function uploadImage({
  file,
  filePath,
}: {
  file: File;
  filePath: string;
}) {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file);

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);
  return publicUrl;
}

/**
 * 이미지 삭제
 * @param path
 * @returns
 */
export async function deleteImagesInPath(path: string) {
  const { data: files, error: fetchFilesError } = await supabase.storage
    .from(BUCKET_NAME)
    .list(path);

  if (fetchFilesError) throw fetchFilesError;
  if (!files || files.length === 0) return;

  const { error: removeError } = await supabase.storage
    .from(BUCKET_NAME)
    .remove(files.map((file) => `${path}/${file.name}`));

  if (removeError) throw removeError;
}

export async function uploadFile({
  file,
  filePath,
}: {
  file: File;
  filePath: string;
}) {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw error;
  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);
  return publicUrl;
}
