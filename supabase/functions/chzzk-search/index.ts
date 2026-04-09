/**
 * Supabase Edge Function: chzzk-search
 *
 * 치지직 채널 검색 + 라이브 여부를 서버 사이드에서 한 번에 조회합니다.
 * 브라우저 → supabase.functions.invoke → Edge Function → 치지직 API
 *
 * 배포: supabase functions deploy chzzk-search --no-verify-jwt
 * 로컬: supabase functions serve
 */
import { corsHeaders } from "../cors.ts";

type ChzzkChannel = {
  channelId: string;
  channelName: string;
  channelImageUrl: string | null;
  verifiedMark: boolean;
  isLive: boolean;
  liveThumbnailUrl: string | null;
  liveTitle: string | null;
  concurrentUserCount: number;
};

const BASE_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  "Accept": "application/json",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { keyword, size = 7 } = await req.json();

    if (!keyword || String(keyword).trim() === "") {
      return new Response(JSON.stringify({ data: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 1. 채널 검색
    const searchRes = await fetch(
      `https://api.chzzk.naver.com/service/v1/search/channels?keyword=${
        encodeURIComponent(String(keyword).trim())
      }&size=${size}`,
      { headers: BASE_HEADERS },
    );
    if (!searchRes.ok) {
      throw new Error(`치지직 검색 오류: ${searchRes.status}`);
    }
    const searchJson = await searchRes.json();

    const rawChannels: {
      channel: {
        channelId: string;
        channelName: string;
        channelImageUrl: string | null;
        verifiedMark: boolean;
      };
    }[] = searchJson?.content?.data ?? [];

    if (rawChannels.length === 0) {
      return new Response(JSON.stringify({ data: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. 각 채널의 라이브 상태를 병렬로 조회
    const channels: ChzzkChannel[] = await Promise.all(
      rawChannels.map(async ({ channel }) => {
        try {
          const liveRes = await fetch(
            `https://api.chzzk.naver.com/polling/v2/channels/${channel.channelId}/live-status`,
            { headers: BASE_HEADERS },
          );
          if (!liveRes.ok) throw new Error("live-status 오류");
          const liveJson = await liveRes.json();
          const liveContent = liveJson?.content;

          const isLive = liveContent?.status === "OPEN";
          return {
            channelId: channel.channelId,
            channelName: channel.channelName,
            channelImageUrl: channel.channelImageUrl,
            verifiedMark: channel.verifiedMark,
            isLive,
            liveThumbnailUrl: isLive
              ? (liveContent.liveImageUrl?.replace("{type}", "1080") ?? null)
              : null,
            liveTitle: isLive ? (liveContent?.liveTitle ?? null) : null,
            concurrentUserCount: isLive
              ? (liveContent?.concurrentUserCount ?? 0)
              : 0,
          };
        } catch {
          // 라이브 조회 실패 시 오프라인으로 처리
          return {
            channelId: channel.channelId,
            channelName: channel.channelName,
            channelImageUrl: channel.channelImageUrl,
            verifiedMark: channel.verifiedMark,
            isLive: false,
            liveThumbnailUrl: null,
            liveTitle: null,
            concurrentUserCount: 0,
          };
        }
      }),
    );

    // 라이브 중인 채널을 상단으로 정렬
    channels.sort((a, b) => {
      // 1순위: 라이브 중인 채널을 위로
      if (a.isLive !== b.isLive) return Number(b.isLive) - Number(a.isLive);

      // 2순위: 라이브 중이라면 시청자 수가 많은 순으로
      return b.concurrentUserCount - a.concurrentUserCount;
    });

    return new Response(JSON.stringify({ data: channels }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "알 수 없는 오류";
    return new Response(JSON.stringify({ error: message, data: [] }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
