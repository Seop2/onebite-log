import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useProfileData } from "@/hook/queries/use-profile-data";
import { useSession } from "@/store/session";
import defaultAvatar from "@/assets/default-avatar.png";
import { PopoverClose } from "@radix-ui/react-popover";
import { Link } from "react-router";
import { signOut } from "@/api/auth";

export default function ProfileButton() {
  //로그인 유무 확인
  const session = useSession();
  const { data: profile } = useProfileData(session?.user.id); //프로필 정보
  if (!session) return null;
  return (
    <Popover>
      <PopoverTrigger>
        <img
          src={profile?.avatar || defaultAvatar}
          className="h-6 w-6 cursor-pointer rounded-full object-cover"
        />
      </PopoverTrigger>
      <PopoverContent className="flex w-40 flex-col p-0">
        <PopoverClose asChild>
          <Link to={`/profile/${session.user.id}`}>
            <div className="hover:bg-muted cursor-pointer px-4 py-3 text-sm">
              프로필
            </div>
          </Link>
        </PopoverClose>
        <PopoverClose asChild>
          <div
            className="hover:bg-muted cursor-pointer px-4 py-3 text-sm"
            onClick={signOut}
          >
            로그아웃
          </div>
        </PopoverClose>
      </PopoverContent>
    </Popover>
  );
}
