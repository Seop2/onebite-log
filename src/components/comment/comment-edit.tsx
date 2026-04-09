import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useEffect, useState } from "react";
import { useCreateComment } from "@/hooks/mutations/comment/use-create-comment";
import { toast } from "sonner";
import { useUpdateComment } from "@/hooks/mutations/comment/use-update-comment";

type CreateMode = {
  type: "CREATE";
  postId: number;
};

type EditMode = {
  type: "EDIT";
  commentId: number;
  initialContent: string;
  onClose: () => void;
};

type ReplyMode = {
  type: "REPLY";
  postId: number;
  parentCommentId: number;
  rootCommentId: number;
  onClose: () => void;
};

type Props = CreateMode | EditMode | ReplyMode; //댓글 추가 | 댓글 수정 | 대댓글

/**
 * 댓글 작성 컴포넌트
 * @param props
 * @returns
 */
export default function CommentEditor(props: Props) {
  const [content, setContent] = useState("");

  const { mutate: createComment, isPending: isCreateCommentPending } =
    useCreateComment({
      onSuccess: () => {
        setContent("");
        if (props.type === "REPLY") props.onClose();
      },
      onError: (error) => {
        toast.error("댓글 추가에 실패했습니다.", {
          position: "top-center",
        });
      },
    });

  const { mutate: updateComment, isPending: isUpdateCommentPending } =
    useUpdateComment({
      onSuccess: () => {
        (props as EditMode).onClose(); //타입 단언
      },
      onError: (error) => {
        toast.error("댓글 수정 실패했습니다.", {
          position: "top-center",
        });
      },
    });

  useEffect(() => {
    if (props.type === "EDIT") {
      setContent(props.initialContent);
    }
  }, []);

  const handleSubmitClick = () => {
    if (content.trim() === "") return;

    if (props.type === "CREATE") {
      //서버에 요청
      createComment({
        postId: props.postId,
        content,
      });
    } else if (props.type === "REPLY") {
      createComment({
        postId: props.postId,
        content,
        parentCommentId: props.parentCommentId,
        rootCommentId: props.rootCommentId,
      });
    } else {
      updateComment({
        id: props.commentId,
        content,
      });
    }
  };

  const isPending = isCreateCommentPending || isUpdateCommentPending;

  return (
    <div className="flex flex-col gap-2">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isPending}
      />
      <div className="flex justify-end gap-2">
        {props.type === "EDIT" ||
          (props.type === "REPLY" && (
            <Button variant={"outline"} onClick={() => props.onClose()}>
              취소
            </Button>
          ))}
        <Button disabled={isPending} onClick={handleSubmitClick}>
          작성
        </Button>
      </div>
    </div>
  );
}
