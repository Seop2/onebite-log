import type { Session } from "@supabase/supabase-js";
import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";

//미들웨어란 특정 로직의 동작 과정 중간에 끼여서 추가적인 작업을 수행하는 도구
//타입 정의
type State = {
  isLoaded: boolean;
  session: Session | null;
};

//초기값 설정
const initialState = {
  isLoaded: false,
  session: null,
} as State;

//zustand를 활용한 세션상태값 설정
//create 함수는 스토어에 접근할 수 있는 리액트 훅을 반환한다.
const useSessionStore = create(
  //Redux 대상 사용
  devtools(
    combine(initialState, (set) => ({
      actions: {
        setSession: (session: Session | null) => {
          set({ session, isLoaded: true });
        },
      },
    })),
    { name: "sessionStore" },
  ),
);

/**
 * shotgun Surgery (산탄총 수술)
 * 기능을 추가 및 수정하거나 특정 프로퍼티의 이름이 변경되면, 동시에 여러 함수와 파일을 수정해야 한다.
 * 한 파일에서 발생한 변화가 여러 파일에 동시에 수정 사항을 발생시키는 것을 산찬총 수술이라한다.
 *
 * 커스텀 훅을 생성시 산탄총 수술문제를 해결할 수 있다.
 * @returns
 */

//세션 상태값 불러오는 커스텀 훅 생성
export const useSession = () => {
  const session = useSessionStore((store) => store.session);
  return session;
};

export const useIsSessionLoaded = () => {
  const isSessionLoaded = useSessionStore((store) => store.isLoaded);
  return isSessionLoaded;
};

export const useSetSession = () => {
  const setSession = useSessionStore((store) => store.actions.setSession);
  return setSession;
};
