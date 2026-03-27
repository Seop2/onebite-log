import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSetTheme, useTheme } from "@/store/theme";
import type { Theme } from "@/types";
import { PopoverClose } from "@radix-ui/react-popover";
import { CheckIcon, SunIcon } from "lucide-react";

/**
 * 테마 버튼 컴포넌트
 * @returns
 */
const THEMES: Theme[] = ["system", "dark", "light"];
export default function ThemeButton() {
  const currentTheme = useTheme(); //스토어로 현재 테마 State값 불러옴
  const setTheme = useSetTheme(); //액션 함수 불러옴.
  return (
    <Popover>
      <PopoverTrigger>
        <div className="hover:bg-muted cursor-pointer rounded-full p-2">
          <SunIcon />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-35 p-0">
        {THEMES.map((theme) => (
          <PopoverClose key={`theme-button-${theme}`} asChild>
            <div
              className="hover:bg-muted flex cursor-pointer items-center justify-between p-3"
              onClick={() => setTheme(theme)}
            >
              {theme}
              {currentTheme === theme && <CheckIcon className="h-4 w-4" />}
            </div>
          </PopoverClose>
        ))}
      </PopoverContent>
    </Popover>
  );
}
