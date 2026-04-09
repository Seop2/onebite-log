import CreatePostButton from "@/components/posts/create-post-button";
import PostFeed from "../components/posts/post-feed";

/**
 * 기본 페이지
 * @returns
 */
export default function IndexPage() {
  return (
    <div className="flex flex-col gap-10">
      <CreatePostButton />
      <PostFeed />
    </div>
  );
}
