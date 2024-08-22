import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import classNames from 'classnames';
import { MdAddShoppingCart } from 'react-icons/md';
import type { ProductItem } from '../../types';

import { addItemToCart, createAnonymousCart, createUserCart } from '../../api/api';
import './ProductCard.scss';
import { RootState } from '../../store/store';
import { useDispatch, useSelector } from 'react-redux';
import { updateCartData } from '../../store/cartSlice';

interface ProductProps {
  product: ProductItem;
}

const ProductCard = ({ product }: ProductProps) => {
  const dispatch = useDispatch();

  const authId = useSelector((state: RootState) => state.auth.id);
  const cartId = useSelector((state: RootState) => state.cart.id);
  const cartVersion = useSelector((state: RootState) => state.cart.version);
  const cartItems = useSelector((state: RootState) => state.cart.items);


  let imgUrl = '';

  if (product.images && product.images?.length > 0) {
    imgUrl = product.images[0].url.toString();
  }

  let fullPrice = 0;
  let discountedPrice = 0;

  if (product.price) {
    fullPrice = product.price / 100;
  }

  if (product.discount) {
    discountedPrice = fullPrice - Number(product.discount) / 100;
  }

  const productFullPriceClasses = classNames('product-card__price_full', {
    'product-card__price_has-discount': product.discount,
  });

  const handleAddItem = async (event: React.MouseEvent) => {
    event.preventDefault();

    try {
      toast.info('Adding to cart...'); // Display adding to cart toast

      if (!cartId) {
        if (authId) {
          const { body: cart } = await createUserCart();
          const { body: updatedCart } = await addItemToCart(
            authId,
            cart.id,
            product.id,
            cart.version,
          );
          dispatch(updateCartData({
            id: updatedCart.id,
            version: updatedCart.version,
            quantity: updatedCart.totalLineItemQuantity,
            items: updatedCart.lineItems,
          }));
        } else {
          const { body: cart } = await createAnonymousCart();
          const { body: updatedCart } = await addItemToCart(
            authId,
            cart.id,
            product.id,
            cart.version,
          );
          dispatch(updateCartData({
            id: updatedCart.id,
            version: updatedCart.version,
            quantity: updatedCart.totalLineItemQuantity,
            items: updatedCart.lineItems,
          }));
        }
      } else {
        const { body: updatedCart } = await addItemToCart(
          authId,
          cartId,
          product.id,
          cartVersion,
        );
        dispatch(updateCartData({
          version: updatedCart.version,
          quantity: updatedCart.totalLineItemQuantity,
          items: updatedCart.lineItems,
        }));
      }
    } catch (error) {
      /* eslint-disable-next-line no-console */
      console.log(error);
      toast.error('Ups, something went wrong!');
    }
  };

  const itemExistsInCart = cartItems.some((item) => item.productId === product.id);

  return (
    <Link to={`/products/${product.id}`} className='product-card' data-testid='product-card'>
      {imgUrl ? (
        <div className='product-card__image'>
          <img src={imgUrl} />
        </div>
      ) : null}
      <h3 className='product-card__title'>{product.name['en-US']}</h3>
      <div className='product-card__description_wrapper'>
        {product.description ? (
          <p className='product-card__description_inner'>{product.description['en-US']}</p>
        ) : null}
        <button
          disabled={itemExistsInCart}
          className='product-card__add-btn'
          onClick={handleAddItem}
        >
          <MdAddShoppingCart />
        </button>
      </div>

      <div className='product-card__price'>
        <span className={productFullPriceClasses}>${fullPrice}</span>
        {product.discount ? (
          <span className='product-card__price_discounted'>${discountedPrice}</span>
        ) : null}
      </div>
    </Link>
  );
};

export default ProductCard;
