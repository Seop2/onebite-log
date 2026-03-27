import { updateComment } from "@/api/comment";
import { QUERY_KEYS } from "@/lib/constants";
import type { Comment, useMutationCallback } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * 댓글 수정
 * @param callBacks
 * @returns
 */
export function useUpdateComment(callBacks?: useMutationCallback) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateComment,
    onSuccess: (updatedComment) => {
      if (callBacks?.onSuccess) callBacks.onSuccess();
      queryClient.setQueryData<Comment[]>(
        QUERY_KEYS.comment.post(updatedComment.post_id), //key
        (comments) => {
          if (!comments)
            throw Error("댓글에 캐시 데이터가 보관되어 있지 않습니다.");

          return comments.map((comment) => {
            if (comment.id === updatedComment.id) {
              return { ...comment, ...updatedComment };
            }
            return comment;
          });
        },
      );
    },
    onError: (error) => {
      if (callBacks?.onError) callBacks.onError(error);
    },
  });
}
