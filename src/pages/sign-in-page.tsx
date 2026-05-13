import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import chzzk from "@/assets/chzzk.png";
import githubLogo from "@/assets/github-mark.svg";
import googleLogo from "@/assets/google-logo.png";
import { useSignInWithPassword } from "@/hooks/mutations/auth/use-sign-in-password";
import { useSignInWithOAuth } from "@/hooks/mutations/auth/use-sign-in-with-Oauth";
import { generateErrorMessage } from "@/lib/error";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate: signInWithPassword, isPending: isPasswordPending } =
    useSignInWithPassword({
      onError: (error) => {
        toast.error(generateErrorMessage(error), { position: "top-center" });
        setPassword("");
      },
    });

  const { mutate: signInWithOAuth, isPending: isOAuthPending } =
    useSignInWithOAuth({
      onError: (error) => {
        toast.error(generateErrorMessage(error), { position: "top-center" });
      },
    });

  const isPending = isPasswordPending || isOAuthPending;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    signInWithPassword({ email, password });
  }

  return (
    <div className="flex w-full max-w-[350px] flex-col gap-2.5">
      {/* 메인 카드 */}
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-[#dbdbdb] bg-white px-10 py-8 dark:border-zinc-800 dark:bg-zinc-900">
        {/* 로고 */}
        <div className="mb-2 flex flex-col items-center gap-2">
          <img src={chzzk} alt="치지직" className="h-10 object-contain" />
          <p className="text-xs font-semibold text-zinc-400">
            치지직 라이브 게시판
          </p>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-1.5">
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isPending}
            className="w-full rounded-[3px] border border-[#dbdbdb] bg-[#fafafa] px-3 py-2.5 text-xs outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-zinc-500"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isPending}
            className="w-full rounded-[3px] border border-[#dbdbdb] bg-[#fafafa] px-3 py-2.5 text-xs outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-zinc-500"
          />
          <button
            type="submit"
            disabled={isPending || !email.trim() || !password.trim()}
            className="mt-1 w-full rounded-lg bg-[#0095f6] py-2 text-sm font-semibold text-white transition-opacity hover:bg-[#1877f2] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isPasswordPending ? "로그인 중..." : "로그인"}
          </button>
        </form>

        {/* OR 구분선 */}
        <div className="flex w-full items-center gap-3">
          <div className="h-px flex-1 bg-[#dbdbdb] dark:bg-zinc-700" />
          <span className="text-[13px] font-semibold text-[#737373] dark:text-zinc-500">
            또는
          </span>
          <div className="h-px flex-1 bg-[#dbdbdb] dark:bg-zinc-700" />
        </div>

        {/* 소셜 로그인 */}
        <div className="flex w-full flex-col gap-3">
          <button
            onClick={() => signInWithOAuth("github")}
            disabled={isPending}
            className="flex w-full items-center justify-center gap-2 text-sm font-semibold text-zinc-800 transition-opacity hover:opacity-70 disabled:opacity-40 dark:text-zinc-200"
          >
            <img src={githubLogo} className="h-4 w-4 dark:invert" alt="GitHub" />
            GitHub으로 로그인
          </button>
          <button
            onClick={() => signInWithOAuth("google")}
            disabled={isPending}
            className="flex w-full items-center justify-center gap-2 text-sm font-semibold text-zinc-800 transition-opacity hover:opacity-70 disabled:opacity-40 dark:text-zinc-200"
          >
            <img src={googleLogo} className="h-4 w-4" alt="Google" />
            Google로 로그인
          </button>
        </div>

        {/* 비밀번호 찾기 */}
        <Link
          to="/forget-password"
          className="mt-1 text-xs text-[#00376b] hover:underline dark:text-[#0095f6]"
        >
          비밀번호를 잊으셨나요?
        </Link>
      </div>

      {/* 회원가입 카드 */}
      <div className="rounded-2xl border border-[#dbdbdb] bg-white px-10 py-4 text-center text-sm dark:border-zinc-800 dark:bg-zinc-900">
        <span className="text-zinc-700 dark:text-zinc-300">
          계정이 없으신가요?{" "}
        </span>
        <Link
          to="/sign-up"
          className="font-semibold text-[#0095f6] hover:underline"
        >
          가입하기
        </Link>
      </div>
    </div>
  );
}
