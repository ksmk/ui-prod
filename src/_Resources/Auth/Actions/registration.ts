export const REGISTRATION_SUCCESS = 'REGISTRATION_AUTH_SUCCESS';
export const REGISTRATION_FAILURE = 'REGISTRATION_AUTH_FAILURE';

export const REGISTRATION = 'REGISTRATION_AUTH';

const registrationSuccess = props => ({
  type: REGISTRATION_SUCCESS,
  props,
});

const registrationFailure = error => ({
  type: REGISTRATION_FAILURE,
  error,
});

export const registration = props => registrationSuccess(props);
