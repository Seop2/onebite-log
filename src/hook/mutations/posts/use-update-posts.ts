import { updatePost } from "@/api/posts";
import { QUERY_KEYS } from "@/lib/constants";
import type { Post, useMutationCallback } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * 포스트 수정
 * @param callbacks
 * @returns
 */
export default function useUpdatePost(callbacks?: useMutationCallback) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePost,
    onSuccess: (updatedPost) => {
      if (callbacks?.onSuccess) callbacks.onSuccess();
      //수정시 새로고침없이 바로 화면에 렌더링됨.
      queryClient.setQueryData<Post>(
        QUERY_KEYS.post.byId(updatedPost.id),
        (prevPost) => {
          if (!prevPost) {
            throw new Error(
              `${updatedPost.id}에 해당하는  포스트를 캐시 데이터에서 찾을 수 없습니다.`,
            );
          }
          return { ...prevPost, ...updatedPost };
        },
      );
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
