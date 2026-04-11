import { ImageIcon, Radio, Search, Video, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { usePostEditorModal } from "@/store/post-editor-modal";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import useCreatePost from "@/hooks/mutations/posts/use-create-posts";
import { toast } from "sonner";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import { useSession } from "@/store/session";
import { useOpenAlertModal } from "@/store/alert-modal";
import useUpdatePost from "@/hooks/mutations/posts/use-update-posts";
import { Input } from "@/components/ui/input";
import { useChzzkSearch } from "@/hooks/queries/use-posts-channels-data";
import type { ChzzkChannel } from "@/api/chzzk";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";

type MediaFile = {
  file: File;
  previewUrl: string;
  type: "IMAGE" | "VIDEO";
};
/**
 * 포스트 생성 모달창 컴포넌트
 * @returns
 */
export default function PostEditorModal() {
  const session = useSession();
  const openAlertModal = useOpenAlertModal();
  const postEditorModal = usePostEditorModal();
  const [content, setContent] = useState("");
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [selectedChannel, setSelectedChannel] = useState<ChzzkChannel | null>(
    null,
  );

  //포스트 생성 함수 호출
  const { mutate: createPost, isPending: isCreatePostPending } = useCreatePost({
    onSuccess: () => {
      postEditorModal.actions.close();
    },
    onError: (error) => {
      toast.error("포스트 생성에 실패했습니다.", {
        position: "top-center",
      });
    },
  });

  //포스트 수정 함수 호출
  const { mutate: updatePost, isPending: isUpdatePostPending } = useUpdatePost({
    onSuccess: () => {
      postEditorModal.actions.close();
    },
    onError: (error) => {
      toast.error("포스트 수정에 실패했습니다.", {
        position: "top-center",
      });
    },
  });

  const {
    data: channels,
    isPending: postChannelIsPending,
    isError,
  } = useChzzkSearch(keyword);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isOpen = postEditorModal.isOpen;
  const modalType = isOpen ? postEditorModal.type : null;
  const isEditMode = modalType === "EDIT";
  const isCreateMode = modalType === "CREATE";

  //자동 높이 조절
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height =
        textAreaRef.current.scrollHeight + "px";
    }
  }, [content]);

  useEffect(() => {
    if (!isOpen) {
      mediaFiles.forEach((m) => URL.revokeObjectURL(m.previewUrl));
      setSelectedChannel(null); // 모달 닫힐 때 선택 채널 초기화
      setKeyword("");
      setShowSearch(false);
      return;
    }
    //포스트 추가시 모달
    if (isCreateMode) {
      setContent("");
      setMediaFiles([]);
    }
    //텍스트 수정만 가능
    else if (postEditorModal.type === "EDIT") {
      setContent(postEditorModal.content);
    } else {
      setContent("");
      setMediaFiles([]);
    }
  }, [isOpen]);

  /**
   * 모달 작성중 삭제 이벤트
   * @returns
   */
  const handleCloseModal = () => {
    //작성중 이탈 방지 기능 추가
    if (content !== "" || mediaFiles?.length !== 0) {
      //추가 경고 모달 생성
      openAlertModal({
        title: "게시글 작성이 마무리 되지 않았습니다.",
        description: "이 화면에서 나갈 시 작성한 내용이 사라집니다.",
        onPostitive: () => {
          postEditorModal.actions.close();
        },
      });

      return;
    }
    postEditorModal.actions.close();
  };

  /**
   * 포스트 수정 및 저장
   * @returns
   */
  const handleSavePostClick = () => {
    if (content.trim() === "" || !isOpen) return;
    if (!session?.user?.id) {
      toast.error("로그인이 필요합니다.");
      return;
    }

    if (isCreateMode) {
      createPost({
        content,
        files: mediaFiles?.map((m) => m.file),
        userId: session.user.id,
        channelId: selectedChannel?.channelId,
        channelName: selectedChannel?.channelName,
      });
    } else if (postEditorModal.type === "EDIT") {
      //수정함수 호출
      updatePost({
        id: postEditorModal.postId,
        content: content,
      });
    }
  };

  const handleSelectMedia = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newMedia: MediaFile[] = files.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
        type: file.type.startsWith("video/") ? "VIDEO" : "IMAGE",
      }));
      setMediaFiles((prev) => [...prev, ...newMedia]);
    }
    e.target.value = ""; //동일 파일 재선택 가능
  };

  //삭제
  const handleDeleteMedia = (media: MediaFile) => {
    setMediaFiles((prevMedia) =>
      prevMedia.filter((item) => item.previewUrl !== media.previewUrl),
    );
    URL.revokeObjectURL(media.previewUrl);
  };

  const isPending = isCreatePostPending || isUpdatePostPending;

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseModal}>
      <DialogContent
        className="max-h-[90vh]"
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          const textarea = textAreaRef.current;
          if (!textarea) return;
          textarea.focus();

          if (isEditMode) {
            const end = textarea.value.length;
            textarea.setSelectionRange(end, end);
          }
        }}
      >
        <DialogTitle>포스트 {isCreateMode ? "작성" : "수정"}</DialogTitle>
        <div className="flex justify-between">
          {isEditMode && (
            <div className="text-muted-foreground">
              수정은 텍스트만 수정 가능합니다.
            </div>
          )}
          {selectedChannel && (
            <div className="animate-in fade-in slide-in-from-top-1 flex items-center">
              <Badge variant="secondary" className="gap-1.5 px-3 py-1.5">
                <span className="text-primary">@</span>
                {selectedChannel.channelName}
                <button type="button" onClick={() => setSelectedChannel(null)}>
                  <XIcon className="hover:text-destructive h-3 w-3 cursor-pointer" />
                </button>
              </Badge>
            </div>
          )}
          <Button
            className="h-4 w-6 cursor-pointer px-6 py-4"
            onClick={handleSavePostClick}
            disabled={isPending}
            variant={"destructive"}
          >
            저장
          </Button>
        </div>
        <Textarea
          disabled={isPending}
          ref={textAreaRef}
          className="max-h-125 min-h-25 focus:outline-none"
          placeholder="무슨 일이 있었나요?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Input
          onChange={handleSelectMedia}
          type="file"
          accept="image/*, video/*"
          multiple
          className="hidden"
          ref={fileInputRef}
        />

        {/* 새 게시물 작성 시 프리뷰 */}
        {mediaFiles.length > 0 && (
          <Carousel className="w-full">
            <CarouselContent>
              {mediaFiles.map((media) => (
                <CarouselItem
                  key={media.previewUrl}
                  className="basis-1/2 md:basis-1/3"
                >
                  <div className="bg-muted relative aspect-square overflow-hidden rounded-md border">
                    {media.type === "IMAGE" ? (
                      <img
                        src={media.previewUrl}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <video
                        src={media.previewUrl}
                        className="h-full w-full object-cover"
                      />
                    )}
                    <button
                      type="button"
                      className="absolute top-1 right-1 rounded-full bg-black/50 p-1 transition hover:bg-black/70"
                      onClick={() => handleDeleteMedia(media)}
                    >
                      <XIcon className="h-4 w-4 text-white" />
                    </button>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}

        {isOpen && isCreateMode && (
          <>
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowSearch(!showSearch)}
                className="cursor-pointer"
              >
                <Search className="h-4 w-4" />
                스트리머 태그
              </Button>
              <Button
                onClick={() => {
                  fileInputRef.current?.click();
                }}
                variant={"outline"}
                className="cursor-pointer"
                disabled={isPending}
              >
                <ImageIcon className="h-4 w-4" />
                <Video className="h-4 w-4" />
                첨부파일 추가
              </Button>
            </div>

            {showSearch && (
              <>
                <Input
                  placeholder="스트리머 검색"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
                {postChannelIsPending && <p>검색 중...</p>}
                {isError && <p>검색에 실패했습니다.</p>}
                {channels?.map((item) => (
                  <button
                    key={item.channelId}
                    type="button"
                    onClick={() => setSelectedChannel(item)}
                    className="hover:bg-card flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors"
                  >
                    <Avatar className="border-border h-8 w-8 border">
                      {item.channelImageUrl ? (
                        <img
                          src={item.channelImageUrl || "/placeholder.svg"}
                          alt={item.channelName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                          {item.channelName.slice(0, 2)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-foreground font-medium">
                          {item.channelName}
                        </span>
                        {item.isLive && (
                          <span className="flex items-center gap-1 rounded-full bg-red-500/20 px-2 py-0.5 text-xs text-red-500">
                            <Radio className="h-2.5 w-2.5 animate-pulse" />
                            LIVE
                          </span>
                        )}
                      </div>
                      <span className="text-muted-foreground text-xs">
                        시청자수{" "}
                        {(item.concurrentUserCount ?? 0).toLocaleString()}명
                      </span>
                    </div>
                  </button>
                ))}
              </>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
