import { Link } from "react-router";
import defaultAvatar from "@/assets/default-avatar.png";
import type { Comment, NestedComment } from "@/types";
import { formatTimeAgo } from "@/lib/time";
import { useSession } from "@/store/session";
import { useState } from "react";
import CommentEditor from "./comment-edit";
import { useDeleteComment } from "@/hooks/mutations/comment/use-delete-comment";
import { toast } from "sonner";
import { useOpenAlertModal } from "@/store/alert-modal";

/**
 * 댓글 컴포넌트
 */
//사용자 정보 포함된 댓글 타입 선언
export default function CommentItem(props: NestedComment) {
  const session = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [isReply, setIsReply] = useState(false);

  const openAlertModal = useOpenAlertModal();

  const { mutate: deleteComment, isPending: isDeleteCommentPending } =
    useDeleteComment({
      // onSuccess: () => {},
      onError: () => {
        toast.error("댓글 삭제에 실패했습니다.", {
          position: "top-center",
        });
      },
    });

  const toggleIsReply = () => {
    setIsReply(!isReply);
  };

  const toggleIsEditing = () => {
    setIsEditing(!isEditing);
  };

  const handleDeleteClick = () => {
    //알림 모달창
    openAlertModal({
      title: "댓글삭제",
      description: "삭제된 댓글은 되돌릴 수 없습니다. 정말 삭제하시겠습니끼?",
      onPostitive: () => {
        //확인시 삭제
        deleteComment(props.id);
      },
    });
  };

  const mine = session?.user.id === props.author_id;
  const isRootComment = props.parentComment === undefined;
  const isOverTwoLevels = props.parent_comment_id !== props.root_comment_id;

  return (
    <div
      className={`flex flex-col gap-8 pb-5 ${isRootComment ? "border-b" : "ml-6"}`}
    >
      <div className="flex items-start gap-4">
        <Link to={`/profile/${props.author_id}`}>
          <div className="flex h-full flex-col">
            <img
              className="h-10 w-10 rounded-full object-cover"
              src={props.author.avatar || defaultAvatar}
            />
          </div>
        </Link>
        <div className="flex w-full flex-col gap-2">
          <div className="font-bold">{props.author.nickname}</div>
          {isEditing ? (
            <CommentEditor
              type={"EDIT"}
              commentId={props.id}
              initialContent={props.content}
              onClose={toggleIsEditing}
            />
          ) : (
            <div>
              {isOverTwoLevels && (
                <span className="font-bold text-blue-500">
                  @{props.parentComment?.author.nickname}
                </span>
              )}
              <div>{props.content}</div>
            </div>
          )}

          <div className="text-muted-foreground flex justify-between text-sm">
            <div className="flex items-center gap-2">
              <div
                className="cursor-pointer hover:underline"
                onClick={toggleIsReply}
              >
                댓글
              </div>
              <div className="bg-border h-[13px] w-[2px]"></div>
              <div>{formatTimeAgo(props.created_at)}</div>
            </div>
            <div className="flex items-center gap-2">
              {mine && (
                <>
                  <div
                    className="cursor-pointer hover:underline"
                    onClick={toggleIsEditing}
                  >
                    수정
                  </div>
                  <div className="bg-border h-[13px] w-[2px]"></div>
                  <div
                    className="cursor-pointer hover:underline"
                    onClick={handleDeleteClick}
                  >
                    삭제
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {isReply && (
        <CommentEditor
          type={"REPLY"}
          postId={props.post_id}
          parentCommentId={props.id}
          rootCommentId={props.root_comment_id || props.id}
          onClose={toggleIsReply}
        />
      )}

      {props.children.map((comment) => (
        <CommentItem key={comment.id} {...comment} />
      ))}
    </div>
  );
}
