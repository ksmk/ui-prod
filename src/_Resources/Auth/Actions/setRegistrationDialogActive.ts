export const SET_REGISTRATION_DIALOG_ACTIVE =
  'SET_REGISTRATION_DIALOG_ACTIVE_AUTH';

export const setRegistrationDialogActive = ({ isActive }) => ({
  type: SET_REGISTRATION_DIALOG_ACTIVE,
  isActive,
});
