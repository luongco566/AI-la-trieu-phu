
import React from 'react';
import { Question } from '../types';
import { MC_LINES } from '../constants';

interface HostControlsProps {
    question: Question;
    onLockChange: (isLocked: boolean) => void;
    speak: (text: string) => void;
    isSpeaking: boolean;
    onCorrect: () => void;
    onWrong: () => void;
}

const pickRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

const HostControls: React.FC<HostControlsProps> = ({ question, onLockChange, speak, isSpeaking, onCorrect, onWrong }) => {
    const readQuestion = () => {
        const textToSpeak = `Câu hỏi số ${question.id}. ${question.question}. Các phương án là. A: ${question.choices[0]}. B: ${question.choices[1]}. C: ${question.choices[2]}. và D: ${question.choices[3]}.`;
        speak(textToSpeak);
    };

    const handleCorrect = () => {
        speak(pickRandom(MC_LINES.correct));
        onCorrect();
    };

    const handleWrong = () => {
        speak(pickRandom(MC_LINES.wrong));
        onWrong();
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-black/70 p-4 backdrop-blur-sm z-40">
            <div className="max-w-4xl mx-auto text-center">
                <h3 className="font-bold text-yellow-400 mb-2">Bảng điều khiển của MC</h3>
                <div className="flex flex-wrap justify-center items-center gap-3">
                    <button onClick={readQuestion} disabled={isSpeaking} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50">Đọc câu hỏi</button>
                    <button onClick={() => onLockChange(false)} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg">Mở Chốt</button>
                    <button onClick={() => onLockChange(true)} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg">Khóa Chốt</button>
                    <button onClick={handleCorrect} className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg">Chính xác!</button>
                    <button onClick={handleWrong} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg">Rất tiếc!</button>
                </div>
            </div>
        </div>
    );
};

export default HostControls;
