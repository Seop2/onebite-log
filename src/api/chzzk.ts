import supabase from "@/lib/supabase";

export type ChzzkChannel = {
  channelId: string;
  channelName: string;
  channelImageUrl: string | null;
  verifiedMark: boolean;
  isLive: boolean;
  liveThumbnailUrl: string | null;
  liveTitle: string | null;
  concurrentUserCount: number;
};

/**
 * Supabase Edge Function을 통해 치지직 스트리머 채널을 검색합니다.
 * CORS 문제를 Edge Function 서버 사이드에서 처리합니다.
 *
 * @param keyword  검색할 스트리머 이름 (# 제외)
 * @param size     최대 결과 수 (기본 5)
 */
export async function fetchChzzkChannel(
  keyword: string,
  size = 5,
): Promise<ChzzkChannel[]> {
  if (!keyword.trim()) return [];

  const { data, error } = await supabase.functions.invoke("chzzk-search", {
    body: { keyword: keyword.trim(), size },
  });

  if (error) throw error;

  return data?.data ?? [];
}

export async function fetchChannelLive(channelId: string) {
  // channelId가 유효하지 않으면 호출하지 않음
  if (!channelId || channelId === "null" || channelId === "undefined") {
    return null;
  }

  const { data, error } = await supabase.functions.invoke(
    `chzzk-live?channelId=${encodeURIComponent(channelId)}`,
    {
      method: "GET",
    },
  );

  if (error) {
    console.error("Edge Function 호출 실패:", error);
    return null;
  }

  // 💡 중요: 404 에러 응답이 왔을 경우 null 반환
  if (data?.status === 404 || data?.error) {
    console.warn("여전히 네이버 주소를 찾지 못함. 엔드포인트 교체 필요.");
  }

  // 💡 구조 유연화: data.content가 있으면 그것을, 없으면 data 전체를 반환
  return data?.content ?? data ?? null;
}
