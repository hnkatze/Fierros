type LocalStorageState = {
    isLogged: boolean;
  };
  
  export const getLocalStorageState = (): LocalStorageState => {
    if (typeof window !== 'undefined') {
      const storedState = localStorage.getItem('userState');
      return storedState ? JSON.parse(storedState) : { isLogged: false };
    } else {
      return { isLogged: false };
    }
  };
  
  const updateLocalStorageState = (newState: Partial<LocalStorageState>) => {
    const updatedState = { ...getLocalStorageState(), ...newState };
    localStorage.setItem('userState', JSON.stringify(updatedState));
  };
  
  export const clearLocalStorage = () => {
    localStorage.removeItem('userState');
  };
  
  export const setIsLoggedInLocalStorage = (isLogged: boolean) => {
    updateLocalStorageState({ isLogged });
  };
  
  export const getIsLoggedInFromLocalStorage = (): boolean => {
    return getLocalStorageState().isLogged;
  };
  