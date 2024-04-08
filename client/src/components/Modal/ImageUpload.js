const ImageUpload = ({field, handleImageSelect}) => {

  const inputProps = {
    className: "fields-modal__input",
    placeholder: field.placeholder,
    required: field.required,
    onChange: handleImageSelect,
    accept: "image/jpeg, image/png, image/jpg"
  };

  return (
    <>
      <input type="file" {...inputProps} />
    </>
  );
};

export default ImageUpload;
