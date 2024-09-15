import { render } from '@testing-library/react';

import { makeStore } from '@/lib/store';

import StoreProvider from '@/app/[lng]/StoreProvider';

jest.mock('@/lib/store', () => ({
  makeStore: jest.fn(() => ({
    getState: jest.fn(),
    subscribe: jest.fn(),
    dispatch: jest.fn(),
  })),
}));

describe('StoreProvider', () => {
  it('renders children inside the Redux Provider', () => {
    const mockChildText = 'Hello, Store!';

    const { getByText } = render(
      <StoreProvider>
        <div>{mockChildText}</div>
      </StoreProvider>
    );

    expect(getByText(mockChildText)).toBeInTheDocument();
  });

  it('initializes the store correctly with makeStore', () => {
    render(
      <StoreProvider>
        <div>Test</div>
      </StoreProvider>
    );

    expect(makeStore).toHaveBeenCalledTimes(1);
  });

  it('does not recreate the store on re-renders', () => {
    const { rerender } = render(
      <StoreProvider>
        <div>Test</div>
      </StoreProvider>
    );

    rerender(
      <StoreProvider>
        <div>Test Again</div>
      </StoreProvider>
    );

    expect(makeStore).toHaveBeenCalledTimes(1);
  });
});
