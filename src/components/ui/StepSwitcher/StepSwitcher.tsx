import React from 'react';
import './StepSwitcher.scss';

interface StepSwitcherProps {
  options: string[];
  activeOption: string;
  onOptionChange: (option: string) => void;
  children?: React.ReactNode;
}

const StepSwitcher: React.FC<StepSwitcherProps> = ({
  options,
  activeOption,
  onOptionChange,
  children,
}) => {
  return (
    <div className="step-switcher-wrapper">
      <div className="step-navigation">
        <div className="step-switcher-container">
          {options.map((option) => (
            <button
              key={option}
              className={`step-button ${activeOption === option ? 'active' : ''}`}
              onClick={() => onOptionChange(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <div className="step-content-box">
        {children}
      </div>
    </div>
  );
};

export default StepSwitcher;
