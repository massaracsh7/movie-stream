import { toast } from 'react-toastify';

import {
  TOAST_NO_CONNECTION,
  TOAST_UPDATE_PENDING,
  TOAST_UPDATE_SUCCESS,
} from '../../constants';
import { ApiErrorResponse } from '../../types';
import { UpdateFunction } from './types';

export const toastForNoConnection = () => {
  if (!navigator.onLine) {
    toast.error(TOAST_NO_CONNECTION);
    return true;
  }
};

export const toastUpdate = async (
  onRenderError: (error: ApiErrorResponse) => string,
  update: UpdateFunction,
) => {
  const response = await toast.promise(update(), {
    pending: TOAST_UPDATE_PENDING,
    success: TOAST_UPDATE_SUCCESS,
    error: {
      render(error) {
        const apiError = error as ApiErrorResponse;
        return onRenderError(apiError);
      },
    },
  });

  return response;
};
