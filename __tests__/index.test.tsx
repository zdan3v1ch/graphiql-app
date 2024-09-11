import { render, screen } from '@testing-library/react';
import Footer from '@/app/[lng]/components/Footer/Footer';

describe('Home', () => {
  it.skip('renders content text', () => {
    render(<Footer />);

    const heading = screen.getByText(2024);

    expect(heading).toBeInTheDocument();
  });
});
