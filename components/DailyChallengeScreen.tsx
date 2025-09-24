import React, { useState, useEffect } from 'react';
import { Question, Player, GameSettings, LifelineState } from '../types';
import { generateQuestions } from '../services/geminiService';
import GameScreen from './GameScreen';
import GameOverScreen from './GameOverScreen';

interface DailyChallengeScreenProps {
    onBack: () => void;
}

const DailyChallengeScreen: React.FC<DailyChallengeScreenProps> = ({ onBack }) => {
    const [questions, setQuestions] = useState<Question[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [gameState, setGameState] = useState<'LOADING' | 'PLAYING' | 'GAME_OVER'>('LOADING');

    const [players, setPlayers] = useState<Player[]>([]);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [lifelines, setLifelines] = useState<LifelineState>({ fiftyFifty: true, audience: true, hint: true });
    const [isDarkMode, setIsDarkMode] = useState(true);

    const gameSettings: GameSettings = {
        numPlayers: 1,
        playerNames: ['Thí sinh'],
        topic: 'Thử thách hàng ngày',
        difficulty: 'mixed',
        numQuestions: 15,
        timePerQuestion: 30,
        gameMode: 'daily',
    };

    useEffect(() => {
        const fetchDailyQuestions = async () => {
            try {
                const today = new Date();
                const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
                const topics = ["Khoa học vũ trụ", "Địa lý thế giới", "Lịch sử Việt Nam", "Văn hóa đại chúng", "Thể thao Olympic", "Phát minh công nghệ", "Văn học kinh điển"];
                const dailyTopic = topics[dayOfYear % topics.length];
                
                const dailyQuestions = await generateQuestions(`Tổng hợp kiến thức về ${dailyTopic}`, 15, 'mixed');
                if (dailyQuestions.length < 15) {
                    throw new Error("Không thể tạo đủ 15 câu hỏi cho thử thách hôm nay.");
                }
                setQuestions(dailyQuestions);
                setPlayers([{ id: 0, name: `Thí sinh`, questionIndex: 0, isFinished: false, finalPrize: 0 }]);
                setGameState('PLAYING');

            } catch (e: any) {
                setError(e.message || "Lỗi khi tải thử thách hàng ngày.");
                setGameState('LOADING'); // Stay in loading to show error
            }
        };

        fetchDailyQuestions();
    }, []);

    const handleDailyGameEnd = (finalPlayers: Player[]) => {
        setPlayers(finalPlayers);
        setGameState('GAME_OVER');
    };

    if (gameState === 'LOADING') {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-white bg-indigo-900">
                {error ? (
                    <div className="p-4 text-center">
                        <h1 className="text-4xl font-bold text-red-500 mb-4">Đã xảy ra lỗi</h1>
                        <p className="text-lg">{error}</p>
                        <button onClick={onBack} className="mt-6 px-6 py-2 bg-purple-600 rounded-lg hover:bg-purple-700">Quay lại Menu</button>
                    </div>
                ) : (
                    <>
                        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-teal-500"></div>
                        <p className="mt-4 text-xl">Đang chuẩn bị thử thách hôm nay...</p>
                    </>
                )}
            </div>
        );
    }
    
    if (gameState === 'GAME_OVER') {
        return <GameOverScreen players={players} onPlayAgain={onBack} onMainMenu={onBack} />;
    }

    if (gameState === 'PLAYING' && questions) {
        return (
            <GameScreen
                key="daily_challenge_game"
                gameSettings={gameSettings}
                questions={questions}
                players={players}
                setPlayers={setPlayers}
                currentPlayerIndex={currentPlayerIndex}
                setCurrentPlayerIndex={setCurrentPlayerIndex}
                onGameEnd={handleDailyGameEnd}
                lifelines={lifelines}
                setLifelines={setLifelines}
                isGamePaused={false} // Pause is handled by App.tsx, can be simplified here
                onPause={() => {}} // Not needed here as we use the modal from App.tsx
                isDarkMode={isDarkMode}
                setIsDarkMode={setIsDarkMode}
            />
        );
    }

    return null; // Should not be reached
};

export default DailyChallengeScreen;