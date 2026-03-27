import { togglePostLike } from "@/api/posts";
import { QUERY_KEYS } from "@/lib/constants";
import type { Post, useMutationCallback } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * 포스트 좋아요
 * @param callbacks
 * @returns
 */
export default function useTogglePostLike(callbacks?: useMutationCallback) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: togglePostLike, //{postId,userId,}
    //낙관적 업데이트
    onMutate: async ({ postId }) => {
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.post.byId(postId),
      });
      const prevPost = queryClient.getQueryData<Post>(
        QUERY_KEYS.post.byId(postId),
      );
      queryClient.setQueryData<Post>(QUERY_KEYS.post.byId(postId), (post) => {
        if (!post) throw new Error("포스트가 존재하지 않습니다.");
        return {
          ...post,
          isLiked: !post.isLiked,
          like_count: post.isLiked ? post.like_count - 1 : post.like_count + 1,
        };
      });
      return { prevPost };
    },
    onSuccess: () => {
      if (callbacks?.onSuccess) callbacks.onSuccess();
    },
    onError: (error, _, context) => {
      if (context && context.prevPost) {
        queryClient.setQueryData(
          QUERY_KEYS.post.byId(context.prevPost.id),
          context.prevPost,
        );
      }
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
