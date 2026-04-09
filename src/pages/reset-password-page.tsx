import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useUpdatePassword from "@/hooks/mutations/auth/use-update-password";
import { generateErrorMessage } from "@/lib/error";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

/**
 * 비밀번호 재설정 페이지
 * @returns
 */
export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const { mutate: updatePassword, isPending: isUpdatePasswordPending } =
    useUpdatePassword({
      onSuccess: () => {
        toast.info("비밀번호가 재설정 되었습니다.", {
          position: "top-center",
        });
        navigate("/");
      },
      onError: (error) => {
        const message = generateErrorMessage(error);
        toast.error(message, {
          position: "top-center",
        });
        setPassword("");
      },
    });
  const handleUpdatePassword = () => {
    if (password.trim() === "") return;
    updatePassword(password);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <div className="text-xl font-bold">비밀번호 재설정하기</div>
        <div className="text-muted-foreground">
          새로운 비밀번호를 입력하세요
        </div>
      </div>
      <Input
        disabled={isUpdatePasswordPending}
        type="password"
        value={password}
        className="py-6"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        disabled={isUpdatePasswordPending}
        className="w-full"
        onClick={handleUpdatePassword}
      >
        비밀번호 변경하기
      </Button>
    </div>
  );
}
