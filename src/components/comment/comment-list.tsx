import CommentItem from "@/components/comment/comment-item";
import { useCommentData } from "@/hook/queries/use-comment-data";
import Fallback from "../fallback";
import Loader from "../loader";
import type { Comment, NestedComment } from "@/types";

function toNestedComments(comments: Comment[]): NestedComment[] {
  if (!comments || !Array.isArray(comments)) return [];
  const result: NestedComment[] = [];
  comments.forEach((comment) => {
    if (!comment.root_comment_id) {
      result.push({ ...comment, children: [] });
    } else {
      const rootCommentIndex = result.findIndex(
        (item) => item.id === comment.root_comment_id,
      );

      const parentComment = comments.find(
        (item) => item.id === comment.parent_comment_id,
      );

      if (rootCommentIndex === -1) return;
      if (!parentComment) return;

      result[rootCommentIndex].children.push({
        ...comment,
        children: [],
        parentComment,
      });
    }
  });

  return result;
}
export default function CommentList(props: { postId: number }) {
  const {
    data: comments,
    error: fetchCommentsError,
    isPending: isFetchCommentsPending,
  } = useCommentData(props.postId); //해당 포스트의 모든 댓글 불러오기

  if (fetchCommentsError) return <Fallback />;
  if (isFetchCommentsPending) return <Loader />;

  const nestedComments = toNestedComments(comments);

  return (
    <div className="flex flex-col gap-5">
      {nestedComments.map((comment) => (
        <CommentItem key={comment.id} {...comment} />
      ))}
    </div>
  );
}
