import { useProfileData } from "@/hook/queries/use-profile-data";
import { useSession } from "@/store/session";
import Fallback from "../fallback";
import Loader from "../loader";
import defaultAvatar from "@/assets/default-avatar.png";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useProfileEditorModal } from "@/store/profile-edit-modal";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useUpdateProfile } from "@/hook/mutations/profile/use-update-profile";
import { toast } from "sonner";

type Image = { file: File; previewUrl: string };

/**
 * 프로필 수정 모달창 컴포넌트
 * @returns
 */
export default function ProfileEditorModal() {
  const session = useSession();
  const {
    data: profile,
    error: fetchProfileError,
    isPending: isFetchProfilePending,
  } = useProfileData(session?.user.id);

  const store = useProfileEditorModal();
  const {
    isOpen,
    actions: { close },
  } = store;

  const { mutate: updateProfile, isPending: isUpdateProfilePending } =
    useUpdateProfile({
      onSuccess: () => {
        close();
      },
      onError: (error) => {
        toast.error("프로필 수정 실패", {
          position: "top-center",
        });
      },
    });

  const [avatarImage, setAvatarImage] = useState<Image | null>(null); //아바타 수정을 위한 상태값 저장
  const [nickName, setNickName] = useState(""); // 닉네임 저장
  const [bio, setBio] = useState(""); //소개문구 저장

  const fileInputRef = useRef<HTMLInputElement>(null);

  //메모리 관리위해 모달삭제시 브라우저에 남겨진 이미지 삭제
  useEffect(() => {
    if (!isOpen) {
      if (avatarImage) URL.revokeObjectURL(avatarImage.previewUrl);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && profile) {
      setNickName(profile.nickname);
      setBio(profile.bio);
      setAvatarImage(null);
    }
  }, [profile, isOpen]);

  //프로필 수정 이벤트 핸들러
  const handleUpdateClick = () => {
    if (nickName.trim() === "") return;
    updateProfile({
      userId: session!.user.id,
      nickname: nickName,
      bio: bio,
      avatarImageFile: avatarImage?.file,
    });
  };

  const handleSelectImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];

    if (avatarImage) {
      URL.revokeObjectURL(avatarImage.previewUrl); //브라우저 메모리 관리
    }
    setAvatarImage({ file, previewUrl: URL.createObjectURL(file) });
  };

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="flex flex-col gap-5">
        <DialogTitle>프로필 수정하기</DialogTitle>
        {fetchProfileError && <Fallback />}
        {isFetchProfilePending && <Loader />}
        {!fetchProfileError && !isFetchProfilePending && (
          <>
            <div className="flex flex-col gap-2">
              <div className="text-muted-foreground">프로필 이미지</div>
              <input
                disabled={isUpdateProfilePending}
                onChange={handleSelectImage}
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
              />
              <img
                onClick={() => {
                  if (fileInputRef.current) fileInputRef.current.click();
                }}
                src={avatarImage?.previewUrl || profile.avatar || defaultAvatar}
                className="h-20 w-20 cursor-pointer rounded-full object-cover"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-muted-foreground">닉네임</div>
              <Input
                value={nickName}
                disabled={isUpdateProfilePending}
                onChange={(e) => setNickName(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-muted-foreground">소개</div>
              <Input
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                disabled={isUpdateProfilePending}
              />
            </div>

            <Button
              className="cursor-pointer"
              onClick={handleUpdateClick}
              disabled={isUpdateProfilePending}
            >
              수정하기
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
