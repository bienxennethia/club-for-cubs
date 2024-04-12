import { useState } from 'react';

import { useCommonState } from '../../data/commonState';

const SelectField = ({ field }) => {
  const [value, setValue] = useState(field.value || '');
  const { isLoading, disableField } = useCommonState();

  const handleChange = (e) => {
    // remove validity
    const input = document.querySelector(`.fields-modal__input[name="${field.name}"]`);
    if (input) {
      input.setCustomValidity('');
    }
    setValue(e.target.value);
  };

  return (
    <select
      className="fields-modal__input"
      name={field.name}
      required={field.required}
      value={value}
      onChange={handleChange}
      disabled={isLoading || disableField}
    >
      {field.options.map((option, index) => (
        <option key={index} value={option.id}>
          {option.name}
        </option>
      ))}
    </select>
  );
};

export default SelectField;
