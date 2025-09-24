
import React from 'react';
import { PRIZE_MONEY, SAFE_HAVENS } from '../constants';

interface PrizeLadderProps {
    currentQuestionIndex: number;
}

const PrizeLadder: React.FC<PrizeLadderProps> = ({ currentQuestionIndex }) => {
    const currentLevel = PRIZE_MONEY.length - 1 - currentQuestionIndex;
    
    return (
        <div className="h-full flex flex-col justify-center">
            <ul className="space-y-1 text-right">
                {PRIZE_MONEY.map((amount, index) => {
                    const questionNumber = PRIZE_MONEY.length - index;
                    const isCurrent = index === currentLevel;
                    const isWon = index > currentLevel;
                    const isSafeHaven = SAFE_HAVENS.includes(index);
                    
                    let classes = "p-1 rounded-md transition-all duration-300 font-bold text-xs md:text-sm flex justify-between items-center px-2";
                    
                    if (isCurrent) {
                        classes += " bg-purple-600 text-white scale-105 shadow-lg";
                    } else if (isWon) {
                        classes += " bg-yellow-600 text-black opacity-70";
                    } else if (isSafeHaven) {
                        classes += " text-white font-extrabold";
                    } else {
                        classes += " text-yellow-400/80";
                    }

                    return (
                        <li key={index} className={classes}>
                           <span className="text-gray-400/80 mr-2">{questionNumber}</span> 
                           <span>{amount.toLocaleString('vi-VN')} VNĐ</span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default PrizeLadder;
