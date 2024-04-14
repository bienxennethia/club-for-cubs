
import {ReactComponent as Edit } from "../../icons/edit.svg";
import {ReactComponent as Delete } from "../../icons/delete.svg";

import { useParams } from 'react-router-dom';

import './AdminBtn.scss';

import { useCommonState } from "../../data/commonState";

const AdminBtn = ({ editModalId, deleteModalId, id = null }) => {
  const { setModalContentId, toggleModal, isLoggedIn } = useCommonState();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const itemId = id || useParams()?.id;
  const btnHandler = (modalId) => {
    setModalContentId(itemId);
    toggleModal(modalId);
  };
  return (
    isLoggedIn && <div className="admin-btns">
      <div className="admin-btns__btn" onClick={() => btnHandler(editModalId)} title="Edit">
        <Edit />
      </div>
      <div className="admin-btns__btn" onClick={() => btnHandler(deleteModalId)} title="Delete">
        <Delete />
      </div>
    </div>
  )
};

export default AdminBtn;