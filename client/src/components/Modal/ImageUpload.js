import { useCommonState } from "../../data/commonState";
const ImageUpload = ({field, handleImageChange}) => {
  const {isLoading, disableField} = useCommonState();

  const inputProps = {
    className: "fields-modal__input",
    placeholder: field.placeholder,
    required: field.required,
    onChange: handleImageChange,
    accept: "image/jpeg, image/png, image/jpg",
    disabled: isLoading || disableField,
  };

  return (
    <>
      <input type="file" {...inputProps}/>
    </>
  );
};

export default ImageUpload;
