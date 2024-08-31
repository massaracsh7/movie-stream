/* eslint-disable no-console */
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import Modal from 'react-modal';

import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import countries from '@/components/Form/CountryData';
import { customStyles } from '@/components/Modal/Modal';
import { TOAST_INTERNAL_SERVER_ERROR, TOAST_UPDATE_ERROR } from '@/constants';
import { ApiErrorResponse } from '@/types';
import { UserNewAddressSchema } from '@/utils/schema';
import './UserProfilePage.scss';
import { addAddress, addTypeAddress, queryCustomer } from './apiUser';
import { toastForNoConnection, toastUpdate } from './toasts';
import type { Country, NewAddress } from './types';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

type FormType = z.infer<typeof UserNewAddressSchema>;

interface Props {
  handleAddNewAddress: (arg: boolean) => void;
}

export default function UserNewAddress({ handleAddNewAddress }: Props) {
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
      })
      .catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalIsOpen]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormType>({
    mode: 'onChange',
    resolver: zodResolver(UserNewAddressSchema),
  });

  const countriesList = countries;
  const [activeCountry, setActiveCountry] = useState('US');

  const getZip = (): string => {
    const act: Country = countriesList.filter((item) => item.id === activeCountry)[0];
    return act.postCode;
  };

  const onRenderError = (error: ApiErrorResponse) => {
    if (error.data.body.statusCode === 400) {
      return TOAST_UPDATE_ERROR;
    } else {
      return TOAST_INTERNAL_SERVER_ERROR;
    }
  };

  const onSubmit: SubmitHandler<FormType> = async (data) => {
    const address: NewAddress = {
      country: data.country,
      city: data.city,
      streetName: data.street,
      postalCode: data.zip,
      key: data.country + data.city + data.street + data.zip + version,
    };

    try {
      if (toastForNoConnection()) {
        return;
      }
      await toastUpdate(onRenderError, () => addAddress(userId, address, version));
      handleAddNewAddress(true);
      const key = data.country + data.city + data.street + data.zip + version;
      await addTypeAddress(userId, key, version, data.typeadr);
      handleAddNewAddress(false);
      reset();
      closeModal();
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      console.error(apiError);
    }
  };

  const onReset = (): void => {
    reset();
    closeModal();
  };

  return (
    <>
      <button className='user__btn' onClick={openModal}>
        add address
      </button>
      <div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel='Example Modal'
        >
          <form className='user-form' autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor='street'>Street</label>
              {errors.street && <span className='user-form__error'>{errors.street.message}</span>}
              <input id='street' type='text' {...register('street')} className='user-form__input' />
            </div>
            <div>
              <label htmlFor='city'>City</label>
              {errors.city && <span className='user-form__error'>{errors.city.message}</span>}
              <input id='city' type='text' {...register('city')} className='user-form__input' />
            </div>
            <div>
              {errors.country && <p className='user-form__error'>{errors.country.message}</p>}
              <select
                id='country'
                {...register('country')}
                onChange={(event) => setActiveCountry(event.target.value)}
              >
                <option value='' disabled={true}>
                  Country
                </option>
                {countriesList.map((item: Country, index) => {
                  return (
                    <option key={index} value={item.id}>
                      {item.descr}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <label htmlFor='zip'>
                Postal code
                {errors.zip && <span className='user-form__error'>{errors.zip.message}</span>}
              </label>
              <input
                id='zip'
                type='text'
                {...register('zip')}
                className='user-form__input'
                pattern={getZip()}
              />
              <p className='user-form__error--zip'>
                Enter the code according to the rules of the selected country
              </p>
            </div>
            <div className='user__flex'>
              <label htmlFor='shipping'>
                <input id='shipping' type='radio' value='shipping' {...register('typeadr')} />
                Use as a shipping address
              </label>
              <label htmlFor='billing'>
                <input id='billing' type='radio' value='billing' {...register('typeadr')} />
                Use as a billing address
              </label>
            </div>
            {errors.typeadr && <span className='user-form__error'>{errors.typeadr.message}</span>}
            <div className='user__flex'>
              <button className='user__btn' onClick={onReset}>
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
