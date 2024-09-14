import { render, screen } from '@testing-library/react';
import NotFound from '@/app/[lng]/not-found';

describe('Page not found', () => {
  it('renders Not found', () => {
    render(<NotFound />);

    const heading = screen.getByText('404 - Page Not Found');

    expect(heading).toBeInTheDocument();
  });
});
