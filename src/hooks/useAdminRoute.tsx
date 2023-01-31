import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const useAdminRoute = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session || (session.user as any)?.role !== "ADMIN") {
      router.push("/");
    }
  }, [session]);
};
