import { fetchChzzkChannel } from "@/api/chzzk";
import { QUERY_KEYS } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";

export function useChzzkSearch(keyword: string) {
    return useQuery({
        queryKey: QUERY_KEYS.chzzk.search(keyword),
        queryFn: () => fetchChzzkChannel(keyword),
        enabled: keyword.trim().length >= 2, //조건부 실행
        staleTime: 1000 * 60,
    });
}
