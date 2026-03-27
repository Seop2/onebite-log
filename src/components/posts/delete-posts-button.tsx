import { useOpenAlertModal } from "@/store/alert-modal";
import { Button } from "../ui/button";
import useDeletePost from "@/hook/mutations/posts/use-delete-posts";
import { toast } from "sonner";
import { useNavigate } from "react-router";

/**
 * 포스트 삭제 컴포넌트
 * @returns
 */
export default function DeletePostButton({ id }: { id: number }) {
  const openAlertModal = useOpenAlertModal();
  const navigate = useNavigate();
  const { mutate: deletePost, isPending: isDeletePostPending } = useDeletePost({
    onSuccess: () => {
      const pathname = window.location.pathname;
      //포스트 상세페이지
      if (pathname.startsWith(`/post/${id}`)) {
        navigate("/", { replace: true });
      }
    },
    onError: (error) => {
      toast.error("포스트 삭제에 실패하였습니다!", {
        position: "top-center",
      });
    },
  });
  const handleDeleteClick = () => {
    //alert 구현
    openAlertModal({
      title: "포스트 삭제",
      description:
        "삭제된 포스트는 복구가 불가능합니다. 정말 삭제하시겠습니까?",
      onPostitive: () => {
        //포스트 삭제 요청
        deletePost(id);
      },
    });
  };
  return (
    <Button
      disabled={isDeletePostPending}
      className="cursor-pointer"
      variant={"ghost"}
      onClick={handleDeleteClick}
    >
      삭제
    </Button>
  );
}
