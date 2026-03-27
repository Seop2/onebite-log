import { fetchPostById } from "@/api/posts";
import { QUERY_KEYS } from "@/lib/constants";
import { useSession } from "@/store/session";
import { useQuery } from "@tanstack/react-query";

export function usePostByIdData({
  postId,
  type,
}: {
  postId: number;
  type: "FEED" | "DETAIL";
}) {
  const session = useSession();

  return useQuery({
    queryKey: QUERY_KEYS.post.byId(postId),
    queryFn: () => fetchPostById({ postId, userId: session!.user.id }),
    //false 이면 캐싱된 데이터만 활용
    //true 일경우 서버에서 데이터를 불러옴 (queryFn 실행)
    enabled: type === "FEED" ? false : true,
  });
}
