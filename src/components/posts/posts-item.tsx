import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import { MessageCircle } from "lucide-react";
import defaultAvatar from "@/assets/default-avatar.png";
import { formatTimeAgo } from "@/lib/time";
import DeletePostButton from "./delete-posts-button";
import EditPostButton from "./edit-posts-button";
import { useSession } from "@/store/session";
import { usePostByIdData } from "@/hook/queries/use-posts-byId";
import Loader from "../loader";
import Fallback from "../fallback";
import LikePostButton from "./like-posts-button";
import { Link } from "react-router";
import { useCommentCountData } from "@/hook/queries/use-comment-count-data";

//댓글 수 세기...

export default function PostItem({
  postId,
  type,
}: {
  postId: number;
  type: "FEED" | "DETAIL";
}) {
  const session = useSession();
  const userId = session?.user.id;
  //캐시 데이터 정규화
  const { data: post, isPending, error } = usePostByIdData({ postId, type });
  const {
    data: commentCount,
    isPending: isCommentCountPending,
    error: commentError,
  } = useCommentCountData(postId);

  if (isPending) return <Loader />;
  if (error) return <Fallback />;

  const isMine = post.author_id === userId;

  const isVideo = (url: string) => {
    const videoExtension = [".mp4", ".webm", ".mov", "webp"];
    return videoExtension.some((ext) => url.toLowerCase().endsWith(ext));
  };

  return (
    <div
      className={`flex flex-col gap-4 pb-8 ${type === "FEED" && "border-b"}`}
    >
      <div className="flex justify-between">
        <div className="item-start flex gap-4">
          <Link to={`/profile/${post.author_id}`}>
            <img
              src={post.author.avatar || defaultAvatar}
              alt={`${post.author.nickname}의 프로필 이미지`}
              className="h-10 w-10 rounded-full object-cover"
            />
          </Link>
          <div>
            <div className="hover font-bold:under-line">
              {post.author.nickname}
            </div>
            <div className="text-muted-foreground text-sm">
              {formatTimeAgo(post.created_at)}
            </div>
          </div>
        </div>
        <div className="text-muted-foreground flex text-sm">
          {isMine && (
            <>
              <EditPostButton {...post} />
              <DeletePostButton id={post.id} />
            </>
          )}
        </div>
      </div>
      <div className="flex cursor-pointer flex-col gap-5">
        {type === "FEED" ? (
          <Link to={`/post/${post.id}`}>
            <div className="line-clamp-2 whitespace-pre-wrap">
              {post.content}
            </div>
          </Link>
        ) : (
          <div className="whitespace-pre-wrap">{post.content}</div>
        )}
        {post.media_urls && post.media_urls.length > 0 && (
          <Carousel>
            <CarouselContent>
              {post.media_urls.map((url, index) => (
                <CarouselItem key={index} className="basis-3/5">
                  <div className="bg-muted flex aspect-video items-center justify-center overflow-hidden rounded-xl">
                    {isVideo(url) ? (
                      <video
                        src={url}
                        controls={type === "DETAIL"} // 상세 페이지에서만 컨트롤러 표시
                        autoPlay={type === "FEED"} // 피드에서는 자동 재생(선택 사항)
                        muted
                        loop
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <img
                        src={url}
                        alt="Post media"
                        className="h-full max-h-[350px] w-full object-cover"
                      />
                    )}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}
      </div>
      <div className="flex gap-2">
        <LikePostButton
          id={post.id}
          likeCount={post.like_count}
          isLiked={post.isLiked}
        />
        {type === "FEED" && (
          <Link to={`/post/${post.id}`}>
            <div className="hover:bg-muted flex cursor-pointer items-center gap-2 rounded-xl border-1 p-2 px-4 text-sm">
              <MessageCircle className="h-4 w-4" />
              <span>{commentCount}</span>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
