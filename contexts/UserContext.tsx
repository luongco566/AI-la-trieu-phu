
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, Cosmetic } from '../types';
import { COSMETICS, LEVEL_UP_XP_THRESHOLD } from '../constants';

interface UserContextType {
    profile: UserProfile;
    addXp: (amount: number) => void;
    equipCosmetic: (cosmetic: Cosmetic) => void;
}

const defaultProfile: UserProfile = {
    id: 'localUser',
    name: 'Player',
    level: 1,
    xp: 0,
    coins: 0,
    ownedCosmetics: ['avatar_default'],
    equippedCosmetics: { avatar: COSMETICS.find(c => c.id === 'avatar_default')?.asset },
};

export const UserContext = createContext<UserContextType>({
    profile: defaultProfile,
    addXp: () => {},
    equipCosmetic: () => {},
});

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [profile, setProfile] = useState<UserProfile>(() => {
        try {
            const savedProfile = localStorage.getItem('userProfile');
            return savedProfile ? JSON.parse(savedProfile) : defaultProfile;
        } catch (error) {
            return defaultProfile;
        }
    });

    useEffect(() => {
        localStorage.setItem('userProfile', JSON.stringify(profile));
    }, [profile]);

    const addXp = (amount: number) => {
        setProfile(prevProfile => {
            let newXp = prevProfile.xp + amount;
            let newLevel = prevProfile.level;
            let newOwned = [...prevProfile.ownedCosmetics];

            let xpThreshold = LEVEL_UP_XP_THRESHOLD(newLevel);
            while (newXp >= xpThreshold) {
                newXp -= xpThreshold;
                newLevel++;
                
                // Check for cosmetic unlocks
                const unlocked = COSMETICS.filter(c => c.levelReq === newLevel);
                unlocked.forEach(item => {
                    if (!newOwned.includes(item.id)) {
                        newOwned.push(item.id);
                        // TODO: Add a notification for unlocking new item
                    }
                });

                xpThreshold = LEVEL_UP_XP_THRESHOLD(newLevel);
            }

            return { ...prevProfile, xp: newXp, level: newLevel, ownedCosmetics: newOwned };
        });
    };
    
    const equipCosmetic = (cosmetic: Cosmetic) => {
        if (cosmetic.type === 'avatar') {
            setProfile(prev => ({
                ...prev,
                equippedCosmetics: {
                    ...prev.equippedCosmetics,
                    avatar: cosmetic.asset,
                },
            }));
        }
    };


    return (
        <UserContext.Provider value={{ profile, addXp, equipCosmetic }}>
            {children}
        </UserContext.Provider>
    );
};
