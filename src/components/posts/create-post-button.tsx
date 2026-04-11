import { PlusCircleIcon } from "lucide-react";
import { useOpenCreatePostModal } from "@/store/post-editor-modal";

/**
 * 포스트 작성 버튼 컴포넌트
 * @returns
 */
export default function CreatePostButton() {
  const openCreatePostModal = useOpenCreatePostModal();

  return (
    <>
      <button
        type="button"
        className="bg-muted text-muted-foreground cursor-pointer rounded-xl px-6 py-4"
        onClick={openCreatePostModal}
      >
        <div className="flex items-center justify-between">
          <div>나누고 싶은 이야기를 입력해주세요~</div>
          <PlusCircleIcon className="h-5 w-5" />
        </div>
      </button>
    </>
  );
}
