import { requestPasswordResetEmail } from "@/api/auth";
import type { useMutationCallback } from "@/types";
import { useMutation } from "@tanstack/react-query";

export function useRequestPasswordResetEmail(callbacks?: useMutationCallback) {
  return useMutation({
    mutationFn: requestPasswordResetEmail,
    onSuccess: () => {
      if (callbacks?.onSuccess) callbacks.onSuccess();
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
