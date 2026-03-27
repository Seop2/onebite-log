import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSignInWithPassword } from "@/hook/mutations/auth/use-sign-in-password";
import { useState } from "react";
import { Link } from "react-router";
import githublogo from "@/assets/github-mark.svg";
import googleLog from "@/assets/google-logo.png";
import { toast } from "sonner";
import { generateErrorMessage } from "@/lib/error";
import { useSignInWithOAuth } from "@/hook/mutations/auth/use-sign-in-with-Oauth";

/**
 * 로그인 페이지
 * @returns
 */
export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate: signInWithPassword, isPending: isSignInWithPasswordPending } =
    useSignInWithPassword({
      onError: (error) => {
        const message = generateErrorMessage(error);
        toast.error(message, {
          position: "top-center",
        });
        setPassword("");
      },
    });

  const { mutate: signInWithOAuth, isPending: isSignInWithOAuthPending } =
    useSignInWithOAuth({
      onError: (error) => {
        const message = generateErrorMessage(error);
        toast.error(message, {
          position: "top-center",
        });
      },
    });

  const handleSignInWithPasswordCheck = () => {
    //입력값 검증
    if (email.trim() === "") return;
    if (password.trim() === "") return;

    signInWithPassword({
      email,
      password,
    });
  };

  //소셜 로그인
  const handleSignInWithOAuthClick = (provider: "github" | "google") => {
    signInWithOAuth(provider);
  };

  const isPending = isSignInWithOAuthPending || isSignInWithPasswordPending;
  return (
    <div className="flex flex-col gap-8">
      <div className="text-xl font-bold">로그인</div>
      <div className="flex flex-col gap-2">
        <Input
          disabled={isPending}
          className="py-6"
          type="email"
          placeholder="example@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          disabled={isPending}
          className="py-6"
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Button
          disabled={isPending}
          className="w-full"
          onClick={handleSignInWithPasswordCheck}
        >
          로그인
        </Button>
        <Button
          disabled={isPending}
          className="w-full"
          variant={"outline"}
          onClick={() => handleSignInWithOAuthClick("github")}
        >
          <img src={githublogo} className="h-4 w-4" />
          Github 계정으로 로그인
        </Button>
        <Button
          disabled={isPending}
          className="w-full"
          variant={"outline"}
          onClick={() => handleSignInWithOAuthClick("google")}
        >
          <img src={googleLog} className="h-4 w-4" />
          Google 계정으로 로그인
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        <Link to={"/sign-up"} className="text-muted-foreground hover:underline">
          계정이 없으시다면? 회원가입
        </Link>
        <Link
          to={"/forget-password"}
          className="text-muted-foreground hover:underline"
        >
          비밀번호를 잊으셨나요?
        </Link>
      </div>
    </div>
  );
}
