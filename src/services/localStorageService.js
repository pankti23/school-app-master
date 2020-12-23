export function clearLocalStorage() {
  const code = getSchoolCodeFromLocalStorage();
  const year = getSchoolYearFromLocalStorage();
  localStorage.clear();
  saveSchoolCodeToLocalStorage(code);
  saveSchoolYearToLocalStorage(year);
}

export function saveUserToLocalStorage(user) {
  localStorage.setItem('local-user', JSON.stringify(user));
}

export function getUserFromLocalStorage() {
  const user = localStorage.getItem('local-user');
  if (user) {
    return JSON.parse(user);
  }
  return null;
}

export function saveTokenToLocalStorage(token) {
  localStorage.setItem('local-token', token);
}

export function getTokenFromLocalStorage() {
  return localStorage.getItem('local-token');
}

export function setCurrentPage(currentPage) {
  localStorage.setItem('local-current-page', currentPage);
}

export function getCurrentPageFromLocalStorage() {
  return localStorage.getItem('local-current-page');
}

export function setNextPage(nextPage) {
  localStorage.setItem('local-next-page', nextPage);
}

export function getNextPageFromLocalStorage() {
  return localStorage.getItem('local-next-page');
}

export function setNextToken(nextToken) {
  localStorage.setItem('local-next-token', nextToken);
}

export function getNextTokenFromLocalStorage() {
  return localStorage.getItem('local-next-token');
}

export function saveSchoolCodeToLocalStorage(code) {
  localStorage.setItem('local-school-code', code);
}

export function getSchoolCodeFromLocalStorage() {
  return localStorage.getItem('local-school-code');
}

export function saveSchoolYearToLocalStorage(year) {
  localStorage.setItem('local-school-year', year);
}

export function getSchoolYearFromLocalStorage() {
  return localStorage.getItem('local-school-year');
}


export default {
  saveUserToLocalStorage,
  getUserFromLocalStorage,
  saveTokenToLocalStorage,
  getTokenFromLocalStorage,
  setNextPage,
  getNextPageFromLocalStorage,
  setNextToken,
  getNextTokenFromLocalStorage
}
