/* eslint-disable no-console */
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import Modal from 'react-modal';

import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import countries from '../../components/Form/CountryData';
import { customStyles } from '../../components/Modal/Modal';
import { TOAST_INTERNAL_SERVER_ERROR, TOAST_UPDATE_ERROR } from '../../constants';
import { ApiErrorResponse } from '../../types';
import { UserAddressSchema } from '../../utils/schema';
import UserNewAddress from './UserNewAddress';
import './UserProfilePage.scss';
import {
  addDefaultBilling,
  addDefaultShipping,
  queryCustomer,
  removeAddress,
  updateAddress,
} from './apiUser';
import { toastForNoConnection, toastUpdate } from './toasts';
import type { AddressResponse, ChangeAddressInput, Country } from './types';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store.js';

type FormType = z.infer<typeof UserAddressSchema>;

const tempAddress: AddressResponse = {
  country: 'US',
  city: 'New York',
  streetName: 'Baker',
  postalCode: '12345',
  id: '1',
};

export default function UserAddress() {
  const [addresses, setAddresses] = useState([tempAddress]);
  const [billingAddressIds, setBillingAddress] = useState(['0']);
  const [shippingAddressIds, setShippingAddress] = useState(['1']);
  const [defaultBillingAddress, setDefaultBilling] = useState<string>();
  const [defaultShippingAddress, setDefaultShipping] = useState<string>();
  const [version, setVersion] = useState(1);

  const userId = useSelector((state: RootState) => state.auth.id);


  const countriesList = countries;
  const [activeCountry, setActiveCountry] = useState('US');

  const getZip = (): string => {
    const act: Country = countriesList.filter((item) => item.id === activeCountry)[0];
    return act.postCode;
  };

  const getName = (item: string): string => {
    const act: Country = countriesList.filter((c) => c.id === item)[0];
    return act.descr;
  };

  const [changeAddress, setChangeAddress] = useState(tempAddress);

  const [modalIsOpen, setIsOpen] = useState(false);
  const [addressIsChange, setIsChange] = useState(false);
  const [addNewAddress, setAddNewAddress] = useState(false);

  const onAddNewAddress = (answer: boolean): void => {
    setAddNewAddress(answer);
  };

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
        if (body?.addresses) {
          setAddresses(body.addresses);
        }
        if (body?.billingAddressIds) {
          setBillingAddress(body.billingAddressIds);
        }

        if (body?.shippingAddressIds) {
          setShippingAddress(body.shippingAddressIds);
        }
        if (body?.defaultBillingAddressId) {
          setDefaultBilling(body.defaultBillingAddressId);
        }

        if (body?.defaultShippingAddressId) {
          setDefaultShipping(body.defaultShippingAddressId);
        }
      })
      .catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalIsOpen, addressIsChange, addNewAddress]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormType>({
    mode: 'onChange',
    resolver: zodResolver(UserAddressSchema),
  });

  const addressId = changeAddress.id ?? '12345';
  const addressCountry = changeAddress.country ?? 'US';
  const addressCity = changeAddress.city ?? 'New York';
  const addressPostalCode = changeAddress.postalCode ?? '12345';
  const addressStreet = changeAddress.streetName ?? 'Baker';

  useEffect(() => {
    setValue('country', addressCountry);
  }, [addressCountry, setValue]);

  useEffect(() => {
    setValue('city', addressCity);
  }, [addressCity, setValue]);

  useEffect(() => {
    setValue('zip', addressPostalCode);
  }, [addressPostalCode, setValue]);

  useEffect(() => {
    setValue('street', addressStreet);
  }, [addressStreet, setValue]);

  const onRenderError = (error: ApiErrorResponse) => {
    if (error.data.body.statusCode === 400) {
      return TOAST_UPDATE_ERROR;
    } else {
      return TOAST_INTERNAL_SERVER_ERROR;
    }
  };

  const onSubmit: SubmitHandler<FormType> = async (data) => {
    const address: ChangeAddressInput = {
      country: data.country,
      city: data.city,
      streetName: data.street,
      postalCode: data.zip,
    };

    try {
      if (toastForNoConnection()) {
        return;
      }
      await toastUpdate(onRenderError, () => updateAddress(userId, address, addressId, version));
      closeModal();
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      console.error(apiError);
    }
  };

  const deleteAddress = async (item: AddressResponse) => {
    const id: string = item.id ?? '12345';
    try {
      if (toastForNoConnection()) {
        return;
      }
      setIsChange(true);
      await toastUpdate(onRenderError, () => removeAddress(userId, id, version));
      setIsChange(false);
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      console.error(apiError);
    }
  };

  const defaultShipping = async (item: AddressResponse) => {
    const id: string = item.id ?? '12345';
    try {
      if (toastForNoConnection()) {
        return;
      }
      setIsChange(true);
      await toastUpdate(onRenderError, () => addDefaultShipping(userId, id, version));
      setIsChange(false);
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      console.error(apiError);
    }
  };

  const defaultBilling = async (item: AddressResponse) => {
    const id: string = item.id ?? '12345';
    try {
      if (toastForNoConnection()) {
        return;
      }
      setIsChange(true);
      await toastUpdate(onRenderError, () => addDefaultBilling(userId, id, version));
      setIsChange(false);
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      console.error(apiError);
    }
  };

  return (
    <>
      <div className='user__flex'>
        <div className='user__col'>
          <h2>Shipping addresses</h2>
          {addresses
            ?.filter((item) => item.id && shippingAddressIds?.includes(item?.id))
            .map((item, index) => {
              return (
                <div key={index} className='user__address'>
                  {defaultShippingAddress === item.id && (
                    <h4 className='user__default'>Shipping default address</h4>
                  )}
                  <p>
                    <b>Country:</b>{' '}
                    <span>{item.country !== undefined && getName(item.country)}</span>
                  </p>
                  <p>
                    <b>City:</b> <span>{item.city}</span>
                  </p>
                  <p>
                    <b>Street:</b> <span>{item.streetName}</span>
                  </p>
                  <p>
                    <b>Postal code:</b> <span>{item.postalCode}</span>
                  </p>
                  <div className='user__flex'>
                    <button
                      className='user__btn'
                      onClick={() => {
                        setChangeAddress(item);
                        if (item.country) setActiveCountry(item.country);
                        openModal();
                      }}
                    >
                      Edit
                    </button>
                    <button className='user__btn' onClick={() => deleteAddress(item)}>
                      Delete
                    </button>
                    <button className='user__btn' onClick={() => defaultShipping(item)}>
                      Default
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
        <div className='user__col'>
          <h2>Billing addresses</h2>
          {addresses
            ?.filter((item) => item.id && billingAddressIds?.includes(item?.id))
            .map((item, index) => {
              return (
                <div key={index} className='user__address'>
                  {defaultBillingAddress === item.id && (
                    <h4 className='user__default'>Billing default address</h4>
                  )}
                  <p>
                    <b>Country:</b>{' '}
                    <span>{item.country !== undefined && getName(item.country)}</span>
                  </p>
                  <p>
                    <b>City:</b> <span>{item.city}</span>
                  </p>
                  <p>
                    <b>Street:</b> <span>{item.streetName}</span>
                  </p>
                  <p>
                    <b>Postal code:</b> <span>{item.postalCode}</span>
                  </p>
                  <div className='user__flex'>
                    <button
                      className='user__btn'
                      onClick={() => {
                        setChangeAddress(item);
                        if (item.country) setActiveCountry(item.country);
                        openModal();
                      }}
                    >
                      Edit
                    </button>
                    <button className='user__btn' onClick={() => deleteAddress(item)}>
                      Delete
                    </button>
                    <button className='user__btn' onClick={() => defaultBilling(item)}>
                      Default
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      <UserNewAddress handleAddNewAddress={onAddNewAddress} />
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
