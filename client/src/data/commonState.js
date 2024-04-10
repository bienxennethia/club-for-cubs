/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Cloudinary } from '@cloudinary/url-gen';

import { modals } from './modals';
import { getForums, getUsers } from './utils';
const CommonStateContext = createContext();

export const useCommonState = () => useContext(CommonStateContext);
const apiUrl = process.env.REACT_APP_API_BASE_URL;

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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const itemID = location.pathname.includes('item') ? location.pathname.split('/').pop() : null;
    
    fetchClubs({ id: itemID, type: selectedClubType });
  }, [location.pathname, selectedClubType]);

  useEffect(() => {
    const verifyLoggedIn = getWithExpiry('isLoggedIn');
    if (verifyLoggedIn !== null) {
      fetchUsers({user_id: verifyLoggedIn?.user?.user_id});
      setIsLoggedIn(verifyLoggedIn?.value === true);
    } else {
      const verifyVisitor = getWithExpiry('isVisitor');
      setIsLoggedIn(false);
      setIsVisitor(verifyVisitor?.value === true);
      
      if (!verifyLoggedIn?.value && !verifyVisitor?.value) {
        navigate('/');
      }
    }

    const fetchClubTypes = async () => {
      return fetch(`${apiUrl}/club-types`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch club types');
        }
        return response.json();
      })
      .then(data => {
        setClubTypes(data?.result);
      })
      .catch(error => {
        console.error('Error fetching club types:', error);
        throw error;
      });
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
        setModalContent(modal);
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
    let { id = null, type = null } = params;
    if (type === 'all') { type = null; } 
    
    let url = `${apiUrl}/clubs`;
    if (id) {
      url += `?id=${id}`;
    } else if (type) {
      url += `?type=${type}`;
    }

    return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch clubs');
      }
      return response.json();
    })
    .then(data => {
      setClubLists(data?.result);
    })
    .catch(error => {
      console.error('Error fetching clubs:', error);
      throw error;
    });
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

  const toggleSave = async (event, imageField = null) => {
    setIsLoading(true);
    let isSuccess = false;
    try {
      event.preventDefault();
  
      const formData = new FormData(event.target);

      if (imageField) {
        formData.append('image', imageField);
      }

      const requestOptions = {
        method: modalContent?.method,
        body: formData,
      };

      if (modalIdOpen === "login") {
        requestOptions.headers = {
          'Content-Type': 'application/json'
        }
        const formValues = Object.fromEntries(formData);
        requestOptions.body = JSON.stringify(formValues);
      }

      let url = `${apiUrl}${modalContent?.path}`;
      if (modalIdOpen === 'editClub' || modalIdOpen === 'editForum') {
        url += `/${modalContentId}`;
      }
      
      await fetch(`${url}`, requestOptions).then(response => {
        if (!response.ok) {
          setResponse({id: currentPage, message: modalContent?.errorMessage});
        }
        return response.json();
      })
      .then(data => {

        if (modalIdOpen === 'login' && data?.user) {
          setUsers(data?.user);
          setIsLoggedIn(true);
          setWithExpiry('isLoggedIn', true, 1 * 24 * 60 * 60 * 1000, { ...data?.user});
          localStorage.removeItem('isVisitor');
          isSuccess = true;
        } else if (modalIdOpen === 'addClub' || modalIdOpen === 'editClub') {
          setClubLists(data?.result);
          isSuccess = true;
        } else if (modalIdOpen === 'addForum' || modalIdOpen === 'editForum') {
          fetchForums({id: null, interestType, curricularType, searchString});
          isSuccess = true;
        }
        setResponse({id: currentPage, message: data?.message});
      })
      .catch(error => {
        console.error('Error:', error);
        setResponse({id: currentPage, message: 'Internal server error.'});
      });
    } catch (error) {
      console.error('Error:', error);
      setResponse({id: currentPage, message: 'Internal server error.'});
    } finally {
      setIsLoading(false);

      if (isSuccess) {
        closeModal();
      }
    }
  };

  const deleteModal = async () => {
    setIsLoading(true);
    try {
      const url = `${apiUrl}${modalContent?.path}/${modalContentId}`;
      await fetch(url, {
        method: modalContent?.method,
      }).then(response => {
        if (!response.ok) {
          setResponse({id: currentPage, message: modalContent?.errorMessage});
        }
        return response.json();
      })
      .then(data => {
        setIsLoading(false);
        closeModal();
        if (modalIdOpen === 'deleteClub' && data?.message) {
          setWarningMessage({id: currentPage, message: data?.message});
          fetchClubs({});
          navigate('/clubs');
        } else if (modalIdOpen === 'deleteForum' && data?.message) {
          setWarningMessage({id: currentPage, message: data?.message});
          fetchForums({id: null, interestType, curricularType, searchString});
          navigate('/forums');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        setResponse({id: currentPage, message: 'Internal server error.'});
      });
    } catch (error) {
      console.error('Error:', error);
      setResponse({id: currentPage, message: 'Internal server error.'});
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

  const getImage = (image) => {
    const cld = new Cloudinary({
      cloud: {
        cloudName: "dl1braci9"
      }
    });

    return cld.image(image).toURL();
  }

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
      isLoading,
      getImage,
      setWithExpiry, logout,
      toggleModal, closeModal, toggleSave, clearFields, deleteModal, visitorBtn }}>
      {children}
    </CommonStateContext.Provider>
  );
};
