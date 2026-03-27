import { deleteComment } from "@/api/comment";
import { QUERY_KEYS } from "@/lib/constants";
import type { Comment, useMutationCallback } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * 댓글 삭제
 * @param callBacks
 * @returns
 */
export function useDeleteComment(callBacks?: useMutationCallback) {
  const queryclient = useQueryClient();

  return useMutation({
    mutationFn: deleteComment,
    onSuccess: (deletedComment) => {
      if (callBacks?.onSuccess) callBacks.onSuccess();

      queryclient.setQueryData<Comment[]>(
        QUERY_KEYS.comment.post(deletedComment.post_id),
        (comments) => {
          if (!comments)
            throw Error("댓글이 캐시 데이터에 보관되어 있지 않습니다.");
          return comments.filter((comment) => comment.id !== deletedComment.id);
        },
      );
    },

    onError: (error) => {
      if (callBacks?.onError) callBacks.onError(error);
    },
  });
}
