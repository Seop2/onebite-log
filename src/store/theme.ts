import type { Theme } from "@/types";
import { create } from "zustand";
import { combine, persist, devtools } from "zustand/middleware";

/**
 * persist middleware : zustand의 상태를 저장소에 저장해 데이터를 영구적으로 유지 가능
 */

type State = {
  theme: Theme;
};

const initialState: State = {
  theme: "light",
};

//사용자가 버튼을 눌렀을 때 테마 상태값 전역으로 관리
const useThemeStore = create(
  devtools(
    persist(
      combine(initialState, (set) => ({
        actions: {
          setTheme: (theme: Theme) => {
            applyTheme(theme);
            set({ theme });
          },
        },
      })),
      {
        name: "ThemeStore",
        //로컬 스토리지에 저장할 셀렉터 함수
        partialize: (store) => ({ theme: store.theme }),
      },
    ),
    { name: "ThemeStore" },
  ),
);

export const useTheme = () => {
  const theme = useThemeStore((store) => store.theme);
  return theme;
};

export const useSetTheme = () => {
  const setTheme = useThemeStore((store) => store.actions.setTheme);
  return setTheme;
};

export const applyTheme = (theme: Theme) => {
  const htmlTag = document.documentElement;
  htmlTag.classList.remove("dark", "light");

  if (theme === "system") {
    const isDarkTheme = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    htmlTag.classList.add(isDarkTheme ? "dark" : "light");
  } else {
    htmlTag.classList.add(theme);
  }
};
