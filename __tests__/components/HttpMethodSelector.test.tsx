import HttpMethodSelector from '@/components/HttpMethodSelector/HttpMethodSelector';
import { render, screen } from '@testing-library/react';

describe('Given HttpMethodSelector component', () => {
  it('when render, should have relevant value', () => {
    render(<HttpMethodSelector method="POST" onMethodChange={jest.fn()} />);

    const result = screen.queryByDisplayValue('POST');

    expect(result).toBeInTheDocument();
  });
});
