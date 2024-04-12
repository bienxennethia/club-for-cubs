import { useState } from 'react';

import { useCommonState } from '../../data/commonState';

const InputField = ({ field }) => {
  const [value, setValue] = useState(field.value || '');
  const {isLoading,disableField} = useCommonState();
  // remove validity when on change
  const onChange = (e) => {
    const input = document.querySelector(`.fields-modal__input[name="${field.name}"]`);
    if (input) {
      input.setCustomValidity('');
    }
    setValue(e.target.value);
  };

  const inputProps = {
    className: "fields-modal__input",
    name: field.name,
    placeholder: field.placeholder,
    required: field.required,
    value: field.type === 'file' ? '' : value,
    onChange: onChange,
    disabled: isLoading || disableField,
  };

  return field.type === 'textarea' ? (
    <textarea {...inputProps} />
  ) : (
    <input type={field.type} {...inputProps}  />
  );
};

export default InputField;
