import { render, screen } from '@testing-library/react';
import Home from '../app/page';

describe('Home', () => {
  it('renders content text', () => {
    render(<Home />);

    const heading = screen.getByText('Main content');

    expect(heading).toBeInTheDocument();
  });
});
