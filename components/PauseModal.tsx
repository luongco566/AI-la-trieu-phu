
import React from 'react';

interface PauseModalProps {
    onResume: () => void;
    onMainMenu: () => void;
}

const PauseModal: React.FC<PauseModalProps> = ({ onResume, onMainMenu }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-10 rounded-lg shadow-2xl w-full max-w-sm mx-4 text-center border-2 border-purple-500">
                <h2 className="text-4xl font-bold mb-8 text-yellow-400">Tạm dừng</h2>
                <div className="flex flex-col space-y-4">
                    <button 
                        onClick={onResume}
                        className="px-8 py-3 text-lg font-bold text-white bg-green-600 rounded-lg shadow-lg hover:bg-green-700 transition-transform transform hover:scale-105"
                    >
                        Tiếp tục
                    </button>
                    <button 
                        onClick={onMainMenu}
                        className="px-8 py-3 text-lg font-bold text-white bg-gray-600 rounded-lg shadow-lg hover:bg-gray-700 transition-transform transform hover:scale-105"
                    >
                        Về Menu chính
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PauseModal;
