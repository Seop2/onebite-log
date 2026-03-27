import Fallback from "../fallback";
import Loader from "../loader";
import PostItem from "./posts-item";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { useInfinitePostData } from "@/hook/queries/use-infinite-post";

/**
 * 포스트 피드 컴포넌트
 * @param param0
 * @returns
 */
export default function PostFeed({ authorId }: { authorId?: string }) {
  const { data, error, isPending, fetchNextPage, isFetchingNextPage } =
    useInfinitePostData(authorId);
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  if (error) return <Fallback />;
  if (isPending) return <Loader />;

  return (
    <div className="flex flex-col gap-10">
      {data.pages.map((page) =>
        page.map((postId) => (
          <PostItem key={postId} postId={postId} type={"FEED"} />
        )),
      )}
      {isFetchingNextPage && <Loader />}
      {/*무한스크롤 감지 (intersection observer)*/}
      <div ref={ref}></div>
    </div>
  );
}
