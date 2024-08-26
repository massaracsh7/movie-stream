import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { CentPrecisionMoney, LineItem } from '@commercetools/platform-sdk';
import { MdRestoreFromTrash } from 'react-icons/md';
import {
  addDiscount,
  cartDiscounts,
  deleteCart,
  getActiveCart,
  removeItem,
} from '../../api/api';
import './BasketList.scss';
import Quantity from './Quantity';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { updateCartData } from '../../store/cartSlice';

export default function BasketList() {
  const [cartId, setCartId] = useState('1');
  const [version, setVersion] = useState(1);
  const [items, setItems] = useState<LineItem[]>();
  const [total, setTotal] = useState<CentPrecisionMoney>();
  const [discount, setDiscount] = useState(true);
  const dispatch = useDispatch();
  const authId = useSelector((state: RootState) => state.auth.id);
  const cartStateId = useSelector((state: RootState) => state.cart.id);

  const findCart = async (authId: string): Promise<void> => {
    try {
      const { body } = await getActiveCart(authId);
      if (body?.id) {
        setCartId(body.id);
      }
      if (body?.lineItems) {
        setItems(body.lineItems);
      }
      if (body?.totalPrice) {
        setTotal(body.totalPrice);
      }
      if (body?.version) {
        setVersion(body.version);
      }
      if (body?.discountCodes.length === 0) {
        setDiscount(false);
      }
    } catch (err) {
      console.log('The cart is empty.');
    }
  };


  const removeLine = async (lineItemId: string) => {
    const { body: cart } = await removeItem(authId, cartId, lineItemId, version);
    setVersion(cart.version);
    dispatch(updateCartData({
      version: cart.version,
      quantity: cart.totalLineItemQuantity,
      items: cart.lineItems,
    }));
  };


  const removeCart = async (authId: string, cartId: string, version: number) => {
    await deleteCart(authId, cartId, version);
    setVersion(1);
    dispatch(updateCartData({
      id: '',
      quantity: 0,
      version: 1,
      items: [],
    }));
    setItems([]);
    setTotal(undefined);
  };

  const [promo, setPromo] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPromo(event.target.value);
  };

  const updateItemQuantity = (lineItemId: string, newQuantity: number) => {
    setItems((prevItems) =>
      prevItems?.map((item) =>
        item.id === lineItemId
          ? { ...item, quantity: newQuantity, totalPrice: { ...item.totalPrice, centAmount: item.price.value.centAmount * newQuantity } }
          : item
      )
    );
    findCart(authId);
  };

  const checkDiscount = async () => {
    const response = await cartDiscounts(authId);
    const isPromo = response.body.results.map((item) => item.key).some((elem) => elem === promo);
    if (isPromo) {
      const { body: cart } = await addDiscount(authId, cartId, version, promo);
      setVersion(cart.version);
      setDiscount(true);
      dispatch(updateCartData({
        version: cart.version,
      }));
    }
  };

  const oldPrice = (() => {
    if (items) {
      return items.reduce((sum, item) => sum + item.price.value.centAmount * item.quantity, 0);
    }
    return 0;
  })();

  useEffect(() => {
    findCart(authId);
  }, [ cartStateId, authId, version]);

  return (
    <>
      <div>
        {!cartStateId && (
          <p>
            <span>The cart is empty. Please, go to </span>
            <Link className='basket__link' to={'/products'}>
              catalog
            </Link>
          </p>
        )}
        <div>
          {items?.map((item, key) => (
            <div key={key} className='basket__item'>
              <div className='basket__item-box'>
                <img
                  className='basket__item-img'
                  alt={item.name['en-US']}
                  src={item.variant.images ? item.variant.images[0].url : '../assets/open.png'}
                />
              </div>
              <div className='basket__item-box--lg'>
                <Link className='basket__item-name' to={`/products/${item.id}`}>
                  {item.name['en-US']}
                </Link>
              </div>
              <div className='basket__item-price'>
                <span>
                  {(item.price.value.centAmount / 100).toFixed(item.price.value.fractionDigits)}
                </span>
              </div>
              <Quantity
                lineItemId={item.id}
                quantity={item.quantity}
                onQuantityChange={updateItemQuantity}
              />
              <div className='basket__item-totalprice'>
                {(item.totalPrice.centAmount / 100).toFixed(item.price.value.fractionDigits)}
              </div>
              <button className='basket__btn' onClick={() => removeLine(item.id)}>
                <MdRestoreFromTrash />
              </button>
            </div>
          ))}
          <div>
            <b>Total sum: </b>
            {oldPrice && (
              <span
                className={
                  discount === true ? 'basket__item-oldprice--active' : 'basket__item-oldprice'
                }
              >
                {total && (oldPrice / 100).toFixed(total.fractionDigits)}
              </span>
            )}
            {(total && (total.centAmount / 100).toFixed(total.fractionDigits)) ?? ''}
          </div>
          <form>
            <label htmlFor='discount'>Enter your promo</label>
            <input
              className='basket__input'
              type='text'
              id='discount'
              name='discount'
              onChange={(e) => handleChange(e)}
            />
            <button className='basket__btn' type='button' onClick={checkDiscount}>
              Apply
            </button>
          </form>
          <button
            className='basket__btn'
            onClick={() => {
              if (window.confirm('Are you sure you wish to delete this cart?'))
                removeCart(authId, cartId, version);
            }}
          >
            Clear Cart
          </button>
        </div>
      </div>
    </>
  );
}
