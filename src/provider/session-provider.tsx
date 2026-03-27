import type { ReactNode } from "react";
import { useEffect } from "react";
import { useIsSessionLoaded, useSession, useSetSession } from "@/store/session";
import supabase from "@/lib/supabase";
import GlobalLoader from "@/components/global-loader";
import { useProfileData } from "@/hook/queries/use-profile-data";

/**
 * 세션 관리 부모 컴포넌트
 * @param param0
 * @returns
 */
export default function SessionProvider({ children }: { children: ReactNode }) {
  const session = useSession();
  const setSession = useSetSession();
  const isSessionLoaded = useIsSessionLoaded();

  const { isLoading: isProfileLoading } = useProfileData(session?.user.id);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setSession]);

  if (!isSessionLoaded || isProfileLoading) return <GlobalLoader />;

  return children;
}
