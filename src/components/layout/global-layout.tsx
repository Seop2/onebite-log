import { Link, Outlet } from "react-router";
import chzzk from "@/assets/chzzk.png";
import ProfileButton from "./header/profile-button";
import ThemeButton from "./header/theme-button";

export default function GlobalLayout() {
  return (
    <div className="flex min-h-[100vh] flex-col">
      <header className="border-b">
        <div className="m-auto flex h-14 w-full max-w-[1100px] items-center justify-between px-4">
          <Link to={"/"} className="flex items-center gap-2.5">
            <img className="h-5" src={chzzk} alt="치지직" />
            <div className="flex items-center gap-2">
              <span className="font-bold">치지직 라이브 게시판</span>
              <span className="hidden rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-extrabold tracking-wider text-white sm:inline">
                ON AIR
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-5">
            <ThemeButton />
            <ProfileButton />
          </div>
        </div>
      </header>
      <main className="m-auto w-full max-w-[1100px] flex-1 border-x px-4 py-6">
        <Outlet />
      </main>
      <footer className="text-muted-foreground border-t py-10 text-center text-sm">
        lk9050@naver.com
      </footer>
    </div>
  );
}
