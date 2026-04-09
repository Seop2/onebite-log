import { commentCountOfPostId } from "@/api/comment";
import { QUERY_KEYS } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";

export function useCommentCountData(postId: number) {
  return useQuery({
    queryKey: QUERY_KEYS.comment.count(postId),
    queryFn: () => commentCountOfPostId(postId),
    enabled: !!postId,
  });
}
