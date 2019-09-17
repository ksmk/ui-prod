import { LOGIN_SUCCESS } from '../Actions/login';
import { LOGOUT_SUCCESS } from '../Actions/logout';
import { SET_LOGIN_DIALOG_ACTIVE } from '../Actions/setLoginDialogActive';
import { SET_REGISTRATION_DIALOG_ACTIVE } from '../Actions/setRegistrationDialogActive';
import { REGISTRATION_SUCCESS } from '../Actions/registration';
import { RESET_PASSWORD_SUCCESS } from '../Actions/resetPassword';
import { SET_RESET_PASSWORD_DIALOG_ACTIVE } from '../Actions/setResetPasswordDialogActive';

const initialState = {
  user: null,
  registrationDialogActive: false,
  loginDialogActive: false,
  resetPasswordDialogActive: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS: {
      return {
        ...state,
        user: action.props,
        loginDialogActive: false,
      };
    }
    case REGISTRATION_SUCCESS: {
      return {
        ...state,
        // user: action.props,
        registrationDialogActive: false,
      };
    }
    case RESET_PASSWORD_SUCCESS: {
      return {
        ...state,
        // user: action.props,
        resetPasswordDialogActive: false,
      };
    }
    case LOGOUT_SUCCESS: {
      window.location.href = '/';
      return {
        ...state,
        user: null,
      };
    }
    case SET_LOGIN_DIALOG_ACTIVE: {
      return {
        ...state,
        loginDialogActive: action.isActive,
      };
    }
    case SET_REGISTRATION_DIALOG_ACTIVE: {
      return {
        ...state,
        registrationDialogActive: action.isActive,
      };
    }
    case SET_RESET_PASSWORD_DIALOG_ACTIVE: {
      return {
        ...state,
        resetPasswordDialogActive: action.isActive,
      };
    }
    default: {
      return state;
    }
  }
};
