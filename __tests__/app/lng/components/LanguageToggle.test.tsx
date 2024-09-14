import { render, screen } from '@testing-library/react';
import { LanguageToggle } from '@/app/[lng]/components/LanguageToggle/LanguageToggle';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
  useSearchParams: () => []
}));

describe('Given LanguageToggle component', () => {
  it('when render, should have relevant value', () => {
    render(<LanguageToggle />);

    const result = screen.getByText('English');

    expect(result).toBeInTheDocument();
  });
});
