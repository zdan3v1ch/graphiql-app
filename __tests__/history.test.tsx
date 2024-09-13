import { render, screen } from '@testing-library/react';
import History from '@/app/[lng]/components/History/History';
import { Store } from '@/lib/localStorage/localStorage';
import { Session } from 'next-auth';
import { useRouter, usePathname } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

jest.mock('@/lib/localStorage/localStorage', () => ({
  Store: {
    getRequests: jest.fn(),
  },
}));

const sessionMock: Session = {
  user: { email: 'test@example.com' },
  expires: '',
};

describe('History Component', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });
    (usePathname as jest.Mock).mockReturnValue('/some-path');
  });

  it('should render empty state when there are no requests', () => {
    (Store.getRequests as jest.Mock).mockReturnValue([]);

    render(<History session={sessionMock} />);

    expect(screen.getByText('emptyHistory')).toBeInTheDocument();
  });

  it('should correctly decode and display request URLs', () => {
    const mockRequests = ['GET/aHR0cDovL2V4YW1wbGUuY29t'];
    (Store.getRequests as jest.Mock).mockReturnValue(mockRequests);

    render(<History session={sessionMock} />);

    expect(screen.getByText('GET http://example.com')).toBeInTheDocument();
  });
});
