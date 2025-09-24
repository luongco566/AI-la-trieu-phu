import React, { useState, useEffect, useRef } from 'react';

interface TimerProps {
    duration: number;
    onTimeout: () => void;
    isPaused: boolean;
    key: string;
}

const Timer: React.FC<TimerProps> = ({ duration, onTimeout, isPaused, key }) => {
    const [timeLeft, setTimeLeft] = useState(duration);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        setTimeLeft(duration);
    }, [key, duration]);

    useEffect(() => {
        if (isPaused) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return;
        }

        intervalRef.current = window.setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 1) {
                    if(intervalRef.current) clearInterval(intervalRef.current);
                    onTimeout();
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isPaused, onTimeout]);
    
    const percentage = (timeLeft / duration) * 100;
    const colorClass = timeLeft <= 10 ? 'text-red-500' : 'text-yellow-500';

    return (
        <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                    className="text-gray-700/50"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                />
                <path
                    className={colorClass}
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray={`${percentage}, 100`}
                    strokeLinecap="round"
                    transform="rotate(-90 18 18)"
                    style={{ transition: 'stroke-dasharray 0.3s linear' }}
                />
            </svg>
            <span className={`absolute text-3xl font-bold text-white`}>
                {timeLeft}
            </span>
        </div>
    );
};

export default Timer;