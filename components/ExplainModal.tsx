
import React from 'react';

interface ExplainModalProps {
    content: string;
    onClose: () => void;
}

const ExplainModal: React.FC<ExplainModalProps> = ({ content, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 p-6 rounded-lg shadow-2xl w-full max-w-2xl border-2 border-green-500">
                <h2 className="text-2xl font-bold text-center mb-4 text-green-400">Giải thích chi tiết</h2>
                <div 
                    className="prose prose-invert max-h-[60vh] overflow-y-auto p-4 bg-gray-900/50 rounded-md text-gray-300" 
                    dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }}
                />
                <div className="mt-6 text-center">
                    <button onClick={onClose} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold">
                        Đã hiểu
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExplainModal;
