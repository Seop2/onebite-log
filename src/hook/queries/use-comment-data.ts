import { fetchComment } from "@/api/comment";
import { QUERY_KEYS } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";

export function useCommentData(postId: number) {
  return useQuery({
    queryKey: QUERY_KEYS.comment.post(postId),
    queryFn: () => fetchComment(postId),
  });
}
