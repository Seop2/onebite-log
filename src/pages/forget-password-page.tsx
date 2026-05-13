import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { LockKeyhole } from "lucide-react";
import chzzk from "@/assets/chzzk.png";
import { useRequestPasswordResetEmail } from "../hooks/mutations/auth/use-request-reset-email";
import { generateErrorMessage } from "@/lib/error";

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState("");

  const { mutate: requestPasswordResetEmail, isPending } =
    useRequestPasswordResetEmail({
      onSuccess: () => {
        toast.info("인증 메일이 전송되었습니다.", { position: "top-center" });
        setEmail("");
      },
      onError: (error) => {
        toast.error(generateErrorMessage(error), { position: "top-center" });
        setEmail("");
      },
    });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    requestPasswordResetEmail(email);
  }

  return (
    <div className="flex w-full max-w-[350px] flex-col gap-2.5">
      {/* 메인 카드 */}
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-[#dbdbdb] bg-white px-10 py-8 dark:border-zinc-800 dark:bg-zinc-900">
        {/* 로고 */}
        <img src={chzzk} alt="치지직" className="h-10 object-contain" />

        {/* 자물쇠 아이콘 + 설명 */}
        <div className="flex flex-col items-center gap-2">
          <div className="rounded-full border-2 border-zinc-800 p-3 dark:border-zinc-200">
            <LockKeyhole className="h-8 w-8 text-zinc-800 dark:text-zinc-200" />
          </div>
          <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
            로그인에 문제가 있나요?
          </p>
          <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
            이메일 주소를 입력하면 비밀번호를 재설정할 수 있는 링크를
            보내드립니다.
          </p>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-2">
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isPending}
            className="w-full rounded-[3px] border border-[#dbdbdb] bg-[#fafafa] px-3 py-2.5 text-xs outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-zinc-500"
          />
          <button
            type="submit"
            disabled={isPending || !email.trim()}
            className="w-full rounded-lg bg-[#0095f6] py-2 text-sm font-semibold text-white transition-opacity hover:bg-[#1877f2] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isPending ? "전송 중..." : "인증 링크 보내기"}
          </button>
        </form>

        {/* 구분선 */}
        <div className="flex w-full items-center gap-3">
          <div className="h-px flex-1 bg-[#dbdbdb] dark:bg-zinc-700" />
          <span className="text-[13px] font-semibold text-[#737373] dark:text-zinc-500">
            또는
          </span>
          <div className="h-px flex-1 bg-[#dbdbdb] dark:bg-zinc-700" />
        </div>

        <Link
          to="/sign-up"
          className="text-sm font-semibold text-zinc-800 hover:underline dark:text-zinc-200"
        >
          새 계정 만들기
        </Link>
      </div>

      {/* 로그인으로 돌아가기 카드 */}
      <div className="rounded-2xl border border-[#dbdbdb] bg-white px-10 py-4 text-center text-sm dark:border-zinc-800 dark:bg-zinc-900">
        <Link
          to="/sign-in"
          className="font-semibold text-zinc-700 hover:underline dark:text-zinc-300"
        >
          로그인으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
