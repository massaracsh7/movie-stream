import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { getActiveCart, signIn } from '../../api/api';
import { TOAST_INTERNAL_SERVER_ERROR, TOAST_SIGN_IN_ERROR } from '../../constants';
import { RootState } from '../../store/store';
import { setAuthData } from '../../store/authSlice';
import { updateCartData } from '../../store/cartSlice';
import { ApiErrorResponse } from '../../types';
import { LoginFormSchema } from '../../utils/schema';
import './LoginForm.scss';
import { toastForNoConnection, toastSignIn } from './toasts';
import { useDispatch, useSelector } from 'react-redux';

export type FormInput = z.infer<typeof LoginFormSchema>;

export default function Form() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInput>({
    mode: 'onChange',
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const cartState = useSelector((state: RootState) => state.cart);

  const [passStyle, setPassStyle] = useState('password');
  const [signInError, setSignInError] = useState<null | ApiErrorResponse>(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onRenderError = (error: ApiErrorResponse) => {
    if (error.data.body.statusCode === 400) {
      setSignInError(error);
      return TOAST_SIGN_IN_ERROR;
    } else {
      return TOAST_INTERNAL_SERVER_ERROR;
    }
  };

  const onSubmit: SubmitHandler<FormInput> = async (data): Promise<void> => {
    try {
      if (toastForNoConnection()) {
        return;
      }

      setSignInError(null);
      const response = await toastSignIn(onRenderError, () => signIn(data, cartState.id));
      
      reset();
      dispatch(setAuthData({ isSignedIn: true, id: response.body.customer.id }));
      try {
        const { body: cart } = await getActiveCart(response.body.customer.id);
        dispatch(updateCartData({
          id: cart.id,
          version: cart.version,
          quantity: cart.totalLineItemQuantity ?? 0,
          items: cart.lineItems,
        }));
      } catch (error) {
        const apiError = error as ApiErrorResponse;
        /* eslint-disable-next-line no-console */
        console.error(apiError);
      }

      navigate('/', { replace: true });
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      /* eslint-disable-next-line no-console */
      console.error(apiError);
    }
  };

  const togglePass = (): void => {
    passStyle === 'password' ? setPassStyle('text') : setPassStyle('password');
  };

  return (
    <form className='reg-form' autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor='email'>Email</label>
        {errors?.email?.message && <span className='reg-form__error'>{errors.email.message}</span>}
        <input
          id='email'
          {...register('email')}
          className={`reg-form__input ${signInError ? 'server-error' : ''}`}
          placeholder='email@gmail.com'
        />
      </div>

      <div>
        <label htmlFor='password' className='reg-form__label-pass'>
          Password{' '}
          {errors.password && <span className='reg-form__error'>{errors.password.message}</span>}
          <input
            {...register('password')}
            type={passStyle}
            id='password'
            className={`reg-form__input ${signInError ? 'server-error' : ''}`}
          />
          <div onClick={togglePass} className='reg-form__view'>
            👁️
          </div>
        </label>
      </div>

      <button type='submit' className='reg-form__btn'>
        Continue
      </button>
    </form>
  );
}
