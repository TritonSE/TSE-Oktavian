function isAuthenticated() {
  return localStorage.hasOwnProperty('tse-recruitment:token');
}

function getJWT() {
  if (!isAuthenticated()) {
    return null;
  }
  return localStorage.getItem('tse-recruitment:token');
}

function setJWT(token) {
  localStorage.setItem('tse-recruitment:token', token);
}

function getUser() {
  if (!isAuthenticated()) {
    return null;
  }
  return JSON.parse(localStorage.getItem('tse-recruitment:user'));
}

function setUser(user) {
  localStorage.setItem('tse-recruitment:user', JSON.stringify(user));
}

function logout() {
  localStorage.removeItem('tse-recruitment:token');
  localStorage.removeItem('tse-recruitment:user');
}

export {
  isAuthenticated, getJWT, setJWT,
  getUser, setUser, logout
};
