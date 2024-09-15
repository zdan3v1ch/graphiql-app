import { render, screen } from '@testing-library/react';
import FormInputText from '@/components/form/FormInputText';
import { useForm } from 'react-hook-form';

const InputInjected = () => {
  const form = useForm();
  return (
    <FormInputText
      label={'Test Label'}
      name={'Text input'}
      control={form.control}
    />
  );
};

describe('Given FormInputText component', () => {
  it('when render, should have relevant value', () => {
    render(<InputInjected />);

    const result = screen.queryAllByText('Test Label');

    expect(result[0]).toBeInTheDocument();
  });
});
