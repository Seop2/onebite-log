import { useOpenProfileEditorModal } from "@/store/profile-edit-modal";
import { Button } from "../ui/button";
/**
 * 프로필 수정 버튼 컴포넌트
 * @returns
 */
export default function EditProfileButton() {
  const openProfileEditorModal = useOpenProfileEditorModal(); //수정 모달창 불러오기

  return (
    <Button
      variant={"secondary"}
      className="cursor-pointer"
      onClick={openProfileEditorModal}
    >
      프로필 수정
    </Button>
  );
}
