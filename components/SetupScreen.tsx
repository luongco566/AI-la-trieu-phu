
import React, { useState } from 'react';
import { GameSettings, Difficulty, GameMode } from '../types';
import { TOPICS } from '../constants';

interface SetupScreenProps {
    onStartGame: (settings: GameSettings) => void;
    onBack: () => void;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ onStartGame, onBack }) => {
    const [gameMode, setGameMode] = useState<'single' | 'multi'>('multi');
    const [numPlayers, setNumPlayers] = useState(2);
    const [playerNames, setPlayerNames] = useState<string[]>(['Người chơi 1', 'Người chơi 2']);
    const [topic, setTopic] = useState<string>(TOPICS[0]);
    const [difficulty, setDifficulty] = useState<Difficulty>('mixed');
    const [numQuestions] = useState(15);
    const [timePerQuestion, setTimePerQuestion] = useState(30);
    const [hostMode, setHostMode] = useState<boolean>(false);

    const handleGameModeChange = (mode: 'single' | 'multi') => {
        setGameMode(mode);
        if (mode === 'single') {
            setNumPlayers(1);
            setPlayerNames(current => [current[0] || 'Người chơi 1']);
        } else {
            setNumPlayers(2);
            setPlayerNames(['Người chơi 1', 'Người chơi 2']);
        }
    }

    const handleNumPlayersChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const count = parseInt(e.target.value, 10);
        setNumPlayers(count);
        setPlayerNames(Array.from({ length: count }, (_, i) => playerNames[i] || `Người chơi ${i + 1}`));
    };

    const handlePlayerNameChange = (index: number, name: string) => {
        const newNames = [...playerNames];
        newNames[index] = name;
        setPlayerNames(newNames);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalPlayerNames = playerNames.map((name, index) => name.trim() === '' ? `Người chơi ${index + 1}` : name);
        onStartGame({ 
            numPlayers, 
            playerNames: finalPlayerNames, 
            topic, 
            difficulty, 
            numQuestions, 
            timePerQuestion,
            gameMode: hostMode ? 'host' : 'classic'
        });
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-2xl bg-white dark:bg-gray-800 shadow-2xl rounded-xl p-8 space-y-6 relative">
                <button onClick={onBack} className="absolute top-4 left-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
                    </svg>
                </button>
                <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Thiết lập trận đấu</h1>

                <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg p-1">
                    <button type="button" onClick={() => handleGameModeChange('single')} className={`flex-1 p-2 rounded-md transition-colors text-lg font-semibold ${gameMode === 'single' ? 'bg-indigo-600 text-white shadow' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                        Một người chơi
                    </button>
                    <button type="button" onClick={() => handleGameModeChange('multi')} className={`flex-1 p-2 rounded-md transition-colors text-lg font-semibold ${gameMode === 'multi' ? 'bg-indigo-600 text-white shadow' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                        Nhiều người chơi
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    {gameMode === 'multi' && (
                        <div>
                            <label htmlFor="numPlayers" className="block text-lg font-medium text-gray-700 dark:text-gray-300">Số người chơi</label>
                            <select id="numPlayers" value={numPlayers} onChange={handleNumPlayersChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                {[2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                        </div>
                    )}

                    <div className={gameMode === 'multi' ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "max-w-md mx-auto"}>
                        {Array.from({ length: numPlayers }).map((_, i) => (
                            <div key={i}>
                                <label htmlFor={`playerName${i}`} className="block text-lg font-medium text-gray-700 dark:text-gray-300">
                                    {gameMode === 'single' ? 'Tên người chơi' : `Tên người chơi ${i + 1}`}
                                </label>
                                <input
                                    type="text"
                                    id={`playerName${i}`}
                                    value={playerNames[i]}
                                    onChange={(e) => handlePlayerNameChange(i, e.target.value)}
                                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        ))}
                    </div>

                    <div>
                        <label htmlFor="topic" className="block text-lg font-medium text-gray-700 dark:text-gray-300">Chủ đề</label>
                        <select id="topic" value={topic} onChange={(e) => setTopic(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                            {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>

                    <div>
                         <label htmlFor="difficulty" className="block text-lg font-medium text-gray-700 dark:text-gray-300">Độ khó</label>
                        <select id="difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                            <option value="mixed">Tăng dần (mặc định)</option>
                            <option value="easy">Dễ</option>
                            <option value="medium">Trung bình</option>
                            <option value="hard">Khó</option>
                        </select>
                    </div>

                     <div>
                         <label htmlFor="time" className="block text-lg font-medium text-gray-700 dark:text-gray-300">Thời gian mỗi câu (giây)</label>
                        <select id="time" value={timePerQuestion} onChange={(e) => setTimePerQuestion(parseInt(e.target.value, 10))} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                            <option value="30">30</option>
                            <option value="45">45</option>
                            <option value="60">60</option>
                        </select>
                    </div>
                    
                    <div className="flex items-center justify-center p-2 bg-gray-200 dark:bg-gray-700 rounded-lg">
                        <label htmlFor="hostMode" className="flex items-center cursor-pointer">
                            <span className="mr-3 text-lg font-medium">Chế độ Dẫn chương trình (MC)</span>
                            <div className="relative">
                                <input type="checkbox" id="hostMode" className="sr-only" checked={hostMode} onChange={() => setHostMode(!hostMode)} />
                                <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${hostMode ? 'transform translate-x-full bg-purple-400' : ''}`}></div>
                            </div>
                        </label>
                    </div>


                    <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105">
                        Bắt đầu
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SetupScreen;
