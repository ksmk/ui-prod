export const LOGOUT_SUCCESS = 'LOGOUT_AUTH_SUCCESS';

export const LOGOUT = 'LOGOUT_AUTH';

const logoutSuccess = props => ({
  type: LOGOUT_SUCCESS,
  props,
});

const logoutFailure = error => ({
  type: LOGOUT_FAILURE,
  error,
});

export const logout = props => logoutSuccess(props);
