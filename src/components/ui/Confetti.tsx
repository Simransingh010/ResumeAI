"use client";

import React, { useEffect, useState } from "react";

interface ConfettiPiece {
    id: number;
    x: number;
    color: string;
    delay: number;
    duration: number;
    size: number;
}

interface ConfettiProps {
    isActive: boolean;
    duration?: number;
    pieceCount?: number;
}

const COLORS = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEAA7",
    "#DDA0DD",
    "#98D8C8",
    "#F7DC6F",
    "#BB8FCE",
    "#85C1E9",
];

export default function Confetti({ isActive, duration = 3000, pieceCount = 100 }: ConfettiProps) {
    const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isActive) {
            const newPieces: ConfettiPiece[] = Array.from({ length: pieceCount }, (_, i) => ({
                id: i,
                x: Math.random() * 100,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                delay: Math.random() * 0.5,
                duration: 2 + Math.random() * 2,
                size: 8 + Math.random() * 8,
            }));
            setPieces(newPieces);
            setIsVisible(true);

            const timer = setTimeout(() => {
                setIsVisible(false);
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [isActive, duration, pieceCount]);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[200] overflow-hidden">
            {pieces.map((piece) => (
                <div
                    key={piece.id}
                    className="absolute animate-confetti"
                    style={{
                        left: `${piece.x}%`,
                        top: "-20px",
                        width: `${piece.size}px`,
                        height: `${piece.size}px`,
                        backgroundColor: piece.color,
                        borderRadius: Math.random() > 0.5 ? "50%" : "2px",
                        animationDelay: `${piece.delay}s`,
                        animationDuration: `${piece.duration}s`,
                    }}
                />
            ))}
            <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti-fall linear forwards;
        }
      `}</style>
        </div>
    );
}
