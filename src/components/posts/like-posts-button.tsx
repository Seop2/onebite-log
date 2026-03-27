import useTogglePostLike from "@/hook/mutations/posts/use-toggle-likes-posts";
import { useSession } from "@/store/session";
import { HeartIcon } from "lucide-react";
import { toast } from "sonner";

/**
 * 좋아요 버튼 컴포넌트
 */
export default function LikePostButton({
  id,
  likeCount,
  isLiked,
}: {
  id: number;
  likeCount: number;
  isLiked: boolean;
}) {
  const session = useSession();

  const { mutate: togglePostLike, isPending } = useTogglePostLike({
    onError: (error) => {
      toast.error("좋아요 요청에 실패했습니다.", { position: "top-center" });
    },
  });

  const handleLikeClick = () => {
    togglePostLike({
      postId: id,
      userId: session!.user.id,
    });
  };

  return (
    <div
      onClick={handleLikeClick}
      className="hover:bg-muted item-center flex cursor-pointer gap-2 rounded-xl border-1 p-2 px-4 text-sm"
    >
      <HeartIcon
        className={`h-4 w-4 ${isLiked && "fill-foreground border-foreground"}`}
      />
      <span>{likeCount}</span>
    </div>
  );
}
