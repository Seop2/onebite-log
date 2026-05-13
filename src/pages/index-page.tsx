import { useState } from "react";
import { ExternalLink, X } from "lucide-react";
import CreatePostButton from "@/components/posts/create-post-button";
import PostFeed from "../components/posts/post-feed";
import StreamerFilter from "@/components/posts/streamer-filter";
import LiveStreamersSidebar from "@/components/live-streamers-sidebar";
import LiveTopBar from "@/components/live-top-bar";
import { useTopLiveStreamers } from "@/hooks/queries/use-top-live-streamers";
import defaultAvatar from "@/assets/default-avatar.png";

interface SelectedChannel {
  channelId: string;
  channelName: string;
  channelImageUrl: string | null;
}

function ChannelBanner({
  channel,
  onClear,
}: {
  channel: SelectedChannel;
  onClear: () => void;
}) {
  const { data: streamers } = useTopLiveStreamers();
  const live = streamers?.find((s) => s.channelId === channel.channelId);

  return (
    <div className="relative overflow-hidden rounded-xl border bg-card">
      {live?.liveThumbnailUrl && (
        <>
          <img
            src={live.liveThumbnailUrl}
            className="absolute inset-0 h-full w-full object-cover opacity-10"
            alt=""
          />
          <div className="absolute inset-0 bg-gradient-to-r from-card via-card/80 to-transparent" />
        </>
      )}
      <div className="relative flex items-center gap-4 px-4 py-3">
        <img
          src={channel.channelImageUrl ?? defaultAvatar}
          className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-[#00ffa3]/40"
          alt={channel.channelName}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold">{channel.channelName}</span>
            {live && (
              <span className="rounded bg-red-500 px-1.5 py-0.5 text-[10px] font-extrabold text-white">
                LIVE
              </span>
            )}
          </div>
          {live?.liveTitle && (
            <p className="text-muted-foreground truncate text-xs">
              {live.liveTitle}
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {live && (
            <div className="text-right">
              <div className="text-sm font-bold tabular-nums">
                {live.concurrentUserCount.toLocaleString()}명
              </div>
              <div className="text-muted-foreground text-[10px]">시청 중</div>
            </div>
          )}
          {live && (
            <a
              href={`https://chzzk.naver.com/live/${channel.channelId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-lg border border-[#00ffa3]/20 bg-[#00ffa3]/10 px-3 py-1.5 text-xs font-bold text-[#00ffa3] transition-colors hover:bg-[#00ffa3]/20"
            >
              방송 보기
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
          <button
            onClick={onClear}
            aria-label="선택 해제"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function IndexPage() {
  const [sortBy, setSortBy] = useState<"created_at" | "like_count">(
    "created_at",
  );
  const [selectedChannel, setSelectedChannel] =
    useState<SelectedChannel | null>(null);
  const [filterKey, setFilterKey] = useState(0);

  function handleSelectChannel(
    channelId: string,
    channelName: string,
    channelImageUrl: string | null,
  ) {
    setSelectedChannel({ channelId, channelName, channelImageUrl });
    setFilterKey((k) => k + 1);
  }

  function handleClearChannel() {
    setSelectedChannel(null);
    setFilterKey((k) => k + 1);
  }

  return (
    <div className="flex flex-col gap-4">
      {/* 상단 라이브 스트리머 바 */}
      <LiveTopBar
        selectedChannelId={selectedChannel?.channelId}
        onSelect={handleSelectChannel}
      />

      <div className="flex gap-8">
        {/* 메인 피드 */}
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          {/* 선택된 채널 배너 */}
          {selectedChannel && (
            <ChannelBanner channel={selectedChannel} onClear={handleClearChannel} />
          )}

          {/* 글 작성 */}
          <CreatePostButton />

          {/* 필터 & 정렬 */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <StreamerFilter
              key={filterKey}
              onSelect={(channel) => {
                if (channel) {
                  handleSelectChannel(
                    channel.channelId,
                    channel.channelName,
                    channel.channelImageUrl,
                  );
                } else {
                  handleClearChannel();
                }
              }}
            />
            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => setSortBy("created_at")}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  sortBy === "created_at"
                    ? "bg-primary text-primary-foreground"
                    : "border border-input bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                최신순
              </button>
              <button
                onClick={() => setSortBy("like_count")}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  sortBy === "like_count"
                    ? "bg-primary text-primary-foreground"
                    : "border border-input bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                ❤ 좋아요순
              </button>
            </div>
          </div>

          <PostFeed sortBy={sortBy} channelId={selectedChannel?.channelId} />
        </div>

        {/* 우측 사이드바 */}
        <div className="hidden lg:block">
          <LiveStreamersSidebar onSelectChannel={handleSelectChannel} />
        </div>
      </div>
    </div>
  );
}
