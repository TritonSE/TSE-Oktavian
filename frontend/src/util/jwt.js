function hasJWT() {
  return localStorage.getItem("oktavian:token") != null;
}

function getJWT() {
  return localStorage.getItem("oktavian:token");
}

function setJWT(token) {
  localStorage.setItem("oktavian:token", token);
}

function clearJWT() {
  localStorage.removeItem("oktavian:token");
}

export { hasJWT, getJWT, setJWT, clearJWT };
