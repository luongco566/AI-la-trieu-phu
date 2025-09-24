import React from 'react';
import { Player } from '../types';

interface GameOverScreenProps {
    players: Player[];
    onPlayAgain: () => void;
    onMainMenu: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ players, onPlayAgain, onMainMenu }) => {
    // Single Player View
    if (players.length === 1) {
        const player = players[0];
        const hasWonSomething = player.finalPrize > 0;
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-indigo-900 text-white p-4 text-center">
                <div className="w-full max-w-2xl bg-black bg-opacity-50 p-10 rounded-2xl shadow-2xl border border-purple-600">
                    <h1 className="text-5xl font-bold mb-4 text-yellow-400">
                        {hasWonSomething ? "Chúc mừng!" : "Trò chơi kết thúc"}
                    </h1>
                    <p className="text-2xl mb-8">{player.name}</p>
                    <p className="text-xl text-gray-300">Bạn đã giành được</p>
                    <p className="text-6xl font-bold text-green-400 my-4 animate-pulse">
                        {player.finalPrize.toLocaleString('vi-VN')} VNĐ
                    </p>
                    <div className="mt-10 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                        <button onClick={onPlayAgain} className="px-8 py-3 text-lg font-bold text-white bg-purple-600 rounded-lg shadow-lg hover:bg-purple-700 transition-transform transform hover:scale-105">
                            Chơi lại
                        </button>
                        <button onClick={onMainMenu} className="px-8 py-3 text-lg font-bold text-white bg-gray-600 rounded-lg shadow-lg hover:bg-gray-700 transition-transform transform hover:scale-105">
                            Về Menu chính
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    
    // Multi Player View
    const sortedPlayers = [...players].sort((a, b) => b.finalPrize - a.finalPrize);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-indigo-900 text-white p-4">
            <div className="w-full max-w-3xl bg-black bg-opacity-50 p-8 rounded-2xl shadow-2xl border border-purple-600">
                <h1 className="text-5xl font-bold text-center mb-8 text-yellow-400">Kết quả</h1>
                <div className="space-y-4">
                    {sortedPlayers.map((player, index) => (
                        <div key={player.id} className={`flex justify-between items-center p-4 rounded-lg ${index === 0 ? 'bg-yellow-500/30 border-2 border-yellow-400' : 'bg-indigo-900/50'}`}>
                            <div className="flex items-center">
                                <span className={`text-2xl font-bold mr-4 ${index === 0 ? 'text-yellow-300' : 'text-gray-400'}`}>#{index + 1}</span>
                                <span className="text-xl font-semibold">{player.name}</span>
                            </div>
                            <span className="text-xl font-bold text-green-400">{player.finalPrize.toLocaleString('vi-VN')} VNĐ</span>
                        </div>
                    ))}
                </div>
                <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                    <button onClick={onPlayAgain} className="px-8 py-3 text-lg font-bold text-white bg-purple-600 rounded-lg shadow-lg hover:bg-purple-700 transition-transform transform hover:scale-105">
                        Chơi lại
                    </button>
                    <button onClick={onMainMenu} className="px-8 py-3 text-lg font-bold text-white bg-gray-600 rounded-lg shadow-lg hover:bg-gray-700 transition-transform transform hover:scale-105">
                        Về Menu chính
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GameOverScreen;