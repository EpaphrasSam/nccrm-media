import { useEffect, useRef } from "react";
import { signOut } from "next-auth/react";
import { addToast } from "@heroui/react";

const IDLE_TIMEOUT = 10 * 60 * 1000; // 10 minutes

export function useIdleLogout() {
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const resetTimer = () => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        signOut();
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
  }, []);
}
