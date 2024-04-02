import { useState } from 'react';

const SelectField = ({ field }) => {
  const [value, setValue] = useState(field.value || '');

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <select
      className="fields-modal__input"
      name={field.name}
      required={field.required}
      value={value}
      onChange={handleChange}
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
