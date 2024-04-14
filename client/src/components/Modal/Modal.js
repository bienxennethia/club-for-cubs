import "./Modal.scss";
import { useEffect, useState } from "react";
import { ReactComponent as Logo } from "../../icons/logo.svg";
import { ReactComponent as Close } from "../../icons/close.svg";
import InputField from "./InputField";
import SelectField from "./SelectField";
import ImageUpload from "./ImageUpload";
import { useCommonState } from "../../data/commonState";
const Modal = () => {
  const { modalIdOpen, modalContent, closeModal, response, toggleSave, clearFields, isDeleteModal, deleteModal, toggleModal, isLoading, disableField, isLoggedIn } = useCommonState();

  const [image, setImage] = useState(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      closeModal();
    }

    if (event.key === 'Enter') {
      const submitBtn = document.querySelector(`.modal__btn--submit`);
      if (submitBtn) {
        submitBtn.click();
      }
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const previewFiles = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result);
    };
  };

  const handleImageChange = (event) => {
    const selectedFile = event.target.files[0];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (selectedFile && allowedTypes.includes(selectedFile.type)) {
      previewFiles(selectedFile);
    }

    const input = document.querySelector(`.fields-modal__input[type="file"]`);
    if (input) {
      input.setCustomValidity('');
    }
  };

  const clearFieldsHandler = () => {
    clearFields();
  };

  const registerHandler = async () => {
    toggleModal('signup');
  };

  const getBtnText = () => {
    switch (modalContent?.id) {
      case "addClub":
      case "addForum":
        return "Add";
      case "editClub":
      case "editForum":
      case "profile":
      case "changePassword":
        return "Update";
      case "login":
        return "Login";
      default:
        return "Register";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    if ((modalContent?.id === "signup" && !isLoggedIn) || modalContent?.id === "changePassword") {
      const passwordField = event.target.querySelector('[name="password"]');
      passwordField.setCustomValidity('');
      const confirmPasswordField = event.target.querySelector('[name="confirm_password"]');
      confirmPasswordField.setCustomValidity('');

      const password = formData.get("password");
      const hasNumber = /\d/.test(password);
      const hasLetter = /[a-zA-Z]/.test(password);
      const hasSymbol = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
      
      if (password.length < 8) {
        passwordField.setCustomValidity('Password must be at least 8 characters long');
        passwordField.reportValidity();
        return;
      }

      if (!hasNumber || !hasLetter || !hasSymbol) {
        passwordField.setCustomValidity('Password must contain at least one number, one letter, and one symbol');
        passwordField.reportValidity();
        return;
      } else {
        passwordField.setCustomValidity('');
      }

      if (formData.get("password") !== formData.get("confirm_password")) {
        confirmPasswordField.setCustomValidity('Passwords do not match');
        confirmPasswordField.reportValidity();
        return;
      } else {
        confirmPasswordField.setCustomValidity('');
      }
    }
    toggleSave(formData, image);
  };

  return (
    modalIdOpen && <div className={`modal ${modalContent?.class ? modalContent?.class : ''} ${isDeleteModal ? 'modal--delete' : ''}`}>
      <div className="modal__container container">
        <div className="modal__container-content">
          <button onClick={closeModal} className="modal__close-btn"><Close /></button>
          <div className="modal__logo">
            <Logo className="logo"/>
          </div>
          {!isDeleteModal &&
            <div className="modal__content">
              <div className="modal__header">
                {
                  modalContent?.content.title && <h1 className="modal__title">{modalContent?.content.title}</h1>
                }
                {
                  modalContent?.content.subtitle && <p className="modal__subtitle">{modalContent?.content.subtitle}</p>
                }
                {
                  modalContent?.content.description && <p className="modal__description">{modalContent?.content.description}</p>
                }
                {
                  modalContent?.id === "addClub" && <p className="modal__description">Note: Officers can be add on the club detail page.</p>
                }
                <p className="modal__description">*required fields</p>
              </div>
              <form onSubmit={handleSubmit} className="modal__fields fields">
                {modalContent?.content.fields.map((field) => (
                  <div className="fields-modal__field field" key={field.name}>
                    {
                      field.label && (
                        <label className="fields-modal__label">
                          <span className="fields-modal__label-text">
                            {field.label} 
                            {field.required && <span className="fields-modal__required">*</span>}
                          </span> 
                          {field.placeholderText && <span>({field.placeholderText})</span>}
                        </label>
                      )
                    }
                    {field.type === "file" && <ImageUpload field={field} handleImageChange={handleImageChange} />}
                    {field.type === "select" && <SelectField field={field} /> }
                    {(field.type === "text" || field.type === "textarea" || field.type === "password" || field.type === "email") && <InputField field={field} /> }
                    {field.type === "hidden" && <input type="hidden" name={field.name} value={field.value} /> }
                  </div>
                ))}
                <div className="modal__footer">
                  <p className="modal__response">{response?.message}</p>
                </div>
                <div className="modal__actions">
                  {modalContent?.id === "login" && <button className="modal__btn btn" onClick={registerHandler} disabled={isLoading}>Register</button> 
                  }
                  <button className="modal__btn btn modal__btn--submit" disabled={isLoading || disableField} type="submit">{isLoading ? 'Loading...' : getBtnText()}</button>
                  { !disableField && <button className="modal__btn btn clear" onClick={clearFieldsHandler} disabled={isLoading} >Clear</button> }
                  { disableField && <button className="modal__btn btn clear" onClick={closeModal} disabled={isLoading} >Close</button> }
                </div>
              </form>
            </div>
          }
          {
            isDeleteModal && 
            <div className="modal__content">
              <p>Are you sure you want to delete?</p>
              
              <div className="modal__actions">
                    <button className="modal__btn btn" onClick={deleteModal} disabled={isLoading}>{isLoading ? 'Loading...' : 'Yes'}</button>
                    <button className="modal__btn btn clear" onClick={closeModal} disabled={isLoading}>No</button>
                  </div>
            </div>
          }
          </div>
        </div>
      </div>
  )
}

export default Modal;