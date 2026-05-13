/**
 * Supabase Edge Function: chzzk-search
 *
 * 치지직 채널 검색 + 라이브 여부 조회
 *
 * 배포: supabase functions deploy chzzk-search --no-verify-jwt
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

async function searchChannels(
  keyword: string,
  size: number,
): Promise<ChzzkChannel[]> {
  const searchRes = await fetch(
    `https://api.chzzk.naver.com/service/v1/search/channels?keyword=${
      encodeURIComponent(keyword.trim())
    }&size=${size}`,
    { headers: BASE_HEADERS },
  );
  if (!searchRes.ok) throw new Error(`치지직 검색 오류: ${searchRes.status}`);

  const searchJson = await searchRes.json();
  const rawChannels: {
    channel: {
      channelId: string;
      channelName: string;
      channelImageUrl: string | null;
      verifiedMark: boolean;
    };
  }[] = searchJson?.content?.data ?? [];

  if (rawChannels.length === 0) return [];

  return Promise.all(
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
  ).then((channels) =>
    channels.sort((a, b) => {
      if (a.isLive !== b.isLive) return Number(b.isLive) - Number(a.isLive);
      return b.concurrentUserCount - a.concurrentUserCount;
    })
  );
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const respond = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const body = await req.json();
    const { keyword, size = 7 } = body ?? {};

    if (!keyword || String(keyword).trim() === "") {
      return respond({ data: [] });
    }

    const data = await searchChannels(String(keyword), size);
    return respond({ data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "알 수 없는 오류";
    return respond({ error: message, data: [] }, 500);
  }
});
