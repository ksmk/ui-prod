export const SET_RESET_PASSWORD_DIALOG_ACTIVE =
  'SET_RESET_PASSWORD_DIALOG_ACTIVE_AUTH';

export const setResetPasswordDialogActive = ({ isActive }) => ({
  type: SET_RESET_PASSWORD_DIALOG_ACTIVE,
  isActive,
});
