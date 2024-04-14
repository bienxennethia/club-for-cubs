/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Cloudinary } from '@cloudinary/url-gen';

import { modals } from './modals';
const CommonStateContext = createContext();

export const useCommonState = () => useContext(CommonStateContext);
const isLocalhost = window.location.hostname === 'localhost';
const apiUrl = isLocalhost ? "http://localhost:3001" : process.env.REACT_APP_API_BASE_URL;

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
  const [disableField, setDisableField] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [isPageLoading, setIsPageLoading] = useState(false);

  useEffect(() => {
    setIsPageLoading(true);
    const itemID = location.pathname.includes('item') ? location.pathname.split('/').pop() : null;
    
    fetchClubs({ id: itemID, type: selectedClubType });

    if (location.pathname.includes('item') && itemID) {
      fetchForums({id: null, interestType: null, curricularType: itemID, searchString: null});
    }
  }, [location.pathname, selectedClubType]);

  useEffect(() => {
    const verifyLoggedIn = getWithExpiry('isLoggedIn');
    if (verifyLoggedIn !== null) {
      fetchUsers({user_id: verifyLoggedIn?.user?.user_id});
      fetchAccounts({user_id: verifyLoggedIn?.user?.user_id});
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
      setIsPageLoading(true);
      document.querySelector('.content').classList.add('forums');
      setCurricularType('all');
      setInterestType('all');
      setSearchString('');
      fetchClubs({type: 'all'});
      fetchForums();
    } else {
      document.querySelector('.content').classList.remove('forums');
    }

    if (location.pathname.includes('accounts') && users) {
      setIsPageLoading(true);
      fetchAccounts({user_id: users?.user_id});
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
    setIsPageLoading(true);
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
      setDisableField(false);
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

            if (users?.access === 'dev') {
              newFields = { ...newFields, required: false };
            }
          }
  
          if (modalIdOpen === 'editForum' || modalIdOpen === 'editClub') {
            const selectedItem = modalIdOpen === 'editForum' ? forumLists.find((forum) => forum.forum_id === modalContentId) : clubLists[0];
            selectedItem[newFields.name] = selectedItem[newFields.name] || null;
            newFields = { ...newFields, value: selectedItem[newFields.name] };
          }

          if (modalIdOpen === 'profile') {
            users[newFields.name] = users[newFields.name] || null;
            newFields = { ...newFields, value: users[newFields.name] };
          }

          if (modalIdOpen === 'changePassword') {
            users[newFields.name] = users[newFields.name] || null;
            newFields = { ...newFields, value: users[newFields.name] };
          }

          if (modalIdOpen === 'signup' && isLoggedIn &&(newFields.name === 'password' || newFields.name === 'confirm_password')) {
            return null;
          }

          return newFields;
        }).filter(field => field !== null));
        
        if (modalIdOpen === 'signup' && isLoggedIn) {
          updatedFields.push({ name: 'password', value: 'password@1234', type: 'hidden' });
        }
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
    }).finally(() => setIsPageLoading(false));
  };

  const fetchForums = async (params = null) => {
    let {id = null, interestType = null, curricularType = null, searchString = null, clubId = null} = params || {};
    if (interestType === 'all') { interestType = null; }
    if (curricularType === 'all') { curricularType = null; }
  
    let url = `${apiUrl}/forums`;
    if (id) {
      url += `?id=${id}`;
    } else if (interestType && !curricularType) {
      url += `?club_id_2=${interestType}`;
    } else if (!interestType && curricularType) {
      url += `?club_id=${curricularType}`;
    } else if (interestType && curricularType) {
      url += `?club_id=${curricularType}&club_id_2=${interestType}`;
    } else if (clubId) {
      url += `?club_id=${clubId}`;
    }
  
    if (url.includes('?') && searchString) {
      url += `&search_string=${searchString}`;
    } else if (!url.includes('?') && searchString) {
      url += `?search_string=${searchString}`;
    }
  
    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch clubs');
        }
        return response.json();
      })
      .then(data => {
        setForumLists(data?.result);
      })
      .catch(error => {
        console.error('Error fetching clubs:', error);
        throw error;
      }).finally(() => setIsPageLoading(false));
  };

  const fetchUsers = async (params = null) => {
    let { user_id = null } = params;

    if (!user_id) {
      return;
    }
    
    let url = `${apiUrl}/user`;
    if (user_id) {
      url += `?user_id=${user_id}`;
    }
  
    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }
        return response.json();
      })
      .then(data => {
        setUsers(data[0]);
        setIsAdmin(data[0].access === 'admin' || data[0].access === 'dev');
      })
      .catch(error => {
        console.error('Error fetching user:', error);
        throw error;
      });
  };

  const fetchAccounts = async (params = null) => {
    let { user_id = null } = params;
    
    let url = `${apiUrl}/accounts`;
    if (user_id) {
      url += `?user_id=${user_id}`;
    }
  
    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch acounts');
        }
        return response.json( );
      })
      .then(data => {
        setAccounts(data?.accounts);
        setIsPageLoading(false);
      })
      .catch(error => {
        console.error('Error fetching user:', error);
        throw error;
      });
  };

  const updateAccountStatus = async (user_id, status) => {
    const formData = new FormData();
    formData.append('user_id', user_id);
    formData.append('status', status);

    return fetch(`${apiUrl}/accounts`, {
      method: 'POST',
      body: formData,
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update account status');
      }
    })
    .then(() => {
      if (users) {
        fetchAccounts({user_id: users.user_id});
      }
    })
    .catch(error => {
      console.error('Error updating account status:', error);
      throw error;
    });
  };

  const toggleSave = async (formData, imageField = null) => {
    setIsLoading(true);
    setResponse({id: currentPage, message: ''});
    let isSuccess = false;
    const itemID = location.pathname.includes('item') ? location.pathname.split('/').pop() : null;
    try {
      if (imageField) {
        formData.append('image', imageField);
      }

      if (modalIdOpen === 'addForumClub') {
        formData.append('club_id', itemID);
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
          setIsAdmin(data?.user?.access === 'admin' || data?.user?.access === 'dev');
          setIsLoggedIn(true);
          setWithExpiry('isLoggedIn', true, 1 * 24 * 60 * 60 * 1000, { ...data?.user});
          localStorage.removeItem('isVisitor');
          isSuccess = true;
        } else if (modalIdOpen === 'addClub' || modalIdOpen === 'editClub') {
          setClubLists(data?.result);
          isSuccess = true;
        } else if (modalIdOpen === 'addForum' || modalIdOpen === 'editForum' || modalIdOpen === 'addForumClub') {
          const newCurricularType = itemID || curricularType;
          fetchForums({id: null, interestType, curricularType: newCurricularType, searchString});
          isSuccess = true;
        } else if (modalIdOpen === 'signup') {
          if (isLoggedIn) {
            setResponse({id: currentPage, message: 'User added successfully. Default password is "password@1234"'});
            fetchAccounts({user_id: users?.user_id});
            return;
          }
          setDisableField(true);
        } else if (modalIdOpen === 'profile') {
          setUsers(data?.user);
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
          if (location.pathname.includes('item')) {
            const itemID = location.pathname.split('/').pop() || null;
            fetchForums({id: null, interestType, curricularType: itemID, searchString});
            return;
          }
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
    setResponse({id: currentPage, message: ''});
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
    navigate('/');
  };

  const getImage = (image) => {
    const cld = new Cloudinary({
      cloud: {
        cloudName: "dl1braci9"
      }
    });

    return cld.image(image).toURL();
  }

  const formatDate = (dateTimeString) => {
    const optionsDate = { month: 'long', day: '2-digit', year: 'numeric' };
    const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: true };
    const date = new Date(dateTimeString);
    const formattedDate = date.toLocaleDateString('en-US', optionsDate);
    const formattedTime = date.toLocaleTimeString('en-US', optionsTime);
    return `${formattedDate} | ${formattedTime}`;
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
      isLoading, disableField,
      isAdmin, navigate,
      accounts, isPageLoading,
      getImage, formatDate,
      setWithExpiry, logout,
      updateAccountStatus,
      toggleModal, closeModal, toggleSave, clearFields, deleteModal, visitorBtn }}>
      {children}
    </CommonStateContext.Provider>
  );
};
