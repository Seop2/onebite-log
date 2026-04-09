import { useOpenEditPostModal } from "@/store/post-editor-modal";
import { Button } from "../ui/button";
import type { PostEntity } from "@/types";

/**
 *  수정 버튼 컴포넌트
 * @param props
 * @returns
 */
export default function EditPostButton(props: PostEntity) {
  const openEditPostModal = useOpenEditPostModal();
  const handleButtonClick = () => {
    openEditPostModal({
      postId: props.id,
      content: props.content,
      mediaUrls: props.media_urls,
    });
  };
  return (
    <>
      <Button
        className="cursor-pointer"
        variant={"ghost"}
        onClick={handleButtonClick}
      >
        수정
      </Button>
    </>
  );
}
