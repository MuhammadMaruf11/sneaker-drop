import { useEffect, useState } from "react";

type TimerProps = {
  expiresAt: string;
  onExpire?: () => void;
};

export function Timer({ expiresAt, onExpire }: TimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(60);

  useEffect(() => {
    const calc = () => {
      const diff = Math.max(
        0,
        Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000)
      );
      setSecondsLeft(diff);
      if (diff === 0) onExpire?.();
    };

    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - secondsLeft / 60);
  const color =
    secondsLeft > 30 ? "#22c55e" : secondsLeft > 10 ? "#f59e0b" : "#ef4444";

  return (
    <div className="flex items-center gap-2">
      <div className="relative w-11 h-11">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 44 44">
          <circle cx="22" cy="22" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="3.5" />
          <circle
            cx="22" cy="22" r={radius}
            fill="none" stroke={color} strokeWidth="3.5"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s linear, stroke 0.4s" }}
          />
        </svg>
        <span
          className="absolute inset-0 flex items-center justify-center text-xs font-bold"
          style={{ color }}
        >
          {secondsLeft}
        </span>
      </div>
      <span className="text-xs text-gray-500">seconds left</span>
    </div>
  );
}

export default Timer;
