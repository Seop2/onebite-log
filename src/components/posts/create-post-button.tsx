import { PlusCircleIcon } from "lucide-react";
import { useOpenCreatePostModal } from "@/store/post-editor-modal";
import { useSession } from "@/store/session";
import defaultAvatar from "@/assets/default-avatar.png";

export default function CreatePostButton() {
  const openCreatePostModal = useOpenCreatePostModal();
  const session = useSession();
  const avatar = session?.user.user_metadata?.avatar_url ?? defaultAvatar;

  return (
    <button
      type="button"
      onClick={openCreatePostModal}
      className="group flex w-full cursor-pointer items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-colors hover:border-[#00ffa3]/30 hover:bg-[#00ffa3]/5"
    >
      <img
        src={avatar}
        alt="내 프로필"
        className="h-9 w-9 shrink-0 rounded-full object-cover"
      />
      <span className="text-muted-foreground flex-1 text-left text-sm">
        지금 방송 이야기를 나눠보세요
      </span>
      <PlusCircleIcon className="text-muted-foreground h-5 w-5 shrink-0 transition-colors group-hover:text-[#00ffa3]" />
    </button>
  );
}
