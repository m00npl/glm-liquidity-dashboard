import React from 'react';

const ChainLogo = ({ chain, size = 20 }) => {
  const getChainLogo = (chainName) => {
    const logos = {
      'Ethereum': (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="16" fill="#627EEA"/>
          <path d="M16.498 4v8.87l7.497 3.35-7.497-12.22z" fill="#FFFFFF" opacity="0.602"/>
          <path d="M16.498 4L9 16.22l7.498-3.35V4z" fill="#FFFFFF"/>
          <path d="M16.498 21.968v6.027L24 17.616l-7.502 4.352z" fill="#FFFFFF" opacity="0.602"/>
          <path d="M16.498 27.995v-6.028L9 17.616l7.498 10.38z" fill="#FFFFFF"/>
          <path d="M16.498 20.573l7.497-4.353-7.497-3.348v7.701z" fill="#FFFFFF" opacity="0.2"/>
          <path d="M9 16.22l7.498 4.353v-7.701L9 16.22z" fill="#FFFFFF" opacity="0.602"/>
        </svg>
      ),
      'Arbitrum': (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="16" fill="#2D374B"/>
          <path d="M16.5 8L24 20H21L16.5 12L12 20H9L16.5 8Z" fill="#28A0F0"/>
          <path d="M21 20L24 24H18L21 20Z" fill="#96BEDC"/>
          <path d="M9 20L12 24H6L9 20Z" fill="#96BEDC"/>
        </svg>
      ),
      'Optimism': (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="16" fill="#FF0420"/>
          <path d="M12.5 11C9.5 11 7 13.5 7 16.5C7 19.5 9.5 22 12.5 22H14.5C15.3 22 16 21.3 16 20.5C16 19.7 15.3 19 14.5 19H12.5C11.1 19 10 17.9 10 16.5C10 15.1 11.1 14 12.5 14H19.5C22.5 14 25 16.5 25 19.5C25 22.5 22.5 25 19.5 25H17.5C16.7 25 16 24.3 16 23.5C16 22.7 16.7 22 17.5 22H19.5C20.9 22 22 20.9 22 19.5C22 18.1 20.9 17 19.5 17H12.5C9.5 17 7 14.5 7 11.5C7 8.5 9.5 6 12.5 6H19.5C20.3 6 21 6.7 21 7.5C21 8.3 20.3 9 19.5 9H12.5C11.1 9 10 10.1 10 11.5C10 12.9 11.1 14 12.5 14Z" fill="white"/>
        </svg>
      ),
      'Base': (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="16" fill="#0052FF"/>
          <path d="M16 25C21.523 25 26 20.523 26 15C26 9.477 21.523 5 16 5C11.2 5 7.204 8.533 6.18 13H20V17H6.18C7.204 21.467 11.2 25 16 25Z" fill="white"/>
        </svg>
      ),
      'Polygon PoS': (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="16" fill="#8247E5"/>
          <path d="M21.5 12.5L18.5 10.5C18.2 10.3 17.8 10.3 17.5 10.5L14.5 12.5L12.5 13.8L9.5 15.8C9.2 16 8.8 16 8.5 15.8L6.5 14.5C6.2 14.3 6 13.9 6 13.5V11C6 10.6 6.2 10.2 6.5 10L8.5 8.7C8.8 8.5 9.2 8.5 9.5 8.7L11.5 10C11.8 10.2 12 10.6 12 11V12.5L14 11.2V9.5C14 9.1 13.8 8.7 13.5 8.5L9.5 6C9.2 5.8 8.8 5.8 8.5 6L4.5 8.5C4.2 8.7 4 9.1 4 9.5V14.5C4 14.9 4.2 15.3 4.5 15.5L8.5 18C8.8 18.2 9.2 18.2 9.5 18L12.5 16.5L14.5 15.2L17.5 13.2C17.8 13 18.2 13 18.5 13.2L20.5 14.5C20.8 14.7 21 15.1 21 15.5V18C21 18.4 20.8 18.8 20.5 19L18.5 20.3C18.2 20.5 17.8 20.5 17.5 20.3L15.5 19C15.2 18.8 15 18.4 15 18V16.5L13 17.8V19.5C13 19.9 13.2 20.3 13.5 20.5L17.5 23C17.8 23.2 18.2 23.2 18.5 23L22.5 20.5C22.8 20.3 23 19.9 23 19.5V14.5C23 14.1 22.8 13.7 22.5 13.5L21.5 12.5Z" fill="white"/>
        </svg>
      ),
      'Linea': (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="16" fill="#121212"/>
          <path d="M8 12H24V14H8V12ZM8 15H20V17H8V15ZM8 18H24V20H8V18Z" fill="#61DFFF"/>
        </svg>
      ),
      'zkSync Era': (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="16" fill="#1E69FF"/>
          <path d="M16 6L8 16H16L24 16L16 26V16H8L16 6Z" fill="white"/>
        </svg>
      ),
      'Scroll': (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="16" fill="#FFEEDA"/>
          <path d="M11 9C9.9 9 9 9.9 9 11V21C9 22.1 9.9 23 11 23H21C22.1 23 23 22.1 23 21V11C23 9.9 22.1 9 21 9H11ZM19 14L16 17L13 14H19Z" fill="#EB7C39"/>
        </svg>
      )
    };

    return logos[chainName] || (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="16" fill="#6B7280"/>
        <text x="16" y="20" textAnchor="middle" fontSize="12" fill="white">?</text>
      </svg>
    );
  };

  return (
    <div className="chain-logo" style={{ display: 'inline-flex', alignItems: 'center' }}>
      {getChainLogo(chain)}
    </div>
  );
};

export default ChainLogo;