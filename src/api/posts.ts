import supabase from "@/lib/supabase";
import { uploadFile, uploadImage } from "./image";
import type { PostEntity } from "@/types";

/**
 * 데이터 패칭
 * @param param0
 * @returns
 */
export async function fetchPosts({
  from,
  to,
  userId,
  authorId,
}: {
  from: number;
  to: number;
  userId: string;
  authorId?: string;
}) {
  const request = supabase
    .from("post")
    .select("*, author: profile!author_id(*), myLiked: like!post_id (*)")
    .eq("like.user_id", userId)
    .order("created_at", { ascending: false }) //생성일을 기준으로 내림차순
    .range(from, to);

  if (authorId) {
    request.eq("author_id", authorId);
  }

  const { data, error } = await request;

  if (error) throw error;

  return data.map((post) => ({
    ...post,
    isLiked: post.myLiked && post.myLiked.length > 0,
  }));
}

/**
 * 포스트 생성
 * @param content
 * @returns
 */
export async function createPost(content: string) {
  const { data, error } = await supabase
    .from("post")
    .insert({
      content,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * 이미지 포함한 포스트 생성
 * @param param0
 * @returns
 */
export async function createPostWithImage({
  content,
  images,
  userId,
}: {
  content: string;
  images: File[];
  userId: string;
}) {
  //1. 새로운 포스트 생성
  const post = await createPost(content);
  if (images.length === 0) return post;

  try {
    //2. 이미지 업로드
    //이미지 병렬
    const imageUrls = await Promise.all(
      images.map((image) => {
        const fileExtension = image.name.split(".").pop() || "webp";
        const filename = `${Date.now()}-${crypto.randomUUID()}.${fileExtension}`;
        const filePath = `${userId}/${post.id}/${filename}`;
        return uploadImage({
          file: image,
          filePath,
        });
      }),
    );
    //3. 포스트 테이블 업데이트
    const updatedPost = await updatePost({
      id: post.id,
      img_urls: imageUrls,
    });
    return updatedPost;
  } catch (error) {
    //업로드 실패시 해당 포스트 삭제
    await deletePost(post.id);
    throw error;
  }
}

/**
 * 포스트 수정
 * @param post
 * @returns
 */
export async function updatePost(post: Partial<PostEntity> & { id: number }) {
  const { data, error } = await supabase
    .from("post")
    .update(post)
    .eq("id", post.id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

/**
 * 포스트 삭제
 * @param id
 * @returns
 */
export async function deletePost(id: number) {
  const { data, error } = await supabase
    .from("post")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

/**
 * 서버에서 하나의 포스트 값을 불러오는 함수
 * @param postId
 * @returns
 */
export async function fetchPostById({
  postId,
  userId,
}: {
  postId: number;
  userId: string;
}) {
  const { data, error } = await supabase
    .from("post")
    .select("*, author: profile!author_id(*), myLiked: like!post_id (*)")
    .eq("like.user_id", userId)
    .eq("id", postId)
    .single();
  if (error) throw error;
  return { ...data, isLiked: data.myLiked && data.myLiked.length > 0 };
}

/**
 * supabase RPC로 supabase에 등록된 데이터베이스 함수를 원격으로 호출
 * 좋아요 기능
 * @param param0
 */
export async function togglePostLike({
  postId,
  userId,
}: {
  postId: number;
  userId: string;
}) {
  const { data, error } = await supabase.rpc("toggle_post_like", {
    p_post_id: postId,
    p_user_id: userId,
  });
  if (error) throw error;
  return data;
}

/**
 * 첨부파일 포함한 포스트 생성하기
 * @param param0
 * @returns
 */
export async function createPostWithMedia({
  content,
  files,
  userId,
}: {
  content: string;
  files?: File[];
  userId: string;
}) {
  //1. 새로운 포스트 생성
  const post = await createPost(content);
  if (files?.length === 0) return post;
  try {
    //첨부파일 등록
    const mediaUrls = await Promise.all(
      files!.map(async (file) => {
        const isVideo = file.type.startsWith("video/");
        const originalExtension = file.name.split(".").pop();
        const fileExtension = originalExtension || (isVideo ? "mp4" : "webp");
        //파일 중복 방지
        const fileName = `${Date.now()} - ${crypto.randomUUID()}.${fileExtension}`;
        const filePath = `${userId}/${post.id}/${fileName}`;

        //용량 체크
        if (isVideo && file.size > 50 * 1024 * 1024) {
          // 50MB 제한 예시
          throw new Error("비디오 파일이 너무 큽니다.");
        }

        return uploadFile({
          file,
          filePath,
        });
      }),
    );
    //3. 포스트 테이블 업데이트
    const updatedPost = await updatePost({
      id: post.id,
      img_urls: mediaUrls,
    });
    return updatedPost;
  } catch (error) {
    //업로드 실패시 해당 포스트 삭제
    await deletePost(post.id);
    throw error;
  }
}
