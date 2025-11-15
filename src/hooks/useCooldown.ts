/**
 * useCooldown Hook
 * -----------------
 * Manages a countdown cooldown timer.
 *
 * Usage Example:
 * const { cooldown, startCooldown } = useCooldown(30);
 *
 * <button onClick={startCooldown} disabled={cooldown > 0}>
 *   {cooldown > 0 ? `Wait ${cooldown}s` : "Click Me"}
 * </button>
 */

import { useState, useEffect } from "react";

export const useCooldown = (initialSeconds: number = 30) => {
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;

    const interval = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldown]);

  const startCooldown = () => setCooldown(initialSeconds);

  return { cooldown, startCooldown };
};
