import { BrowserRouter } from 'react-router-dom';

import { jest } from '@jest/globals';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';
import configureStore from 'redux-mock-store';
import { RootState } from '../../../store/store';
import { Provider } from 'react-redux';
const mockStore = configureStore<RootState>([]);
import ProductCard from '../../../components/ProductCard/ProductCard';

describe('ProductCard', () => {
  let store: ReturnType<typeof mockStore>;
  beforeEach(() => {
    fetchMock.resetMocks(); // Reset fetch mocks before each test
    jest.clearAllMocks();
    store = mockStore({
      auth: { id: 'user-id-123', isSignedIn: true },
      cart: {
        id: '',
        version: 1,
        quantity: 0,
        items: []
      }
    }); // Reset all mocks before each test
  });
  it('renders properties correctly', () => {
    const product = {
      id: '1',
      name: { 'en-US': 'Product 1' },
      categories: [{ typeId: 'category' as const, id: '1' }],
      description: { 'en-US': 'Product 1 Description' },
      images: undefined,
      attributes: undefined,
      discount: 5,
      price: 100,
    };


    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductCard product={product} />
        </BrowserRouter></Provider>,
    );

    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 1 Description')).toBeInTheDocument();
    });
});
