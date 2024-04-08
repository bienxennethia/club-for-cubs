const ImageUpload = ({field, handleImageChange}) => {

  const inputProps = {
    className: "fields-modal__input",
    placeholder: field.placeholder,
    required: field.required,
    onChange: handleImageChange,
    accept: "image/jpeg, image/png, image/jpg"
  };

  return (
    <>
      <input type="file" {...inputProps}/>
    </>
  );
};

export default ImageUpload;
