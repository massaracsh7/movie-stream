import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import classNames from 'classnames';
import { MdAddShoppingCart } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { updateCartData } from '../../store/cartSlice';
import { addItemToCart, createAnonymousCart, createUserCart } from '../../api/api';
import './ProductCard.scss';
import type { ProductItem } from '../../types';

interface ProductProps {
  product: ProductItem;
}

const ProductCard = ({ product }: ProductProps) => {
  const dispatch = useDispatch();

  const authId = useSelector((state: RootState) => state.auth.id);
  const cartId = useSelector((state: RootState) => state.cart.id);
  const cartVersion = useSelector((state: RootState) => state.cart.version);
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const imgUrl = product.images && product.images.length > 0 ? product.images[0].url : '';
  const fullPrice = product.price ? product.price / 100 : 0;

  const productFullPriceClasses = classNames('product-card__price_full', {
    'product-card__price_has-discount': product.discount,
  });

  const handleAddItem = async (event: React.MouseEvent) => {
    event.preventDefault();
    toast.info('Adding to cart...');

    try {
      let updatedCart;
      if (!cartId) {
        const { body: cart } = authId ? await createUserCart() : await createAnonymousCart();
        updatedCart = await addItemToCart(authId, cart.id, product.id, cart.version);
      } else {
        updatedCart = await addItemToCart(authId, cartId, product.id, cartVersion);
      }

      dispatch(updateCartData({
        id: updatedCart.body.id,
        version: updatedCart.body.version,
        quantity: updatedCart.body.totalLineItemQuantity,
        items: updatedCart.body.lineItems,
      }));
    } catch (error) {
      console.error(error);
      toast.error('Ups, something went wrong!');
    }
  };

  const itemExistsInCart = cartItems.some((item) => item.productId === product.id);

  return (
    <Link to={`/products/${product.id}`} className="product-card" data-testid="product-card">
      {imgUrl && (
        <div className="product-card__image">
          <img src={imgUrl} alt={product.name['en-US']} />
        </div>
      )}
      <h3 className="product-card__title">{product.name['en-US']}</h3>
      <div className="product-card__description_wrapper">
        {product.description && (
          <p className="product-card__description_inner">{product.description['en-US']}</p>
        )}
        <button
          disabled={itemExistsInCart}
          className="product-card__add-btn"
          onClick={handleAddItem}
        >
          <MdAddShoppingCart />
        </button>
      </div>
      <div className="product-card__price">
        <span className={productFullPriceClasses}>${fullPrice.toFixed(2)}</span>
      </div>
    </Link>
  );
};

export default ProductCard;
