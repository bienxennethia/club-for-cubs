const apiUrl = process.env.REACT_APP_API_BASE_URL;

export const formatDate = (dateTimeString) => {
  const optionsDate = { month: 'long', day: '2-digit', year: 'numeric' };
  const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: true };
  const date = new Date(dateTimeString);
  const formattedDate = date.toLocaleDateString('en-US', optionsDate);
  const formattedTime = date.toLocaleTimeString('en-US', optionsTime);
  return `${formattedDate} | ${formattedTime}`;
};


export const getClubTypes = () => {
  return fetch(`${apiUrl}/club-types`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch club types');
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error fetching club types:', error);
      throw error;
    });
};

export const saveClubs = (clubData) => {
  return fetch(`${apiUrl}/clubs`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(clubData)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to save clubs');
    }
    return response.json();
  })
  .catch(error => {
    console.error('Error saving clubs:', error);
    throw error;
  });
};

export const getClubs = (params = null) => {
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
    .catch(error => {
      console.error('Error fetching clubs:', error);
      throw error;
    });
};

export const updateClub = (id, clubData) => {
  const url = `${apiUrl}/clubs/${id}`;

  return fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(clubData),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update club');
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error updating club:', error);
      throw error;
    });
};

export const deleteClub = (clubId) => {
  return fetch(`${apiUrl}/clubs/delete/${clubId}`, {
    method: 'PUT'
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to delete club');
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error deleting club:', error);
      throw error;
    });
};


// forums
export const getForums = (params = null) => {
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
    .catch(error => {
      console.error('Error fetching clubs:', error);
      throw error;
    });
};

export const saveForum = (forumData) => {
  return fetch(`${apiUrl}/forums`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(forumData)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to save forums');
    }
    return response.json();
  })
  .catch(error => {
    console.error('Error saving forums:', error);
    throw error;
  });
};

export const updateForum = (id, forumData) => {
  const url = `${apiUrl}/forums/${id}`;

  return fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(forumData),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update forum');
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error updating forum:', error);
      throw error;
    });
};

export const deleteForum = (forumId) => {
  return fetch(`${apiUrl}/forums/${forumId}`, {
    method: 'DELETE'
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to delete club');
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error deleting club:', error);
      throw error;
    });
};

export const getUsers = (params = null) => {
  let { user_id = null } = params;
  
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
    .catch(error => {
      console.error('Error fetching user:', error);
      throw error;
    });
};
