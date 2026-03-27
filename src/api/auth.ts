import supabase from "@/lib/supabase";
import type { Provider } from "@supabase/supabase-js";

/**
 * 회원가입
 * @param param0
 * @returns
 */
export async function signUp({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

/**
 * 로그인
 * @param param0
 * @returns
 */
export async function signInWithPassword({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}
/**
 * OAuth 요청
 * @param provider
 * @returns
 */
export async function signInWithOAuth(provider: Provider) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
  });

  if (error) throw error;
  return data;
}

/**
 * 비밀번호 초기화를 위한 이메일 전송
 * @param email
 * @returns
 */
export async function requestPasswordResetEmail(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    //검증 성공시 보낼 주소
    redirectTo: `${import.meta.env.VITE_PUBLIC_URL}/reset-password`,
  });
  if (error) throw error;
  return data;
}

/**
 * 비밀번호 변경
 * @param password
 * @returns
 */
export async function updatePassword(password: string) {
  const { data, error } = await supabase.auth.updateUser({
    password,
  });
  if (error) throw error;
  return data;
}

/**
 * 로그아웃
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) await supabase.auth.signOut({ scope: "local" }); //supabase와 상관없이 액세스토큰 모두 삭제
}
