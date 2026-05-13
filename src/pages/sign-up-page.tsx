import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import chzzk from "@/assets/chzzk.png";
import { useSignUp } from "@/hooks/mutations/auth/use-sign-up";
import { generateErrorMessage } from "@/lib/error";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate: signUp, isPending } = useSignUp({
    onError: (error) => {
      toast.error(generateErrorMessage(error), { position: "top-center" });
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    signUp({ email, password });
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

        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
          좋아하는 스트리머 이야기를 함께 공유해요!
        </p>

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
            {isPending ? "가입 중..." : "가입하기"}
          </button>
        </form>

        <p className="text-center text-[11px] text-zinc-400 dark:text-zinc-500">
          가입하면 치지직 라이브 게시판의{" "}
          <span className="font-semibold">이용약관</span>에 동의하게 됩니다.
        </p>
      </div>

      {/* 로그인 카드 */}
      <div className="rounded-2xl border border-[#dbdbdb] bg-white px-10 py-4 text-center text-sm dark:border-zinc-800 dark:bg-zinc-900">
        <span className="text-zinc-700 dark:text-zinc-300">
          이미 계정이 있으신가요?{" "}
        </span>
        <Link
          to="/sign-in"
          className="font-semibold text-[#0095f6] hover:underline"
        >
          로그인
        </Link>
      </div>
    </div>
  );
}
