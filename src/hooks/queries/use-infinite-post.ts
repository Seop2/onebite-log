import { fetchPosts } from "@/api/posts";
import { QUERY_KEYS } from "@/lib/constants";
import { useSession } from "@/store/session";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

const PAGE_SIZE = 5;
/**
 * 리액트 쿼리로 무한 스크롤 기능 구현
 * @returns
 */
export function useInfinitePostData(authorId?: string) {
  const session = useSession();
  const userId = session!.user.id;
  const queryClient = useQueryClient();

  return useInfiniteQuery({
    queryKey: !authorId
      ? QUERY_KEYS.post.list
      : QUERY_KEYS.post.userList(authorId),

    queryFn: async ({ pageParam }) => {
      const from = pageParam * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const posts = await fetchPosts({ from, to, userId, authorId });
      //정규화
      posts.forEach((post) => {
        queryClient.setQueryData(QUERY_KEYS.post.byId(post.id), post);
      });
      return posts.map((post) => post.id);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < PAGE_SIZE) return undefined; //마지막 페이지
      return allPages.length; //디음 페이지 번호 설정
    },

    staleTime: Infinity,
  });
}
