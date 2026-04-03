import { deleteImagesInPath } from "@/api/image";
import { deletePost } from "@/api/posts";
import { QUERY_KEYS } from "@/lib/constants";
import type { useMutationCallback } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * 포스트 삭제
 * @param callbacks
 * @returns
 */
export default function useDeletePost(callbacks?: useMutationCallback) {
  //캐시 데이터 조작시 해당 클라이언트 불러옴.
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePost,
    onSuccess: async (deletedPost) => {
      if (callbacks?.onSuccess) callbacks.onSuccess();
      //이미지 삭제
      if (deletedPost.media_urls && deletedPost.media_urls.length > 0) {
        await deleteImagesInPath(`${deletedPost.author_id}/${deletedPost.id}`);
      }
      queryClient.resetQueries({
        queryKey: QUERY_KEYS.post.list,
      });
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
