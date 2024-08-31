import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Header from '../../layout/Header/Header';
import { RootState } from '../../store/store';
import { BrowserRouter } from 'react-router-dom';

const mockStore = configureStore<RootState>([]);

describe('Header component', () => {
  let store: ReturnType<typeof mockStore>;

  beforeEach(() => {
    store = mockStore({
      auth: { id: 'user-id-123', isSignedIn: true },
      cart: {
        id: '',
        version: 1,
        quantity: 0,
        items: []
      }
    });
  });

  it('renders the header with basic content', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Header />
        </BrowserRouter>

      </Provider>
    );

    expect(screen.getByText('Movie Stream - JS Wisard')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Main/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Catalog/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /About/i })).toBeInTheDocument();
  });

  it('renders login and registration links when not authenticated', () => {
    store = mockStore({
      auth: { id: '', isSignedIn: false },
      cart: {
        id: '',
        version: 1,
        quantity: 0,
        items: [],
      }
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Header />
        </BrowserRouter>

      </Provider>
    );

    expect(screen.getByRole('link', { name: /LogIn/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Registration/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Profile/i })).not.toBeInTheDocument();
  });

  it('renders profile link when authenticated', () => {
    store = mockStore({
      auth: { id: '123', isSignedIn: true },
      cart: {
        id: '',
        version: 1,
        quantity: 0,
        items: [],
      }
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Header />
        </BrowserRouter>

      </Provider>
    );

    expect(screen.queryByText(/LogIn/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Registration/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Profile/i)).toBeInTheDocument();
  });
});