import authReducer, { setAuthData } from '../../store/authSlice';

describe('authSlice', () => {
  const initialState = {
    isSignedIn: false,
    id: '',
  };

  it('should return the initial state', () => {
    expect(authReducer(undefined, { type: undefined })).toEqual(initialState);
  });

  it('should handle setAuthData', () => {
    const mockAuthData = { isSignedIn: true, id: '123' };
    const nextState = authReducer(initialState, setAuthData(mockAuthData));

    expect(nextState.isSignedIn).toBe(true);
    expect(nextState.id).toBe('123');
  });
});
