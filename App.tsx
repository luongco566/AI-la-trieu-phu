
import React, { useState, useCallback, useEffect } from 'react';
import { GameState, GameSettings, Player, Question, LeaderboardEntry, LifelineState } from './types';
import { generateQuestions } from './services/geminiService';
import { UserProvider } from './contexts/UserContext';

import SetupScreen from './components/SetupScreen';
import GameScreen from './components/GameScreen';
import GameOverScreen from './components/GameOverScreen';
import LeaderboardScreen from './components/LeaderboardScreen';
import MainMenu from './components/MainMenu';
import PauseModal from './components/PauseModal';
import DailyChallengeScreen from './components/DailyChallengeScreen';
import ProfileScreen from './components/ProfileScreen';

const App: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>('MAIN_MENU');
    const [gameSettings, setGameSettings] = useState<GameSettings | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [lifelines, setLifelines] = useState<LifelineState>({ fiftyFifty: true, audience: true, hint: true });
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    const startGame = useCallback(async (settings: GameSettings) => {
        setGameSettings(settings);
        setGameState('LOADING');
        const fetchedQuestions = await generateQuestions(settings.topic, settings.numQuestions, settings.difficulty);
        setQuestions(fetchedQuestions);

        const initialPlayers: Player[] = settings.playerNames.map((name, index) => ({
            id: index,
            name,
            questionIndex: 0,
            isFinished: false,
            finalPrize: 0,
        }));
        setPlayers(initialPlayers);
        setCurrentPlayerIndex(0);
        setLifelines({ fiftyFifty: true, audience: true, hint: true });
        setGameState('PLAYING');
    }, []);

    const handleGameEnd = (updatedPlayers: Player[]) => {
        const leaderboard = JSON.parse(localStorage.getItem('millionaireLeaderboard') || '[]') as LeaderboardEntry[];
        
        updatedPlayers.forEach(player => {
            if (player.finalPrize > 0) {
                leaderboard.push({
                    name: player.name,
                    score: player.finalPrize,
                    date: new Date().toLocaleDateString('vi-VN')
                });
            }
        });

        leaderboard.sort((a, b) => b.score - a.score);
        localStorage.setItem('millionaireLeaderboard', JSON.stringify(leaderboard.slice(0, 10)));
        
        setPlayers(updatedPlayers);
        setGameState('GAME_OVER');
    };
    
    const resetToMainMenu = () => {
        setGameState('MAIN_MENU');
        setGameSettings(null);
        setQuestions([]);
        setPlayers([]);
        setIsPaused(false);
    }

    const renderContent = () => {
        switch (gameState) {
            case 'MAIN_MENU':
                return <MainMenu 
                            onPlay={() => setGameState('SETUP')} 
                            onLeaderboard={() => setGameState('LEADERBOARD')}
                            onDailyChallenge={() => setGameState('DAILY_CHALLENGE')}
                            onProfile={() => setGameState('PROFILE')}
                        />;
            case 'SETUP':
                return <SetupScreen onStartGame={startGame} onBack={resetToMainMenu} />;
            case 'LOADING':
                return (
                    <div className="flex flex-col items-center justify-center h-screen text-white bg-indigo-900">
                        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
                        <p className="mt-4 text-xl">AI đang sáng tạo câu hỏi, vui lòng chờ...</p>
                    </div>
                );
            case 'PLAYING':
                 if (!gameSettings) return <MainMenu onPlay={() => setGameState('SETUP')} onLeaderboard={() => setGameState('LEADERBOARD')} onDailyChallenge={() => setGameState('DAILY_CHALLENGE')} onProfile={() => setGameState('PROFILE')} />;
                return <GameScreen
                    key={gameSettings.gameMode}
                    gameSettings={gameSettings}
                    questions={questions}
                    players={players}
                    setPlayers={setPlayers}
                    currentPlayerIndex={currentPlayerIndex}
                    setCurrentPlayerIndex={setCurrentPlayerIndex}
                    onGameEnd={handleGameEnd}
                    lifelines={lifelines}
                    setLifelines={setLifelines}
                    isGamePaused={isPaused}
                    onPause={() => setIsPaused(true)}
                    isDarkMode={isDarkMode}
                    setIsDarkMode={setIsDarkMode}
                />;
            case 'DAILY_CHALLENGE':
                return <DailyChallengeScreen onBack={resetToMainMenu} />;
            case 'GAME_OVER':
                return <GameOverScreen players={players} onPlayAgain={() => setGameState('SETUP')} onMainMenu={resetToMainMenu} />;
            case 'LEADERBOARD':
                return <LeaderboardScreen onBack={resetToMainMenu} />;
            case 'PROFILE':
                return <ProfileScreen onBack={resetToMainMenu} />;
            default:
                return <div>Trạng thái không xác định</div>;
        }
    };

    return (
        <UserProvider>
            <div className="font-['Roboto',_sans-serif] min-h-screen bg-gray-100 dark:bg-slate-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
                {renderContent()}
                {isPaused && (gameState === 'PLAYING' || gameState === 'DAILY_CHALLENGE') && (
                    <PauseModal 
                        onResume={() => setIsPaused(false)}
                        onMainMenu={resetToMainMenu}
                    />
                )}
            </div>
        </UserProvider>
    );
};

export default App;
