import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { signOutWithSessionClear } from "@/utils/fetch-client";
import { addToast } from "@heroui/react";

const IDLE_TIMEOUT = 10 * 60 * 1000; // 10 minutes

export function useIdleLogout() {
  const timer = useRef<NodeJS.Timeout | null>(null);
  const { status } = useSession();

  useEffect(() => {
    if (status !== "authenticated") return;

    const isActive = sessionStorage.getItem("active");

    if (!isActive) {
      signOutWithSessionClear({ callbackUrl: "/login" });
      addToast({
        title: "Session timeout",
        description: "Session timeout, please log in again.",
        color: "danger",
      });
      return;
    }

    const resetTimer = () => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        signOutWithSessionClear({ callbackUrl: "/login" });
        addToast({
          title: "Idle timeout",
          description: "You have been logged out due to inactivity.",
          color: "danger",
        });
      }, IDLE_TIMEOUT);
    };

    const events = [
      "mousemove",
      "keydown",
      "mousedown",
      "touchstart",
      "scroll",
    ];

    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      if (timer.current) clearTimeout(timer.current);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [status]);
}
