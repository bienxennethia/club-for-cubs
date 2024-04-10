import "./Modal.scss";
import { useEffect, useState } from "react";
import { ReactComponent as Logo } from "../../icons/logo.svg";
import { ReactComponent as Close } from "../../icons/close.svg";
import InputField from "./InputField";
import SelectField from "./SelectField";
import ImageUpload from "./ImageUpload";
import { useCommonState } from "../../data/commonState";
const Modal = () => {
  const { modalIdOpen, modalContent, closeModal, response, toggleSave, clearFields, isDeleteModal, deleteModal, toggleModal, isLoading } = useCommonState();

  const [image, setImage] = useState(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      closeModal();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, closeModal]);

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
        return "Update";
      case "login":
        return "Login";
      default:
        return "Register";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    toggleSave(event, image);
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
                  </div>
                ))}
                <div className="modal__footer">
                  <p className="modal__response">{response?.message}</p>
                </div>
                <div className="modal__actions">
                  {modalContent?.id === "login" && <button className="modal__btn" onClick={registerHandler} disabled={isLoading}>Register</button> 
                  }
                  <button className="modal__btn" disabled={modalIdOpen === 'profile' || modalIdOpen === 'signup' || isLoading} type="submit">{isLoading ? 'Loading...' : getBtnText()}</button>
                  <button className="modal__btn clear" onClick={clearFieldsHandler} disabled={isLoading} >Clear</button>
                </div>
              </form>
            </div>
          }
          {
            isDeleteModal && 
            <div className="modal__content">
              <p>Are you sure you want to delete?</p>
              
              <div className="modal__actions">
                    <button className="modal__btn" onClick={deleteModal} disabled={isLoading}>{isLoading ? 'Loading...' : 'Yes'}</button>
                    <button className="modal__btn clear" onClick={closeModal} disabled={isLoading}>No</button>
                  </div>
            </div>
          }
          </div>
        </div>
      </div>
  )
}

export default Modal;