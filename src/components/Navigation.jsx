import React from 'react';
import Logo from './Logo';

const Navigation = () => {
  return (
    <header className="simple-header">
      <div className="nav-container">
        <div className="simple-nav">
          <div className="nav-logo">
            <Logo />
          </div>
          <button className="get-glm-btn">
            Get GLM
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navigation;