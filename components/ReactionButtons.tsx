
import React, { useCallback } from 'react';

const ReactionButtons: React.FC = () => {
    
    const showReaction = useCallback((emoji: string) => {
        const reactionEl = document.createElement('div');
        reactionEl.innerHTML = emoji;
        reactionEl.style.position = 'fixed';
        reactionEl.style.left = `${Math.random() * 80 + 10}%`;
        reactionEl.style.bottom = '80px';
        reactionEl.style.fontSize = `${Math.random() * 24 + 24}px`;
        reactionEl.style.opacity = '1';
        reactionEl.style.transition = 'transform 3s ease-out, opacity 3s ease-out';
        reactionEl.style.pointerEvents = 'none';
        reactionEl.style.zIndex = '100';

        document.body.appendChild(reactionEl);

        requestAnimationFrame(() => {
             reactionEl.style.transform = `translateY(-300px) rotate(${Math.random() * 360 - 180}deg)`;
             reactionEl.style.opacity = '0';
        });

        setTimeout(() => {
            reactionEl.remove();
        }, 3000);

    }, []);

    const reactions = ['👏', '🎉', '😮', '😭', '💡'];

    return (
        <div className="fixed bottom-5 right-5 bg-gray-800/50 p-2 rounded-full shadow-lg flex space-x-2 backdrop-blur-sm z-40">
            {reactions.map(emoji => (
                <button 
                    key={emoji}
                    onClick={() => showReaction(emoji)}
                    className="w-10 h-10 text-2xl rounded-full hover:bg-gray-700/50 transition-colors"
                >
                    {emoji}
                </button>
            ))}
        </div>
    );
};

export default ReactionButtons;
