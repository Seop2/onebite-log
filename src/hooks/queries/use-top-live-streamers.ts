import { fetchTopLiveStreamers } from "@/api/chzzk";
import { useQuery } from "@tanstack/react-query";

export function useTopLiveStreamers() {
  return useQuery({
    queryKey: ["chzzk", "top-live"],
    queryFn: () => fetchTopLiveStreamers(),
    staleTime: 1000 * 60,
    refetchInterval: 1000 * 60,
  });
}
