import React from 'react';
import { useAppStore } from '../global-store';

const Modal: React.FC = () => {
    const { setIsAuth, setIsManager } = useAppStore();
  return (
    <div
      className="flex items-center justify-center h-screen bg-gray-100"
      style={{ position: 'fixed', top: 0, left: 0, width: '20%', height: '10%', zIndex: 9999 }}
    >
      <div
        className="w-[300px] h-[100px] rounded-2xl flex overflow-hidden shadow-lg"
        style={{
          background: 'linear-gradient(135deg, #1C4B4B, #f5f2e0ff)',
        }}
      >
        <button
          className="flex-1 h-full text-white font-bold text-lg transition-colors duration-300 hover:bg-white/20"
          style={{
            background: 'linear-gradient(135deg, #1C4B4B, #2a6a6a)',
          }}
            onClick={() => {setIsAuth && setIsAuth(true); setIsManager && setIsManager(false);}}
        >
          User
        </button>
        <button
          className="flex-1 h-full text-[#1C4B4B] font-bold text-lg transition-colors duration-300 hover:bg-white/20"
          style={{
            background: 'linear-gradient(135deg, #f5f2e0ff, #e0d9b8)',
          }}
            onClick={() => {setIsAuth && setIsAuth(true); setIsManager && setIsManager(true);}}
        >
          Manager
        </button>
      </div>
    </div>
  );
};

export default Modal;