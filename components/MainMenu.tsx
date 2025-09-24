
import React from 'react';

interface MainMenuProps {
    onPlay: () => void;
    onLeaderboard: () => void;
    onDailyChallenge: () => void;
    onProfile: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onPlay, onLeaderboard, onDailyChallenge, onProfile }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-indigo-900 text-white p-4">
            <div className="text-center space-y-8">
                <div className="relative">
                     <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-75"></div>
                     <h1 className="relative text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 py-2 px-4">
                        Ai là Triệu Phú
                    </h1>
                </div>
                <p className="text-2xl font-semibold text-yellow-400">AI Edition</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <button
                        onClick={onPlay}
                        className="px-8 py-4 text-xl font-bold text-white bg-purple-600 rounded-lg shadow-lg hover:bg-purple-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300"
                    >
                        Chơi Cổ điển
                    </button>
                    <button
                        onClick={onDailyChallenge}
                        className="px-8 py-4 text-xl font-bold text-white bg-teal-600 rounded-lg shadow-lg hover:bg-teal-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-teal-300"
                    >
                        Thử thách Hàng ngày
                    </button>
                    <button
                        onClick={onLeaderboard}
                        className="px-8 py-4 text-xl font-bold text-white bg-pink-600 rounded-lg shadow-lg hover:bg-pink-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-pink-300"
                    >
                        Bảng xếp hạng
                    </button>
                    <button
                        onClick={onProfile}
                        className="px-8 py-4 text-xl font-bold text-white bg-sky-600 rounded-lg shadow-lg hover:bg-sky-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-sky-300"
                    >
                        Hồ sơ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MainMenu;
