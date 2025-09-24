
import React, { useContext, useState } from 'react';
import { UserContext } from '../contexts/UserContext';
import { COSMETICS, LEVEL_UP_XP_THRESHOLD } from '../constants';
import HeatmapScreen from './HeatmapScreen';

interface ProfileScreenProps {
    onBack: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onBack }) => {
    const { profile, equipCosmetic } = useContext(UserContext);
    const [activeTab, setActiveTab] = useState<'profile' | 'analytics'>('profile');

    const xpForNextLevel = LEVEL_UP_XP_THRESHOLD(profile.level);
    const xpProgressPercent = Math.round((profile.xp / xpForNextLevel) * 100);

    return (
        <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-gray-900 to-indigo-900 text-white p-4">
            <div className="w-full max-w-4xl bg-black bg-opacity-50 p-6 rounded-2xl shadow-2xl border border-sky-600 relative">
                <button onClick={onBack} className="absolute top-4 left-4 text-gray-400 hover:text-white">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
                    </svg>
                </button>
                <h1 className="text-4xl font-bold text-center mb-2 text-sky-400">Hồ sơ & Phân tích</h1>
                
                <div className="flex justify-center border-b border-gray-700 mb-4">
                    <button onClick={() => setActiveTab('profile')} className={`px-4 py-2 text-lg font-semibold ${activeTab === 'profile' ? 'text-sky-400 border-b-2 border-sky-400' : 'text-gray-400'}`}>Hồ sơ</button>
                    <button onClick={() => setActiveTab('analytics')} className={`px-4 py-2 text-lg font-semibold ${activeTab === 'analytics' ? 'text-sky-400 border-b-2 border-sky-400' : 'text-gray-400'}`}>Phân tích</button>
                </div>

                {activeTab === 'profile' && (
                    <div>
                        <div className="flex flex-col md:flex-row items-center bg-indigo-900/40 p-6 rounded-lg mb-6">
                            <img src={profile.equippedCosmetics.avatar} alt="Avatar" className="w-24 h-24 rounded-full border-4 border-sky-500 shadow-lg"/>
                            <div className="md:ml-6 mt-4 md:mt-0 text-center md:text-left w-full">
                                <h2 className="text-3xl font-bold">{profile.name}</h2>
                                <p className="text-xl font-semibold text-yellow-400">Cấp độ {profile.level}</p>
                                <div className="w-full bg-gray-700 rounded-full h-4 mt-2">
                                    <div className="bg-gradient-to-r from-sky-500 to-cyan-400 h-4 rounded-full" style={{width: `${xpProgressPercent}%`}}></div>
                                </div>
                                <p className="text-sm text-right mt-1">{profile.xp} / {xpForNextLevel} XP</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-2xl font-semibold mb-4">Avatar đã mở khóa</h3>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                                {COSMETICS.map(cosmetic => {
                                    const isOwned = profile.ownedCosmetics.includes(cosmetic.id);
                                    const isEquipped = profile.equippedCosmetics.avatar === cosmetic.asset;
                                    return (
                                        <div key={cosmetic.id} className="text-center">
                                            <button 
                                                onClick={() => isOwned && equipCosmetic(cosmetic)}
                                                disabled={!isOwned}
                                                className={`w-24 h-24 rounded-full p-1 transition-all duration-200 ${isEquipped ? 'bg-gradient-to-tr from-sky-500 to-cyan-400' : 'bg-gray-700'} ${isOwned ? 'cursor-pointer hover:scale-105' : 'opacity-50'}`}
                                            >
                                                <img src={cosmetic.asset} alt={cosmetic.name} className="w-full h-full rounded-full" />
                                            </button>
                                            <p className="mt-2 text-sm font-medium">{cosmetic.name}</p>
                                            {!isOwned && <p className="text-xs text-gray-400">Mở ở cấp {cosmetic.levelReq}</p>}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'analytics' && (
                   <HeatmapScreen />
                )}

            </div>
        </div>
    );
};

export default ProfileScreen;
