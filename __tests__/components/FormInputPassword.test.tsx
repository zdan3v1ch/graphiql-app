import { render, screen } from '@testing-library/react';
import FormInputPassword from '@/components/form/FormInputPassword';
import { useForm } from 'react-hook-form';

const InputInjected = () => {
  const form = useForm();
  return (
    <FormInputPassword
      label={'Test Label'}
      name={'Password input'}
      control={form.control}
    />
  );
};

describe('Given FormInputPassword component', () => {
  it('when render, should have relevant value', () => {
    render(<InputInjected />);

    const result = screen.queryAllByText('Test Label');

    expect(result[0]).toBeInTheDocument();
  });
});
