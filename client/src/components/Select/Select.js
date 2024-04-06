import React, { useEffect, useState } from 'react';
import "./Select.scss";
import { ReactComponent as DownArrow } from "../../icons/arrow.svg";
import { ReactComponent as Icon } from "../../icons/home.svg";

const SelectField = ({isForum = false, options = null, setType = null}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setType && setType(option.id);
    setSelectedOption(option);
    setIsOpen(false);
  };

  const handleEscape = (event) => {
    if (event.keyCode === 27) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    setSelectedOption(options[0]);
  }, [options]);
  

  return (
    (options.length > 0 || (isForum && options.length > 1)) && <div className={`dropdown-container ${isForum ? 'isForums' : ''}`}>
      <div className={`dropdown-header ${isOpen ? 'open' : ''}`} onClick={toggleDropdown}>
        {selectedOption ? selectedOption.name : options[0]?.name}
        <DownArrow />
      </div>
      {isOpen && (
        <div className="dropdown-options">
          {options.map(option => (
              isForum ? (
                <div
                  key={option.id}
                  className="dropdown-option"
                  onClick={() => handleOptionClick(option)}
                >
                <Icon />
                  {option.name}
                </div>
              ) : (
                <div
                  key={option.id}
                  className="dropdown-option"
                  onClick={() => handleOptionClick(option)}
                >
                  {option.name}
                  <div className={`dropdown-option-icon ${option.id}`}></div>
                </div>
              )
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectField;
