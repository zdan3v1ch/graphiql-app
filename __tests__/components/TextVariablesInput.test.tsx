import TextVariablesInput from '@/components/TextVariablesInput/TextVariablesInput';
import { fireEvent, render, screen } from '@testing-library/react';

const mockedFunction = jest.fn();
jest.mock('@mui/icons-material', () => {
  const originalModule = jest.requireActual('@mui/icons-material');
  return {
    ...originalModule,
    Delete: () => <div>Delete</div>,
  };
});

describe('Given TextVariablesInput component', () => {
  it('when render, should have relevant value', () => {
    render(
      <TextVariablesInput
        title="Test title"
        variables={[['key1', 'value1']]}
        onVariablesChange={jest.fn()}
      />
    );

    const result = screen.queryByText('Test title');
    const input = screen.queryByDisplayValue('key1');
    const addButton = screen.queryByText('Test titleAdd');

    expect(result).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(addButton).toBeInTheDocument();
  });
  it('when variables empty, add button is not displayed', () => {
    render(
      <TextVariablesInput
        title="Test title"
        variables={[]}
        onVariablesChange={jest.fn()}
      />
    );

    const addButton = screen.queryByText('Test titleAdd');
    expect(addButton).not.toBeInTheDocument();
  });
  it('when add button clicked, onVariablesChange is called', () => {
    render(
      <TextVariablesInput
        title="Test title"
        variables={[['key1', 'value1']]}
        onVariablesChange={mockedFunction}
      />
    );

    const addButton = screen.getByText('Test titleAdd');

    fireEvent.click(addButton);
    expect(mockedFunction).toHaveBeenCalled();
  });
  it('when delete button clicked, variables deleted', () => {
    render(
      <TextVariablesInput
        title="Test title"
        variables={[['key1', 'value1']]}
        onVariablesChange={mockedFunction}
      />
    );

    const deleteButton = screen.getByTestId('DeleteIcon');

    fireEvent.click(deleteButton);
    expect(mockedFunction).toHaveBeenCalledWith([]);
  });
  it('when change input, onVariablesChange should be called', () => {
    render(
      <TextVariablesInput
        title="Test title"
        variables={[['key1', 'value1']]}
        onVariablesChange={mockedFunction}
      />
    );

    const input = screen.getByDisplayValue('key1');

    fireEvent.change(input, { target: { value: ['new key'] } });
    expect(mockedFunction).toHaveBeenCalled();
  });
});
