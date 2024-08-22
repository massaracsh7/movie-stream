import { toast } from 'react-toastify';

import {
  TOAST_NO_CONNECTION,
  TOAST_SIGN_IN_PENDING,
  TOAST_SIGN_IN_SUCCESS,
  TOAST_SIGN_UP_PENDING,
  TOAST_SIGN_UP_SUCCESS,
} from '../../constants.ts';
import { ApiErrorResponse, SignInOrSignUpFunction } from '../../types.ts';

export const toastForNoConnection = () => {
  if (!navigator.onLine) {
    toast.error(TOAST_NO_CONNECTION);
    return true;
  }
};

export const toastSignIn = async (
  onRenderError: (error: ApiErrorResponse) => string,
  signIn: SignInOrSignUpFunction,
) => {
  const response = await toast.promise(signIn(), {
    pending: TOAST_SIGN_IN_PENDING,
    success: TOAST_SIGN_IN_SUCCESS,
    error: {
      render(error) {
        const apiError = error as ApiErrorResponse;
        return onRenderError(apiError);
      },
    },
  });

  return response;
};

export const toastSignUp = async (
  onRenderError: (error: ApiErrorResponse) => string,
  signUp: SignInOrSignUpFunction,
) => {
  const response = await toast.promise(signUp(), {
    pending: TOAST_SIGN_UP_PENDING,
    success: TOAST_SIGN_UP_SUCCESS,
    error: {
      render(error) {
        const apiError = error as ApiErrorResponse;
        return onRenderError(apiError);
      },
    },
  });
  return response;
};
