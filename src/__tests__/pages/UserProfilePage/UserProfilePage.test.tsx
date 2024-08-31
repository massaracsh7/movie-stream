import { BrowserRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock';

import UserProfilePage from '../../../pages/UserProfilePage/UserProfilePage';
import UserInfo from '@/pages/UserProfilePage/UserInfo';
import UserPassword from '@/pages/UserProfilePage/UserPassword';
import UserAddresses from '@/pages/UserProfilePage/UserAddresses';

jest.mock('@/pages/UserProfilePage/UserInfo');
jest.mock('@/pages/UserProfilePage/UserPassword');
jest.mock('@/pages/UserProfilePage/UserAddresses');

const MockedUserInfo = UserInfo as jest.Mock;
const MockedUserPassword = UserPassword as jest.Mock;
const MockedUserAddresses = UserAddresses as jest.Mock;

describe('UserProfilePage', () => {
  beforeEach(() => {
    fetchMock.resetMocks(); 
    jest.clearAllMocks(); 
    MockedUserInfo.mockImplementation(() => <div>UserInfo Component</div>);
    MockedUserPassword.mockImplementation(() => <div>UserPassword Component</div>);
    MockedUserAddresses.mockImplementation(() => <div>UserAddresses Component</div>);
  });

  it('renders UserProfilePage with all components and elements', () => {
    render(
      <BrowserRouter>
        <UserProfilePage />
      </BrowserRouter>
    );

    const mainTitle = screen.getByRole('heading', { level: 1 });
    expect(mainTitle).toHaveTextContent('User Profile');

    const subtitle = screen.getByRole('heading', { level: 2 });
    expect(subtitle).toHaveTextContent('Nice to meet you :)');

    const linkElement = screen.getByRole('link');
    expect(linkElement).toBeInTheDocument();

    const infoText = screen.getByText('Check information about you');
    expect(infoText).toBeInTheDocument();

    expect(screen.getByText('UserInfo Component')).toBeInTheDocument();
    expect(screen.getByText('UserPassword Component')).toBeInTheDocument();
    expect(screen.getByText('UserAddresses Component')).toBeInTheDocument();
  });
});