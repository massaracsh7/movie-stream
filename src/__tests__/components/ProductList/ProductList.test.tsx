
import { jest } from '@jest/globals';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';
import { RootState } from '../../../store/store';
import { BrowserRouter } from 'react-router-dom';
import ProductList from '../../../components/ProductList/ProductList';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';


const mockStore = configureStore<RootState>([]);

describe('ProductList', () => {
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
  it('renders products when productList is not empty', () => {
    const productList = [
      {
        id: '1',
        name: { 'en-US': 'Product 1' },
        categories: [{ typeId: 'category' as const, id: '1' }],
        description: { 'en-US': 'Product 1 Description' },
        images: undefined,
        attributes: undefined,
        discount: 5,
        price: 100,
      },
      {
        id: '2',
        name: { 'en-US': 'Product 2' },
        categories: [{ typeId: 'category' as const, id: '1' }],
        description: { 'en-US': 'Product 2 Description' },
        images: undefined,
        attributes: undefined,
        discount: 5,
        price: 100,
      },
    ];

    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductList productList={productList} />
        </BrowserRouter>,
      </Provider>
    );

    const productCards = screen.getAllByTestId('product-card');
    expect(productCards.length).toBe(productList.length);
  });
});
