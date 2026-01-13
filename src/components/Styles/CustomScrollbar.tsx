import React from 'react';

export const CustomScrollbarStyles = () => (
    <style>{`
    /* Webkit browsers (Chrome, Safari, Edge) */
    ::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }
    ::-webkit-scrollbar-track {
      background: transparent; 
    }
    ::-webkit-scrollbar-thumb {
      background: var(--border); 
      border-radius: 5px;
      border: 2px solid transparent;
      background-clip: content-box;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #475569; 
      border: 2px solid transparent;
      background-clip: content-box;
    }
    ::-webkit-scrollbar-corner {
      background: transparent;
    }
    @keyframes blink {
      0%, 49% { opacity: 1; }
      50%, 100% { opacity: 0; }
    }
.dragging * {
  user-select: none !important;
}

    /* Firefox */
    * {
      scrollbar-width: thin;
      scrollbar-color: var(--border) transparent;
    }
  `}</style>
);
