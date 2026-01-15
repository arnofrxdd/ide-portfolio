import React from 'react';

export const CustomScrollbarStyles = () => (
  <style>{`
    /* --- AUTHENTIC VS CODE SCROLLBAR ENGINE --- */
    
    /* 1. Universal Thin Look & Hit Area */
    ::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }

    /* 2. Invisible track */
    ::-webkit-scrollbar-track {
      background: transparent;
    }

    /* 3. The "Ghost" Thumb: Invisible by default */
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background-color: transparent;
      border: 2px solid transparent;
      background-clip: content-box;
      transition: background-color 0.2s ease;
    }

    /* 4. Appear ONLY when the specific container is hovered */
    .custom-scrollbar:hover::-webkit-scrollbar-thumb {
      background-color: rgba(121, 121, 121, 0.3) !important;
    }

    /* 5. Target hover: Darker when specifically hovering the scrollbar thumb */
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background-color: rgba(121, 121, 121, 0.6) !important;
    }

    /* 6. Active state: Even darker */
    .custom-scrollbar::-webkit-scrollbar-thumb:active {
      background-color: rgba(121, 121, 121, 0.8) !important;
    }

    /* 7. Corner Fix */
    ::-webkit-scrollbar-corner {
      background: transparent;
    }

    /* Firefox Support (Limited) */
    * {
      scrollbar-width: thin;
      scrollbar-color: rgba(121, 121, 121, 0.3) transparent;
    }

    @keyframes blink {
      0%, 49% { opacity: 1; }
      50%, 100% { opacity: 0; }
    }

    .dragging * {
      user-select: none !important;
    }
  `}</style>
);
