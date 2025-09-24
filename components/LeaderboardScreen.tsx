import React, { useState, useEffect } from 'react';
import { LeaderboardEntry } from '../types';

interface LeaderboardScreenProps {
    onBack: () => void;
}

const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ onBack }) => {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

    useEffect(() => {
        const storedLeaderboard = JSON.parse(localStorage.getItem('millionaireLeaderboard') || '[]') as LeaderboardEntry[];
        setLeaderboard(storedLeaderboard);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-indigo-900 text-white p-4">
            <div className="w-full max-w-3xl bg-black bg-opacity-50 p-8 rounded-2xl shadow-2xl border border-pink-600">
                <h1 className="text-5xl font-bold text-center mb-8 text-pink-400">Bảng Xếp Hạng</h1>
                {leaderboard.length > 0 ? (
                    <div className="space-y-3">
                        {leaderboard.map((entry, index) => (
                             <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-indigo-900/50">
                                <div className="flex items-center">
                                     <span className={`text-xl font-bold w-10 text-center mr-4 ${
                                        index === 0 ? 'text-yellow-400' : 
                                        index === 1 ? 'text-gray-300' : 
                                        index === 2 ? 'text-yellow-600' : 'text-gray-500'}`}>{index + 1}</span>
                                    <div className="flex flex-col">
                                         <span className="text-lg font-semibold">{entry.name}</span>
                                         <span className="text-xs text-gray-400">{entry.date}</span>
                                    </div>
                                </div>
                                 <span className="text-lg font-bold text-green-400">{entry.score.toLocaleString('vi-VN')} VNĐ</span>
                             </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-400 text-lg">Chưa có ai ghi danh vào bảng vàng. Hãy là người đầu tiên!</p>
                )}
                <div className="mt-8 flex justify-center">
                    <button onClick={onBack} className="px-8 py-3 text-lg font-bold text-white bg-gray-600 rounded-lg shadow-lg hover:bg-gray-700 transition-transform transform hover:scale-105">
                        Quay lại
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LeaderboardScreen;