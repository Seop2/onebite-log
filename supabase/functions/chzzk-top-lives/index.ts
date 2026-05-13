/**
 * Supabase Edge Function: chzzk-top-lives
 *
 * 치지직 공식 Open API (openapi.chzzk.naver.com/open/v1/lives) 기반
 * 시청자 수 기준 top N 라이브 채널 반환
 *
 * 환경변수:
 *   CHZZK_CLIENT_ID     치지직 Open API 클라이언트 ID
 *   CHZZK_CLIENT_SECRET 치지직 Open API 클라이언트 시크릿
 *
 * 배포: supabase functions deploy chzzk-top-lives --no-verify-jwt
 */
import { corsHeaders } from "../cors.ts";

// deno-lint-ignore no-explicit-any
type AnyRecord = Record<string, any>;

const SEARCH_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  "Accept": "application/json",
};

async function fetchViaOpenApi(clientId: string, clientSecret: string, size: number): Promise<AnyRecord[]> {
  const res = await fetch(`https://openapi.chzzk.naver.com/open/v1/lives?size=${size}`, {
    headers: {
      "Client-Id": clientId,
      "Client-Secret": clientSecret,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) return [];
  const json = await res.json();
  const list = json?.content?.data;
  if (!Array.isArray(list) || list.length === 0) return [];
  return list
    .filter((live: AnyRecord) => live.channelId)
    .map((live: AnyRecord) => ({
      channelId: live.channelId ?? "",
      channelName: live.channelName ?? "",
      channelImageUrl: live.channelImageUrl ?? null,
      concurrentUserCount: live.concurrentUserCount ?? 0,
      liveTitle: live.liveTitle ?? null,
      liveThumbnailUrl: live.liveThumbnailImageUrl ?? null,
    }));
}

async function fetchByKeyword(keyword: string, size: number): Promise<AnyRecord[]> {
  const searchRes = await fetch(
    `https://api.chzzk.naver.com/service/v1/search/channels?keyword=${encodeURIComponent(keyword)}&size=${size}`,
    { headers: SEARCH_HEADERS },
  );
  if (!searchRes.ok) return [];

  const searchJson = await searchRes.json();
  const rawChannels: AnyRecord[] = searchJson?.content?.data ?? [];
  if (rawChannels.length === 0) return [];

  const liveChannels: AnyRecord[] = [];
  await Promise.all(
    rawChannels.map(async (item: AnyRecord) => {
      const channel = item.channel;
      if (!channel?.channelId) return;
      try {
        const liveRes = await fetch(
          `https://api.chzzk.naver.com/polling/v2/channels/${channel.channelId}/live-status`,
          { headers: SEARCH_HEADERS },
        );
        if (!liveRes.ok) return;
        const liveJson = await liveRes.json();
        const content = liveJson?.content;
        if (content?.status !== "OPEN") return;
        liveChannels.push({
          channelId: channel.channelId,
          channelName: channel.channelName ?? "",
          channelImageUrl: channel.channelImageUrl ?? null,
          concurrentUserCount: content.concurrentUserCount ?? 0,
          liveTitle: content.liveTitle ?? null,
          liveThumbnailUrl: content.liveImageUrl?.replace("{type}", "1080") ?? null,
        });
      } catch (_) { /* ignore */ }
    }),
  );
  return liveChannels;
}

async function fetchFallback(topN: number): Promise<AnyRecord[]> {
  const seeds = ["이", "김", "박", "최", "정", "강"];
  const seen = new Set<string>();
  const all: AnyRecord[] = [];

  const results = await Promise.allSettled(seeds.map((kw) => fetchByKeyword(kw, 10)));
  for (const r of results) {
    if (r.status !== "fulfilled") continue;
    for (const ch of r.value) {
      if (seen.has(ch.channelId)) continue;
      seen.add(ch.channelId);
      all.push(ch);
    }
  }

  return all.sort((a, b) => b.concurrentUserCount - a.concurrentUserCount).slice(0, topN);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const ok = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    let topN = 10;
    if (req.method === "POST") {
      const body = await req.json().catch(() => ({}));
      topN = Number(body?.size ?? 10);
    } else {
      topN = Number(new URL(req.url).searchParams.get("size") ?? 10);
    }

    const clientId = Deno.env.get("CHZZK_CLIENT_ID") ?? "";
    const clientSecret = Deno.env.get("CHZZK_CLIENT_SECRET") ?? "";

    let data: AnyRecord[] = [];

    if (clientId && clientSecret) {
      data = await fetchViaOpenApi(clientId, clientSecret, topN);
    }

    if (data.length === 0) {
      data = await fetchFallback(topN);
    }

    return ok({ data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "알 수 없는 오류";
    return ok({ error: message, data: [] }, 500);
  }
});
