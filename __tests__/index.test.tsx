import { render, screen } from '@testing-library/react';
import Home from '../app/[lng]/page';

describe('Home', () => {
  it('renders content text', () => {
    render(<Home />);

    const heading = screen.getByText('Explore starter templates for Next.js.');

    expect(heading).toBeInTheDocument();
  });
});
