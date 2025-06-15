import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { signOutWithSessionClear } from "@/utils/fetch-client";
import { addToast } from "@heroui/react";

const IDLE_TIMEOUT = 10 * 60 * 1000; // 10 minutes

export function useIdleLogout() {
  const timer = useRef<NodeJS.Timeout | null>(null);
  const { status } = useSession();
  const lastMousePosition = useRef({ x: -1, y: -1 });

  useEffect(() => {
    if (status !== "authenticated") return;

    const isActive = sessionStorage.getItem("active");

    if (!isActive) {
      addToast({
        title: "Session timeout",
        description: "Session timeout, please log in again.",
        color: "danger",
      });
      signOutWithSessionClear({ callbackUrl: "/login" });
      return;
    }

    const resetTimer = () => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        addToast({
          title: "Idle timeout",
          description: "You have been logged out due to inactivity.",
          color: "danger",
        });
        signOutWithSessionClear({ callbackUrl: "/login" });
      }, IDLE_TIMEOUT);
    };

    // Safari-specific mousemove handler to avoid false triggers
    const handleMouseMove = (event: MouseEvent) => {
      const currentX = event.clientX;
      const currentY = event.clientY;

      // Only reset timer if mouse actually moved (Safari fix)
      if (
        lastMousePosition.current.x !== currentX ||
        lastMousePosition.current.y !== currentY
      ) {
        lastMousePosition.current = { x: currentX, y: currentY };
        resetTimer();
      }
    };

    // Comprehensive event list for better Safari/iOS compatibility
    const events = [
      "keydown",
      "keypress",
      "mousedown",
      "mouseup",
      "click",
      "touchstart",
      "touchmove",
      "touchend",
      "scroll",
      "wheel",
      "focus",
      "blur",
      "visibilitychange", // Detect tab switching
    ];

    // Add mousemove with custom handler
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Add other events with standard handler
    events.forEach((event) =>
      window.addEventListener(event, resetTimer, { passive: true })
    );

    resetTimer();

    return () => {
      if (timer.current) clearTimeout(timer.current);
      window.removeEventListener("mousemove", handleMouseMove);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [status]);
}
