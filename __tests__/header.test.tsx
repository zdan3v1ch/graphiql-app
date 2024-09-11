import { render } from '@testing-library/react';
import Header from '@/app/[lng]/components/Header/Header';



describe('Header Component', () => {


  it('renders Sign In and Sign Up buttons when user is not signed in', async () => {
    // (auth as jest.Mock).mockResolvedValue(null);
    // render(<Header language="en" />);

    // await waitFor(() => {
    //   expect(screen.getByText('signIn')).toBeInTheDocument();
    //   expect(screen.getByText('signUp')).toBeInTheDocument();
    // });
    const serverComp = await Header({ language: 'en' });
    const {getByText} = render(serverComp);
    const signIn = getByText('signIn');
    expect(signIn).toBeInTheDocument()
  });

  // it('renders user navigation elements when user is signed in', async () => {
  //   render(<Header language="en" />);

  //   await waitFor(() => {
  //     expect(screen.getByText('John Doe')).toBeInTheDocument();
  //     expect(screen.getByRole('button', { name: /signOut/i })).toBeInTheDocument();
  //   });
  // });

  // it('renders LanguageToggle component', async () => {
  //   render(<Header language="en" />);

  //   await waitFor(() => {
  //     expect(screen.getByRole('button', { name: /language toggle/i })).toBeInTheDocument();
  //   });
  // });

  // it('shows BurgerMenu only on mobile screens and hides other buttons', async () => {
  //   render(<Header language="en" />);

  //   global.innerWidth = 500;
  //   window.dispatchEvent(new Event('resize'));

  //   await waitFor(() => {
  //     expect(screen.getByRole('button', { name: /burger menu/i })).toBeInTheDocument();
  //     expect(screen.queryByText('John Doe')).toBeNull();
  //   });
  // });

  // it('shows navigation buttons and LanguageToggle on larger screens', async () => {
  //   render(<Header language="en" />);

  //   global.innerWidth = 1200;
  //   window.dispatchEvent(new Event('resize'));

  //   await waitFor(() => {
  //     expect(screen.getByText('John Doe')).toBeInTheDocument();
  //     expect(screen.getByRole('button', { name: /language toggle/i })).toBeInTheDocument();
  //     expect(screen.queryByRole('button', { name: /burger menu/i })).toBeNull();
  //   });
  // });
});
