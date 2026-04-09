import CommentEditor from "@/components/comment/comment-edit";
import CommentList from "@/components/comment/comment-list";
import PostItem from "@/components/posts/post-item";
import { Navigate, useParams } from "react-router";

/**
 * 포스트 상세 페이지
 * @returns
 */
export default function PostDetailPage() {
  const params = useParams();
  const postId = params.postId; //url파라미터는 기본적으로 문자열로 추출됨.

  if (!postId) return <Navigate to={"/"} />;

  return (
    <div className="flex flex-col gap-5">
      <PostItem postId={Number(postId)} type={"DETAIL"} />
      <div className="text-xl font-bold">댓글</div>
      <CommentEditor postId={Number(postId)} type={"CREATE"} />
      <CommentList postId={Number(postId)} />
    </div>
  );
}
