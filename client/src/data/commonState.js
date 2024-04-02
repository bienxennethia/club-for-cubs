/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { modals } from '../components/Modal/modals';
import { getClubs, getClubTypes, saveClubs, getForums, saveForum, updateForum, deleteForum, deleteClub, updateClub, login, getUsers } from './utils';
const CommonStateContext = createContext();

export const useCommonState = () => useContext(CommonStateContext);

// Common state provider component
export const CommonStateProvider = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(null);
  const [selectedClub, setSelectedClub] = useState(null);
  const [modalIdOpen, setModalIdOpen] = useState(null);
  const [modalContent, setModalContent] = useState(null);
  const [clubLists, setClubLists] = useState([]);
  const [clubTypes, setClubTypes] = useState([]);
  const [forumLists, setForumLists] = useState([]);
  const [selectedClubType, setSelectedClubType] = useState('all');
  const [warningMessage, setWarningMessage] = useState({id: null, message: null});
  const [response, setResponse] = useState({id: null, message: null});
  const [curricularType, setCurricularType] = useState('all');
  const [interestType, setInterestType] = useState('all');
  const [searchString, setSearchString] = useState('');
  const [modalContentId, setModalContentId] = useState(null);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isVisitor, setIsVisitor] = useState(false);
  const [users, setUsers] = useState(null);

  useEffect(() => {
    if (!isLoggedIn && !isVisitor) {
      navigate('/');
    }
    
  }, [isLoggedIn]);

  useEffect(() => {
    const itemID = location.pathname.includes('item') ? location.pathname.split('/').pop() : null;
    
    fetchClubs({ id: itemID, type: selectedClubType });
  }, [location.pathname, selectedClubType]);

  useEffect(() => {
    const verifyLoggedIn = getWithExpiry('isLoggedIn');
    if (verifyLoggedIn === null) {
      const verifyVisitor = getWithExpiry('isVisitor');
      setIsLoggedIn(false);
      setIsVisitor(verifyVisitor?.value === true);
    } else {
      fetchUsers({user_id: verifyLoggedIn?.user?.user_id});
      setIsLoggedIn(verifyLoggedIn?.value === true);
    }

    const fetchClubTypes = async () => {
      try {
        const result = await getClubTypes();
        setClubTypes(result);
      } catch (error) {
        console.error('Error fetching club types:', error);
      }
    };
    fetchClubTypes();
    addStyling(false);
  }, []);

  useEffect(() => {
    setCurrentPage(location.pathname);
    setSelectedClubType(null);

    if (location.pathname.includes('forums')) {
      document.querySelector('.content').classList.add('forums');
      setCurricularType('all');
      setInterestType('all');
      setSearchString('');
      fetchClubs({type: 'all'});
      fetchForums();
    } else {
      document.querySelector('.content').classList.remove('forums');
    }
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {

    if (location.pathname.includes('item')) {
      if (clubLists.length === 0) {
        setWarningMessage({id: currentPage, message: 'Club not found!'});
        navigate('/clubs');
      }
    }
  }, [clubLists]);

  useEffect(() => {
    if (location.pathname.includes('forums')) {
      fetchForums({id: null, interestType, curricularType, searchString});
    }
  }, [interestType, curricularType, searchString, location.pathname]);
  
  useEffect( () => {
    const clubTypeOptions = clubTypes.map(type => {
      if (type.id === 'all') {
        return { ...type, id: '', name: 'Select type' };
      }
      return type;
    });;
    const clubOptions = [{ id: '', name: 'Select club', label: 'Select club' }, ...clubLists];

    const getModal = async () => {
      addStyling(true);
      const modal = modals.find((modal) => modal.id === modalIdOpen);
      if (modalIdOpen === 'deleteForum' || modalIdOpen === 'deleteClub') {
        setIsDeleteModal(true);
      } else {
        const updatedFields = await Promise.all(modal.content.fields.map((field) => {
          let newFields = field;
          if (field.type === 'select' && field.name !== 'year') {
            if (modalIdOpen === 'login' || modalIdOpen === 'addForum' || modalIdOpen === 'editForum' || modalIdOpen === 'signup' || modalIdOpen === 'profile') {
              newFields ={ ...newFields, options: clubOptions };
            } else if (modalIdOpen === 'addClub' || modalIdOpen === 'editClub') {
              newFields = { ...newFields, options: clubTypeOptions };
            }
          }
  
          if (modalIdOpen === 'editForum' || modalIdOpen === 'editClub') {
            const selectedItem = modalIdOpen === 'editForum' ? forumLists.find((forum) => forum.forum_id === modalContentId) : clubLists[0];
            selectedItem[newFields.name] = selectedItem[newFields.name] || null;
            newFields = { ...newFields, value: selectedItem[newFields.name] };
          }

          if (modalIdOpen === 'profile') {
            users[0][newFields.name] = users[0][newFields.name] || null;
            newFields = { ...newFields, value: users[0][newFields.name] };
          }
          return newFields;
        }));
        setModalContent({ ...modal, content: { ...modal.content, fields: updatedFields }});
      }
    };

    if (modalIdOpen) {
      getModal();
    }
  }, [clubLists, clubTypes, modalIdOpen, modalContentId, forumLists]);

  const toggleModal = (modalId) => {
    setModalIdOpen(modalId);
  };

  const addStyling = (isOpen) => {
    
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  };

  const fetchClubs = async (params = null) => {
    try {
      const result = await getClubs(params);
      setClubLists(result);
    } catch (error) {
      console.error('Error fetching clubs:', error);
    }
  };

  const fetchForums = async (params = null) => {
    try {
      const result = await getForums(params);
      setForumLists(result);
    } catch (error) {
      console.error('Error fetching forums:', error);
    }
  };

  const fetchUsers = async (params = null) => {
    try {
      const result = await getUsers(params);
      setUsers(result);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  
  const toggleSave = async () => {
    const fields = {};
    let isValid = true;
  
    modalContent?.content.fields.forEach(field => {
      const inputElement = document.querySelector(`.fields-modal__input[name="${field.name}"]`);
        if (inputElement) {
        const value = inputElement.value.trim();

        if (field.type === 'email' && value !== '') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            isValid = false;
            inputElement.nextElementSibling.textContent = 'Invalid email address';
            inputElement.classList.add('error');
            return;
          }
        }

        if (inputElement.required && value === '') {
          isValid = false;
          inputElement.classList.add('error');
          inputElement.nextElementSibling.textContent = 'This field is required';
          return;
        } else {
          fields[field.name] = value;
          inputElement.classList.remove('error');
          inputElement.nextElementSibling.textContent = '';
        }
      }
    });
  
    if (isValid) {
      let results = {};
      let isEdit = false;
      if (modalIdOpen === 'addClub') {
        const { result } = await saveClubs(fields);
        results = result;
        setClubLists(result);
      } else if (modalIdOpen === 'editClub') {
        const { result } = await updateClub(modalContentId, fields);
        results = result;
        setClubLists(result);
        isEdit = true;
      } else if (modalIdOpen === 'addForumClub') {
        const itemID = location.pathname.includes('item') ? location.pathname.split('/').pop() : null;
        const { result } = await saveForum({...fields, club_id: itemID});
        fetchClubs({id: itemID});
        fetchForums({clubId: itemID});
        results = result;
      }else if (modalIdOpen === 'addForum') {
        const { result } = await saveForum(fields);
        results = result;
        fetchForums({id: null, interestType, curricularType, searchString});
      } else if (modalIdOpen === 'editForum') {
        const { result } = await updateForum(modalContentId, fields);
        results = result;
        fetchForums({id: null, interestType, curricularType, searchString});
        isEdit = true;
      } else if (modalIdOpen === 'login') {
        const { user, message } = await login({...fields});
        if (user) {
          setResponse({id: currentPage, message: "Login successfully!"});
          setUsers(user);
          setIsLoggedIn(true);
          setTimeout(() => {
            closeModal();
          }, 3000);
          setWithExpiry('isLoggedIn', true, 1 * 24 * 60 * 60 * 1000, { ...user, password: null, email: null });
          localStorage.removeItem('isVisitor');
        } else {
          setResponse({id: currentPage, message: message});
        }
        return;
      }

      if (results) {
        setResponse({id: currentPage, message: isEdit ? 'Updated successfully!' : 'Saved successfully!'});
        clearFields();
      } else {
        setResponse({id: currentPage, message: isEdit ? 'Failed to update.' : 'Failed to save.'});
      }
    }
  };

  const deleteModal = async () => {
    if (modalIdOpen === 'deleteClub') {
      const { message } = await deleteClub(modalContentId);
      if (message) {
        setWarningMessage({id: currentPage, message: message});
        navigate('/clubs');
      }
    } else if (modalIdOpen === 'deleteForum') {
      const { message } = await deleteForum(modalContentId);
      if (message) {
        setWarningMessage({id: currentPage, message: message});
        fetchForums({id: null, interestType, curricularType, searchString});
        navigate('/forums');
      }
    }
  };

  const closeModal = () => {
    setResponse(null);
    setIsDeleteModal(false);
    addStyling(false);
    setModalContent(null);
    setModalIdOpen(null);
  };

  const clearFields = () => {
    modalContent?.content.fields.forEach(field => {
      const input = document.querySelector(`.fields-modal__input[name="${field.name}"]`);
      if (input) {
        input.value = '';
      }
  
      const textarea = document.querySelector(`.fields-modal__input[name="${field.name}"]`);
      if (textarea) {
        textarea.value = '';
      }
  
      const select = document.querySelector(`.fields-modal__input[name="${field.name}"]`);
      if (select) {
        select.selectedIndex = 0;
      }
    });
  };
  const visitorBtn = () => {
    setIsVisitor(true);
    navigate('/forums');
  };

  const setWithExpiry = (key, value, ttl, user = null) => {
    const now = new Date();
    let item = {
        value: value,
        expiry: now.getTime() + ttl
    };

    if (key === 'isLoggedIn') {
      item = {...item, user };
    }
    localStorage.setItem(key, JSON.stringify(item));
  };

  const getWithExpiry = (key) => {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) {
        return null;
    }
    const item = JSON.parse(itemStr);
    const now = new Date();
    if (now.getTime() > item.expiry) {
        localStorage.removeItem(key);
        return null;
    }
    return item;
  }

  const logout = () => {
    setIsLoggedIn(false);
    setUsers(null);
    localStorage.removeItem('isLoggedIn');
  };

  return (
    <CommonStateContext.Provider value={{ 
      currentPage, setCurrentPage, 
      selectedClub, setSelectedClub,
      modalIdOpen, setModalIdOpen,
      modalContent, setModalContent,
      clubLists, setClubLists,
      clubTypes, setClubTypes,
      forumLists, setForumLists,
      selectedClubType, setSelectedClubType,
      warningMessage, setWarningMessage,
      response, setResponse,
      curricularType, setCurricularType,
      interestType, setInterestType,
      searchString, setSearchString,
      modalContentId, setModalContentId,
      isDeleteModal, setIsDeleteModal,
      isLoggedIn, setIsLoggedIn,
      isVisitor, setIsVisitor,
      users, setUsers,
      setWithExpiry, logout,
      toggleModal, closeModal, toggleSave, clearFields, deleteModal, visitorBtn }}>
      {children}
    </CommonStateContext.Provider>
  );
};
