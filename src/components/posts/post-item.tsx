import { MessageCircle } from "lucide-react";
import defaultAvatar from "@/assets/default-avatar.png";
import { formatTimeAgo } from "@/lib/time";
import DeletePostButton from "./delete-post-button";
import EditPostButton from "./edit-post-button";
import { useSession } from "@/store/session";
import { usePostByIdData } from "@/hooks/queries/use-posts-byId";
import Loader from "../loader";
import Fallback from "../fallback";
import LikePostButton from "./like-post-button";
import { Link } from "react-router";
import { useCommentCountData } from "@/hooks/queries/use-comment-count-data";
import { useChannelLive } from "@/hooks/queries/use-posts-channel-live";
import PostMediaCarousel from "./post-media-carousel";
import PostChannelTag from "./post-channel-tag";

interface PostItemProps {
  postId: number;
  type: "FEED" | "DETAIL";
}

export default function PostItem({ postId, type }: PostItemProps) {
  const session = useSession();
  const userId = session?.user.id;

  //데이터 패칭
  const { data: post, isPending, error } = usePostByIdData({ postId, type });
  const { data: commentCount } = useCommentCountData(postId);
  const { data: channelLive } = useChannelLive(
    post?.channel_id ? String(post.channel_id) : "",
  );

  if (isPending) return <Loader />;
  if (error || !post) return <Fallback />;

  const liveInfo = channelLive?.content ?? channelLive;
  const isLive = liveInfo?.status?.toUpperCase() === "OPEN";
  const isMine = post.author_id === userId;
  const viewerCount = liveInfo?.concurrentUserCount?.toLocaleString() ?? "0";

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
            <div className="font-bold">{post.author.nickname}</div>
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

        {post.channel_id && post.channel_name && (
          <PostChannelTag
            channelId={post.channel_id}
            channelName={post.channel_name}
            isLive={isLive}
            viewerCount={viewerCount}
          />
        )}
        {post.media_urls && post.media_urls.length > 0 && (
          <PostMediaCarousel mediaUrls={post.media_urls} type={type} />
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
