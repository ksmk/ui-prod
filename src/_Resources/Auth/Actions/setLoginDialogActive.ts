export const SET_LOGIN_DIALOG_ACTIVE = 'SET_LOGIN_DIALOG_ACTIVE_AUTH';

export const setLoginDialogActive = ({ isActive }) => ({
  type: SET_LOGIN_DIALOG_ACTIVE,
  isActive,
});
