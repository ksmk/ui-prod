export const RESET_PASSWORD_SUCCESS = 'RESET_PASSWORD_AUTH_SUCCESS';
export const RESET_PASSWORD_FAILURE = 'RESET_PASSWORD_AUTH_FAILURE';

export const RESET_PASSWORD = 'RESET_PASSWORD_AUTH';

const resetPasswordSuccess = props => ({
  type: RESET_PASSWORD_SUCCESS,
  props,
});

const resetPasswordFailure = error => ({
  type: RESET_PASSWORD_FAILURE,
  error,
});

export const resetPassword = props => resetPasswordSuccess(props);
