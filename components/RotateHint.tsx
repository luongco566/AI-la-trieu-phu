import React from 'react';

interface RotateHintProps {
  onContinuePortrait: () => void;
}

const RotateHint: React.FC<RotateHintProps> = ({ onContinuePortrait }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 text-gray-900 portrait:flex landscape:hidden">
      <div className="bg-white rounded-2xl p-6 max-w-sm text-center space-y-4 m-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-indigo-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 12l3.525 3.525L15.25 12" transform="rotate(-90 12 12)" />
        </svg>
        <h2 className="text-2xl font-bold">Vui lòng xoay ngang thiết bị</h2>
        <p className="text-gray-600">Trò chơi sẽ có trải nghiệm tốt nhất ở chế độ màn hình ngang.</p>
        <button
          onClick={onContinuePortrait}
          className="w-full px-4 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-transform transform hover:scale-105"
        >
          Tiếp tục ở màn hình dọc
        </button>
      </div>
    </div>
  );
};

export default RotateHint;
