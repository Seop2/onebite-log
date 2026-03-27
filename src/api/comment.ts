import supabase from "@/lib/supabase";

/**
 * 댓글 생성
 * @param param0
 * @returns
 */
export async function createComment({
  postId,
  content,
  parentCommentId,
  rootCommentId,
}: {
  postId: number;
  content: string;
  parentCommentId?: number;
  rootCommentId?: number;
}) {
  const { data, error } = await supabase
    .from("comment")
    .insert({
      post_id: postId,
      content: content,
      parent_comment_id: parentCommentId, //대댓글 추가
      root_comment_id: rootCommentId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * 댓글 조회
 * @param postId
 * @returns
 */
export async function fetchComment(postId: number) {
  const { data, error } = await supabase
    .from("comment")
    .select("*, author: profile!author_id (*)")
    .eq("post_id", postId)
    .order("created_at", { ascending: true }); //오름차순
  if (error) throw error;
  return data;
}

/**
 * 댓글 수정
 * @param param0
 * @returns
 */
export async function updateComment({
  id,
  content,
}: {
  id: number;
  content: string;
}) {
  const { data, error } = await supabase
    .from("comment")
    .update({ content })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

/**
 * 댓글 삭제
 * @param id
 * @returns
 */
export async function deleteComment(id: number) {
  const { data, error } = await supabase
    .from("comment")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

/**
 * 포스트 별 댓글 수 세기 기능
 */
export async function commentCountOfPostId(postId: number) {
  const { data, error } = await supabase.rpc("get_single_post_comment_count", {
    p_post_id: postId,
  });
  if (error) throw error;

  return data as number;
}
