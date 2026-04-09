import { fetchChannelLive } from "@/api/chzzk";
import { QUERY_KEYS } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";

export function useChannelLive(channelId: string) {
    return useQuery({
        queryKey: QUERY_KEYS.chzzk.channel(channelId),
        queryFn: () => fetchChannelLive(channelId),
        enabled: !!channelId && channelId !== "undefined" &&
            channelId !== "null",
        staleTime: 1000 * 60, //신선한 시간
        gcTime: 1000 * 60 * 5, //5분뒤 메모리에서 삭제
        refetchInterval: 1000 * 60, //1분마다 업데이트
    });
}
