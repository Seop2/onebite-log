import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSignUp } from "@/hooks/mutations/auth/use-sign-up";
import { useState } from "react";
import { Link } from "react-router";
import { generateErrorMessage } from "@/lib/error";
import { toast } from "sonner";

/**
 * 회원가압 페이지
 * @returns
 */
export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutate: signUp, isPending: isSignUpPending } = useSignUp({
    onError: (error) => {
      const message = generateErrorMessage(error);
      toast.error(message, {
        position: "top-center",
      });
    },
  });
  const handleSignUpClick = () => {
    //입력값 검증
    if (email.trim() === "") return;
    if (password.trim() === "") return;

    //supabase 서버에 회원가입 요청하는 비동기 함수
    signUp({
      email,
      password,
    });
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="text-xl font-bold">회원가입</div>
      <div className="flex flex-col gap-2">
        <Input
          disabled={isSignUpPending}
          className="py-6"
          type="email"
          placeholder="example@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          disabled={isSignUpPending}
          className="py-6"
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <Button
          disabled={isSignUpPending}
          className="w-full"
          onClick={handleSignUpClick}
        >
          회원가입
        </Button>
      </div>
      <div>
        <Link to={"/sign-in"} className="text-muted-foreground hover:underline">
          이미 계정이 있다면? 로그인
        </Link>
      </div>
    </div>
  );
}
