/* eslint-disable no-console */
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import Modal from 'react-modal';

import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { customStyles } from '@/components/Modal/Modal';
import { TOAST_INTERNAL_SERVER_ERROR, TOAST_SIGN_UP_ERROR } from '@/constants';
import { ApiErrorResponse } from '@/types';
import { UserInfoSchema } from '@/utils/schema';
import './UserProfilePage.scss';
import { queryCustomer, updateCustomerInfo } from './apiUser';
import { toastForNoConnection, toastUpdate } from './toasts';
import type { UserInfoData } from './types';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store.js';

type FormType = z.infer<typeof UserInfoSchema>;

export default function UserInfo() {
  const [firstName1, setFirstName] = useState('John');
  const [lastName1, setLastName] = useState('Doy');
  const [email1, setEmail] = useState('email@ex.com');
  const [dateOfBirth1, setdateOfBirth] = useState('01.01.1980');
  const [version, setVersion] = useState(1);

  const userId = useSelector((state: RootState) => state.auth.id);

  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  useEffect(() => {
    queryCustomer(userId)
      .then(({ body }) => {
        if (body?.version) {
          let data: number = body.version;
          setVersion(data++);
        }

        if (body?.firstName) {
          const data: string = body.firstName;
          setFirstName(data);
        }
        if (body?.lastName) {
          setLastName(body.lastName);
        }
        if (body?.email) {
          setEmail(body.email);
        }
        if (body?.dateOfBirth) {
          setdateOfBirth(body.dateOfBirth);
        }
      })
      .catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalIsOpen]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormType>({
    mode: 'onChange',
    resolver: zodResolver(UserInfoSchema),
  });

  useEffect(() => {
    setValue('firstName', firstName1);
  }, [firstName1, setValue]);

  useEffect(() => {
    setValue('lastName', lastName1);
  }, [lastName1, setValue]);

  useEffect(() => {
    setValue('email', email1);
  }, [email1, setValue]);

  useEffect(() => {
    setValue('dateOfBirth', new Date(Date.parse(dateOfBirth1)));
  }, [dateOfBirth1, setValue]);

  const [signUpError, setSignUpError] = useState<null | ApiErrorResponse>(null);

  const onRenderError = (error: ApiErrorResponse) => {
    if (error.data.body.statusCode === 400) {
      setSignUpError(error);
      return TOAST_SIGN_UP_ERROR;
    } else {
      return TOAST_INTERNAL_SERVER_ERROR;
    }
  };

  const onSubmit: SubmitHandler<FormType> = async (data) => {
    const userInfo: UserInfoData = {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth.toISOString().slice(0, 10),
    };
    try {
      if (toastForNoConnection()) {
        return;
      }
      setSignUpError(null);
      await toastUpdate(onRenderError, () => updateCustomerInfo(userId, userInfo, version));
      closeModal();
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      console.error(apiError);
    }
  };

  return (
    <>
      <div className='user__info'>
        <h2>Person information</h2>
        <p>
          <b>First name:</b> {firstName1}
        </p>
        <p>
          <b>Last name:</b> {lastName1}
        </p>
        <p>
          <b>Email:</b> {email1}
        </p>
        <p>
          <b>Date of birth:</b> {dateOfBirth1}
        </p>
        <button className='user__btn' onClick={openModal}>
          Edit
        </button>
      </div>

      <div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel='Example Modal'
        >
          <form className='user-form' autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor='firstname'>First Name</label>
              {errors?.firstName?.message && (
                <span className='user-form__error'>{errors.firstName.message}</span>
              )}
              <input id='firstname' {...register('firstName')} className='user-form__input' />
            </div>
            <div>
              <label htmlFor='lastname'>Last Name</label>
              {errors?.lastName?.message && (
                <span className='user-form__error'>{errors.lastName.message}</span>
              )}
              <input id='lastname' {...register('lastName')} className='user-form__input' />
            </div>

            <div>
              <label htmlFor='email'>Email</label>
              {errors?.email?.message && (
                <span className='user-form__error'>{errors.email.message}</span>
              )}
              <input
                id='email'
                {...register('email')}
                className={`user-form__input ${signUpError ? 'server-error' : ''}`}
              />
            </div>
            <div>
              <label htmlFor='dateOfBirth'>Date of birth</label>
              {errors?.dateOfBirth?.message && (
                <span className='user-form__error'>{errors.dateOfBirth.message}</span>
              )}
              <input
                id='dateOfBirth'
                type='date'
                {...register('dateOfBirth')}
                className='user-form__input'
              />
            </div>
            <div className='user__flex'>
              <button className='user__btn' onClick={closeModal}>
                Cancel
              </button>
              <button className='user__btn' type='submit'>
                Save
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </>
  );
}
