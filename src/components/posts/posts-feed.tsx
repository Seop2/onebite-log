import Fallback from "../fallback";
import Loader from "../loader";
import PostItem from "./posts-item";
import { useInView } from "react-intersection-observer";
import { useEffect, useRef } from "react";
import { useInfinitePostData } from "@/hook/queries/use-infinite-post";
import { toast } from "sonner";

/**
 * 포스트 피드 컴포넌트
 * @param param0
 * @returns
 */
export default function PostFeed({ authorId }: { authorId?: string }) {
  const {
    data,
    error,
    isPending,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfinitePostData(authorId);
  const { ref, inView } = useInView();

  useEffect(() => {
    if (!inView) return;
    if (hasNextPage) {
      fetchNextPage(); //다음 페이지 요청
    } else {
      toast("마지막 게시글 입니다!");
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (error) return <Fallback />;
  if (isPending) return <Loader />;

  return (
    <div className="flex flex-col gap-10">
      {data.pages.map((page) =>
        page.map((postId) => (
          <PostItem key={postId} postId={postId} type={"FEED"} />
        )),
      )}
      {/* 다음 페이지를 불러오는 중인지 판별 isFetchingNextPage*/}
      {isFetchingNextPage && <Loader />}
      {/*무한스크롤 감지하는 ref (intersection observer)*/}
      <div ref={ref}></div>
    </div>
  );
}
