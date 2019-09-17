export const LOGIN_SUCCESS = 'LOGIN_AUTH_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_AUTH_FAILURE';

export const LOGIN = 'LOGIN_AUTH';

const loginSuccess = props => ({
  type: LOGIN_SUCCESS,
  props,
});

const loginFailure = error => ({
  type: LOGIN_FAILURE,
  error,
});

export const login = props => loginSuccess(props);
