import NavButton from '@/components/NavButton';
import { fireEvent, render, screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';

const mockedFunction = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('Given NavButton component', () => {
  it('when render, should have relevant value', () => {
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });
    render(
      <NavButton
        label="Test label"
        url="/"
        onClick={mockedFunction}
        buttonProps={{}}
      />
    );

    const result = screen.getByText('Test label');
    fireEvent.click(result);
    expect(mockedFunction).toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalled();
  });

});
