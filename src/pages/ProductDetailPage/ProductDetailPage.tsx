import { useEffect, useMemo, useState } from 'react';
import Modal from 'react-modal';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { customStyles } from '../../components/Modal/Modal';
import Slider from '../../components/Slider/Slider';
import { SliderItemDataSourceType } from '../../components/Slider/SliderItem';
import { getProduct } from '../../api/api';
import { ProductItem } from '../../types';

import { addProductToCart, removeProductFromCart } from '../../businessLogic/cartLogic';
import ProductDetailBreadcrumbs from './ProductDetailBreadcrumbs';
import './ProductDetailPage.scss';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { updateCartData } from '../../store/cartSlice';

interface ApiError {
  statusCode: number;
  message: string;
}

export default function ProductDetailPage() {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [selectedModalSliderItemIndex, setSelectedModalSliderItemIndex] = useState(0);
  const productFromProps = useLocation().state as ProductItem | null;
  const { id } = useParams();
  const [product, setProduct] = useState(productFromProps);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const authId = useSelector((state: RootState) => state.auth.id);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartStateId = useSelector((state: RootState) => state.cart.id);
  const cartStateVersion = useSelector((state: RootState) => state.cart.version);

  function onGetProductError(error: ApiError) {
    if (error.statusCode === 404) {
      navigate('/notFound', { replace: true });
    }
    /* eslint-disable-next-line no-console */
    console.error(error);
  }

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const product: ProductItem = await getProduct(id);
        setProduct(product);
      }
    };
    fetchData().catch(onGetProductError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isProductInCart = useMemo(() => {
    return product ? cartItems.some((item) => item.productId === product.id) : false;
  }, [product, cartItems]);

  function openModal(index: number) {
    //console.log(`openModalSlider at index${index}`);
    setSelectedModalSliderItemIndex(index);
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  function cartLineItemIdForProductId(productId: string) {
    return cartItems.find((element) => element.productId === productId)?.id;
  }

  function addProductToCartHandler() {
    try {
      product &&
        addProductToCart({
          productId: product.id,
          userId: authId,
          cartId: cartStateId,
          cartVersion: cartStateVersion,
          onAddProductToCart: ({ cartVersion, cartItems, cartItemsQuantity, cartId }) => {
            dispatch(updateCartData({
              id: cartId,
              version: cartVersion,
              quantity: cartItemsQuantity,
              items: cartItems,
            }));
          },
        });
    } catch (error) {
      /* eslint-disable-next-line no-console */
      console.log(error);
      toast.error('Ups, something went wrong!');
    }
  }

  function removeProductFromCartHandler() {
    try {
      let lineItemId: string | undefined;
      if (product) {
        lineItemId = cartLineItemIdForProductId(product.id);
      }
      lineItemId &&
        removeProductFromCart({
          lineItemId: lineItemId,
          userId: authId,
          cartId: cartStateId,
          cartVersion: cartStateVersion,
          onRemoveProductFromCart: ({ cartVersion, cartItems, cartItemsQuantity }) => {
            dispatch(updateCartData({
              version: cartVersion,
              quantity: cartItemsQuantity,
              items: cartItems,
            }));
          },
        });
    } catch (error) {
      /* eslint-disable-next-line no-console */
      console.log(error);
      toast.error('Ups, something went wrong!');
    }
  }

  //console.log(product);
  const sliderItems: SliderItemDataSourceType[] | undefined = product?.images?.map((image) => {
    return { imgSrc: image.url, onClickHandler: openModal };
  });

  let slider;
  if (sliderItems) {
    slider = <Slider items={sliderItems} />;
  } else {
    slider = <h3>Ups, product does not have images</h3>;
  }

  let modalSlider;
  if (sliderItems) {
    modalSlider = <Slider items={sliderItems} selectedIndex={selectedModalSliderItemIndex} />;
  } else {
    modalSlider = <h3>Ups, product does not have images</h3>;
  }

  let fullPrice = 0;
  let discountedPrice = 0;

  if (product?.price) {
    fullPrice = product.price / 100;
  }

  if (product?.discount) {
    discountedPrice = fullPrice - Number(product.discount) / 100;
  }

  return (
    <div className='product-detail'>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel='Product Image Modal'
      >
        {modalSlider}
      </Modal>
      <div className='product-detail__container '>
        <div className='product-detail__content-container'>
          <div className='product-detail__text-content'>
            {product ? (
              <ProductDetailBreadcrumbs
                productName={product.name['en-US']}
                productId={product.id}
              ></ProductDetailBreadcrumbs>
            ) : (
              ''
            )}
            <h3 className='product-detail__title'>{product?.name['en-US']}</h3>
            <p className='product-detail__description'>{product?.description?.['en-US']}</p>
            <div className='product-detail__cart-buttons-container'>
              <button
                type="button"
                disabled={isProductInCart}
                className={`button ${isProductInCart ? 'button_disabled' : ''}`}
                onClick={addProductToCartHandler}
              >
                {`Add to Cart for $${discountedPrice > 0 ? discountedPrice : fullPrice} `}
                {discountedPrice > 0 && (
                  <span className="full-price_crossed">{`$${fullPrice}`}</span>
                )}
              </button>

              <button
                type="button"
                disabled={!isProductInCart}
                className={`button ${!isProductInCart ? 'button_disabled' : ''}`}
                onClick={removeProductFromCartHandler}
              >
                Remove from Cart
              </button>
            </div>
          </div>
          {slider}
        </div>
      </div>
    </div>
  );
}
