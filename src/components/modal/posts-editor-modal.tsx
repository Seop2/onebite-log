import { ImageIcon, Video, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { usePostEditorModal } from "@/store/post-editor-modal";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import useCreatePost from "@/hook/mutations/posts/use-create-posts";
import { toast } from "sonner";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import { useSession } from "@/store/session";
import { useOpenAlertModal } from "@/store/alert-modal";
import useUpdatePost from "@/hook/mutations/posts/use-update-posts";
import { Input } from "@/components/ui/input";

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

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  //const isMedia =

  //자동 높이 조절
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height =
        textAreaRef.current.scrollHeight + "px";
    }
  }, [content]);

  useEffect(() => {
    if (!postEditorModal.isOpen) {
      mediaFiles.forEach((m) => URL.revokeObjectURL(m.previewUrl));
      return;
    }
    //포스트 추가시 모달
    if (postEditorModal.type === "CREATE") {
      setContent("");
      setMediaFiles([]);
    } //수정시
    else {
      setContent(postEditorModal.content);
      setMediaFiles([]);
    }
    textAreaRef.current?.focus();
  }, [postEditorModal.isOpen]);

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
    //입력값 검증
    if (content.trim() === "" || !postEditorModal.isOpen) return;

    if (postEditorModal.type === "CREATE") {
      createPost({
        content,
        files: mediaFiles?.map((m) => m.file),
        userId: session!.user.id,
      });
    } else if (postEditorModal.type === "EDIT") {
      if (content === postEditorModal.content) return;
      updatePost({
        id: postEditorModal.postId,
        content: content,
        img_urls: postEditorModal.imageUrls,
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

  const handleDeleteMedia = (media: MediaFile) => {
    setMediaFiles((prevMedia) =>
      prevMedia.filter((item) => item.previewUrl !== media.previewUrl),
    );

    URL.revokeObjectURL(media.previewUrl);
  };

  const isPending = isCreatePostPending || isUpdatePostPending;

  return (
    <Dialog open={postEditorModal.isOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="max-h-[90vh]">
        <DialogTitle>포스트 작성</DialogTitle>
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

        {postEditorModal.isOpen && postEditorModal.type === "EDIT" && (
          <Carousel>
            <CarouselContent>
              {postEditorModal.imageUrls?.map((url) => (
                <CarouselItem className="basis-2/5" key={url}>
                  <div className="relative">
                    <img
                      src={url}
                      className="h-full w-full rounded-sm object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}

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

        {postEditorModal.isOpen && postEditorModal.type === "CREATE" && (
          <>
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
          </>
        )}

        <Button
          className="cursor-pointer"
          onClick={handleSavePostClick}
          disabled={isPending}
        >
          저장
        </Button>
      </DialogContent>
    </Dialog>
  );
}
