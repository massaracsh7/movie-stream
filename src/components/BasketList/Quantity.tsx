import { useEffect, useState } from 'react';
import { updateQuantity } from '../../api/api';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { updateCartData } from '../../store/cartSlice';

interface Props {
  lineItemId: string;
  quantity: number;
  onQuantityChange: (lineItemId: string, newQuantity: number) => void;
}

const Quantity = ({ lineItemId, quantity, onQuantityChange }: Props) => {
  const [count, setCount] = useState<number>(quantity);
  const dispatch = useDispatch();
  const authId = useSelector((state: RootState) => state.auth.id);
  const cartStateId = useSelector((state: RootState) => state.cart.id);
  const cartVersion = useSelector((state: RootState) => state.cart.version);

  const changeQuantity = async (count: number) => {
    try {
      const { body: cart } = await updateQuantity(authId, cartStateId, lineItemId, cartVersion, count);
      dispatch(updateCartData({
        version: cart.version,
        quantity: cart.totalLineItemQuantity,
        items: cart.lineItems,
      }));
      onQuantityChange(lineItemId, count); // Notify parent component about the quantity change
    } catch (err) {
      console.error('Error updating quantity:', err);
    }
  };

  const countHandler = (num: number) => {
    const newCount = Math.max(count + num, 0); // Prevent negative quantities
    setCount(newCount);
    changeQuantity(newCount);
  };

  useEffect(() => {
    setCount(quantity);
  }, [quantity, lineItemId]);

  return (
    <div className='basket__inline-flex'>
      <button
        className='basket__btn'
        onClick={() => countHandler(-1)}
        aria-label="Decrease quantity"
      >
        -
      </button>
      <span>{count}</span>
      <button
        className='basket__btn'
        onClick={() => countHandler(1)}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
};

export default Quantity;
