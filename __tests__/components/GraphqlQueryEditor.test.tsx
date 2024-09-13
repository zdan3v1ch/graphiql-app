import JsonEditor from '@/components/GraphqlQueryEditor/GraphqlQueryEditor';
import { render, screen } from '@testing-library/react';

describe('Given JsonEditor component', () => {
  it('when render, should have relevant value', () => {
    render(<JsonEditor value={'"test":"json data"'} onChange={jest.fn()} />);

    const result = screen.queryByText('"json data"');

    expect(result).toBeInTheDocument();
  });
});
