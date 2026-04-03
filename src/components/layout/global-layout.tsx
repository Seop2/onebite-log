import { Link, Outlet } from "react-router";
import chzzk from "@/assets/chzzk.png";
import ProfileButton from "./header/profile-button";
import ThemeButton from "./header/theme-button";

/**
 * 기본 레이아웃 컴포넌트
 * @returns
 */
export default function GlobalLayout() {
  return (
    <div className="flex min-h-[100vh] flex-col">
      <header className="h-15 border-b">
        <div className="m-auto flex h-full w-full max-w-175 justify-between px-4">
          <Link to={"/"} className="flex items-center gap-2">
            <img className="h-5" src={chzzk} alt="치지직 게시판" />
            <div className="font-bold">치지직 스트리머 게시판</div>
          </Link>
          <div className="flex items-center gap-5">
            <ThemeButton />
            <ProfileButton />
          </div>
        </div>
      </header>
      <main className="m-auto w-full max-w-175 flex-1 border-x px-4 py-6">
        {/* 페이지 공통 컴포넌트 렌더링 위치 지정 */}
        <Outlet />
      </main>
      <footer className="text-muted-foreground border-t py-10 text-center">
        lk9050@naver.com
      </footer>
    </div>
  );
}
