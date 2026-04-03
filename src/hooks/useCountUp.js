import { useState, useEffect, useRef } from "react";

export const useCountUp = (target, duration = 1200, start = 0) => {
  const [value, setValue] = useState(start);
  const rafRef = useRef(null);

  useEffect(() => {
    const startTime = performance.now();
    const diff = target - start;

    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setValue(Math.round(start + diff * easeOut(progress)));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration, start]);

  return value;
};
