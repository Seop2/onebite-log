import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useChzzkSearch } from "@/hooks/queries/use-posts-channels-data";
import defaultAvatar from "@/assets/default-avatar.png";

interface SelectedChannel {
  channelId: string;
  channelName: string;
  channelImageUrl: string | null;
}

interface StreamerFilterProps {
  onSelect: (channel: SelectedChannel | null) => void;
}

export default function StreamerFilter({ onSelect }: StreamerFilterProps) {
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState<SelectedChannel | null>(null);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: results = [], isFetching } = useChzzkSearch(input);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(channel: SelectedChannel) {
    setSelected(channel);
    setInput("");
    setOpen(false);
    onSelect(channel);
  }

  function handleClear() {
    setSelected(null);
    setInput("");
    onSelect(null);
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-sm">
      {selected ? (
        <div className="flex items-center gap-2 rounded-full border border-[#00ffa3]/40 bg-[#00ffa3]/10 px-3 py-1.5">
          <img
            src={selected.channelImageUrl ?? defaultAvatar}
            alt={selected.channelName}
            className="h-5 w-5 rounded-full object-cover"
          />
          <span className="text-sm font-bold text-[#00ffa3]">
            {selected.channelName}
          </span>
          <button
            onClick={handleClear}
            className="text-muted-foreground hover:text-foreground ml-auto"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <input
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setOpen(true);
            }}
            onFocus={() => input.trim().length >= 2 && setOpen(true)}
            placeholder="스트리머 검색..."
            className="bg-background border-input w-full rounded-full border py-1.5 pr-4 pl-9 text-sm outline-none focus:ring-1 focus:ring-[#00ffa3]/50"
          />
        </div>
      )}

      {open && !selected && results.length > 0 && (
        <ul className="bg-background border-border absolute z-50 mt-1 w-full rounded-xl border shadow-lg">
          {results.map((ch) => (
            <li key={ch.channelId}>
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(ch)}
                className="hover:bg-accent flex w-full items-center gap-3 px-3 py-2 text-left first:rounded-t-xl last:rounded-b-xl"
              >
                <img
                  src={ch.channelImageUrl ?? defaultAvatar}
                  alt={ch.channelName}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <div>
                  <div className="text-sm font-medium">{ch.channelName}</div>
                  {ch.isLive && (
                    <div className="text-xs text-red-500">
                      LIVE · {ch.concurrentUserCount.toLocaleString()}명
                    </div>
                  )}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      {open && !selected && isFetching && (
        <div className="bg-background border-border absolute z-50 mt-1 w-full rounded-xl border px-3 py-2 text-sm text-muted-foreground shadow-lg">
          검색 중...
        </div>
      )}
    </div>
  );
}
