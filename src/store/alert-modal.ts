import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";

type OpenState = {
  isOpen: true;
  title: string;
  description: string;
  onPostitive?: () => void;
  onNegative?: () => void;
};

type CloseState = {
  isOpen: false;
};

type State = CloseState | OpenState;

const initalState = {
  isOpen: false,
} as State;

//경고 알림 모달 스토어 생성
const useAlertModalStore = create(
  devtools(
    combine(initalState, (set) => ({
      //actions 객체로 함수 묶기
      actions: {
        open: (params: Omit<OpenState, "isOpen">) => {
          set({ ...params, isOpen: true });
        },
        close: () => {
          set({ isOpen: false });
        },
      },
    })),
    { name: "AlertModalStore" },
  ),
);

//open 액션 함수 꺼내는 커스텀 훅
export const useOpenAlertModal = () => {
  //셀렉터 함수로 불필요한 리렌더링 방지
  const open = useAlertModalStore((store) => store.actions.open);
  return open;
};

//스토어 모든 데이터 불러오는 커스텀 훅
export const useAlertModal = () => {
  const store = useAlertModalStore();
  return store as typeof store & State;
};
