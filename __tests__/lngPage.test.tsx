// import { render, screen, waitFor } from '@testing-library/react';
// import Main from '@/app/[lng]/page';
// import { auth } from '@/auth';
// import { initI18n } from '@/app/i18n/i18n';
// import '@testing-library/jest-dom';
// import { namespaces } from '@/app/i18n/data/i18n.constants';
// import { Params } from '@/app/i18n/data/i18n.interface';
// import { protectedNavButtonParams } from '@/app/[lng]/components/Header/constants';


// jest.mock('@/auth');
// jest.mock('@/app/i18n/i18n');

// describe('Main Component', () => {
//   const mockI18n = {
//     t: jest.fn((key: string) => key),
//   };

//   beforeEach(() => {
//     jest.clearAllMocks();
//     (initI18n as jest.Mock).mockResolvedValue(mockI18n);
//   });

//   it('renders correctly for unauthenticated users', async () => {
//     (auth as jest.Mock).mockResolvedValue(null);

//     render(<Main params={{ lng: 'en' } as Params} />);
//     await waitFor(() => {
//       expect(initI18n).toHaveBeenCalledWith({ language: 'en', namespaces });
//     });

//     expect(screen.getByText('title')).toBeInTheDocument();
//     expect(screen.getByText('signIn')).toBeInTheDocument();
//     expect(screen.getByText('signUp')).toBeInTheDocument();
//   });

//   it('renders correctly for authenticated users', async () => {
//     (auth as jest.Mock).mockResolvedValue({
//       user: { name: 'Test' },
//     });

//     render(<Main params={{ lng: 'en' } as Params} />);

//     await waitFor(() => {
//       expect(initI18n).toHaveBeenCalledWith({ language: 'en', namespaces });
//     });

//     expect(screen.getByText('authTitle')).toBeInTheDocument();
//     expect(screen.getByText('authTitle')).toHaveTextContent('authTitle Test!');

//     protectedNavButtonParams.forEach((navButton) => {
//       expect(screen.getByText(navButton.labelHeaderNsKey)).toBeInTheDocument();
//     });
//   });
// });
