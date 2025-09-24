import React from 'react';
import { LifelineState, Question } from '../types';

interface LifelinesProps {
    lifelines: LifelineState;
    setLifelines: React.Dispatch<React.SetStateAction<LifelineState>>;
    currentQuestion: Question;
    setDisabledChoices: React.Dispatch<React.SetStateAction<number[]>>;
    setShowAudiencePoll: React.Dispatch<React.SetStateAction<boolean>>;
    setHint: React.Dispatch<React.SetStateAction<string | null>>;
    isGamePaused: boolean;
}

const LifelineButton: React.FC<{ onClick: () => void; disabled: boolean; children: React.ReactNode }> = ({ onClick, disabled, children }) => {
    const baseClasses = "px-4 py-2 rounded-full font-semibold transition-all transform duration-200 focus:outline-none focus:ring-4 shadow-lg text-xs sm:text-sm";
    const activeClasses = "bg-purple-600 text-white hover:bg-purple-700 hover:scale-105 focus:ring-purple-400";
    const disabledClasses = "bg-gray-700 text-gray-400 cursor-not-allowed line-through";
    
    return (
        <button onClick={onClick} disabled={disabled} className={`${baseClasses} ${disabled ? disabledClasses : activeClasses}`}>
            {children}
        </button>
    );
}

const Lifelines: React.FC<LifelinesProps> = ({ lifelines, setLifelines, currentQuestion, setDisabledChoices, setShowAudiencePoll, setHint, isGamePaused }) => {

    const useFiftyFifty = () => {
        if (!lifelines.fiftyFifty) return;

        const { correctIndex, choices } = currentQuestion;
        const wrongChoices = choices.map((_, i) => i).filter(i => i !== correctIndex);
        const choiceToKeep = wrongChoices[Math.floor(Math.random() * wrongChoices.length)];
        const choicesToRemove = wrongChoices.filter(i => i !== choiceToKeep);
        
        setDisabledChoices(choicesToRemove);
        setLifelines(prev => ({ ...prev, fiftyFifty: false }));
    };

    const useAudience = () => {
        if (!lifelines.audience) return;
        setShowAudiencePoll(true);
        setLifelines(prev => ({ ...prev, audience: false }));
    };

    const useHint = () => {
        if (!lifelines.hint) return;
        setHint(currentQuestion.explanation || "Không có gợi ý nào cho câu hỏi này.");
        setLifelines(prev => ({ ...prev, hint: false }));
    };

    return (
        <div className="flex items-center space-x-2">
            <LifelineButton onClick={useFiftyFifty} disabled={!lifelines.fiftyFifty || isGamePaused}>50:50</LifelineButton>
            <LifelineButton onClick={useAudience} disabled={!lifelines.audience || isGamePaused}>Hỏi khán giả</LifelineButton>
            <LifelineButton onClick={useHint} disabled={!lifelines.hint || isGamePaused}>Gợi ý</LifelineButton>
        </div>
    );
};

export default Lifelines;