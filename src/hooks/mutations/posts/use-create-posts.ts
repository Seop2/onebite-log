import { createPostWithMedia } from "@/api/posts";
import { QUERY_KEYS } from "@/lib/constants";
import type { useMutationCallback } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * 포스트 생성
 * @param callbacks
 * @returns
 */
export default function useCreatePost(callbacks?: useMutationCallback) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPostWithMedia,
    onSuccess: () => {
      if (callbacks?.onSuccess) callbacks.onSuccess();
      queryClient.resetQueries({
        queryKey: QUERY_KEYS.post.list,
      });
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
