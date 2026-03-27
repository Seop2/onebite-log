import supabase from "@/lib/supabase";
import { getRandomNickname } from "@/lib/utils";
import { deleteImagesInPath, uploadImage } from "./image";

/**
 * 프로필 조회
 * @param userId
 * @returns
 */
export async function fetchProfile(userId: string) {
  const { data, error } = await supabase
    .from("profile")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * 프로필 생성
 * @param userId
 * @returns
 */
export async function createProfile(userId: string) {
  const { data, error } = await supabase
    .from("profile")
    .insert({
      id: userId,
      nickname: getRandomNickname(),
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

/**
 * 프로필 수정 요청
 */
export async function updateProfile({
  userId,
  nickname,
  bio,
  avatarImageFile,
}: {
  userId: string;
  nickname?: string;
  bio?: string;
  avatarImageFile?: File;
}) {
  //1. 기존 아바타 이미지 삭제
  if (avatarImageFile) {
    await deleteImagesInPath(`${userId}/avatar`);
  }

  //2. 새로운 이미지 아바타 업로드
  let newAvatarImageUrl;
  if (avatarImageFile) {
    const fileExtension = avatarImageFile.name.split(".").pop() || "webp";
    const filePath = `${userId}/avatar/${new Date().getTime()}- ${crypto.randomUUID()}.${fileExtension}`;

    newAvatarImageUrl = await uploadImage({
      file: avatarImageFile,
      filePath,
    });
  }

  //3. 프로필 테이블 업데이트
  const { data, error } = await supabase
    .from("profile")
    .update({ nickname, bio, avatar: newAvatarImageUrl })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
