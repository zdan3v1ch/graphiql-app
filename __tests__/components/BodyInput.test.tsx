import BodyInput from '@/components/BodyInput/BodyInput';
import { fireEvent, render, screen } from '@testing-library/react';

const mockedFunction = jest.fn();

describe('Given BodyInput component', () => {
  it('when render, should have relevant value', () => {
    render(
      <BodyInput
        title="Test title"
        body="Test body"
        onBodyChange={mockedFunction}
      />
    );

    const result = screen.queryByText('Test title');
    const input = screen.queryByText('Test body');

    expect(result).toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });
  it('when body and prompt do not empty, prompt is displayed', () => {
    render(
      <BodyInput
        title="Test title"
        body="Test body"
        onBodyChange={mockedFunction}
        prompt="Test prompt"
      />
    );

    const result = screen.getByText('Test prompt');
    expect(result).toBeInTheDocument();
  });
  it('when body empty add prompt not empty prompt not displayed', () => {
    render(
      <BodyInput
        title="Test title"
        body=""
        onBodyChange={mockedFunction}
        prompt="Test prompt"
      />
    );

    const result = screen.queryByText('Test prompt');
    expect(result).not.toBeInTheDocument();
  });
  it('when focus out from input onBodyChange is called', () => {
    render(
      <BodyInput
        title="Test title"
        body="Test body"
        onBodyChange={mockedFunction}
      />
    );

    const input = screen.getByText('Test body');
    fireEvent.blur(input);
    expect(mockedFunction).toHaveBeenCalled();
  });
});
