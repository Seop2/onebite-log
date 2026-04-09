import { updateProfile } from "@/api/profile";
import type { ProfileEntity, useMutationCallback } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../lib/constants";

/**
 * 프로필 수정
 * @param callbacks
 * @returns
 */
export function useUpdateProfile(callbacks?: useMutationCallback) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (updatedProfile) => {
      if (callbacks?.onSuccess) callbacks.onSuccess();
      //낙관적 업데이트
      queryClient.setQueryData<ProfileEntity>(
        QUERY_KEYS.profile.byId(updatedProfile.id), //key,
        //updatedValue
        updatedProfile,
      );
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
