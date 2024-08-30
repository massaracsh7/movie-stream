import ProductCard from '../ProductCard/ProductCard';
import { ProductItem } from '../../types';

import './ProductList.scss';

interface ProductListProps {
  productList: ProductItem[];
}

const ProductList = ({ productList }: ProductListProps) => {
  return (
    <div className='product-list'>
      {productList.map((product, index) => (
        <ProductCard key={`${product.id}-${index}`} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
