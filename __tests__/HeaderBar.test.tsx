import HeaderBar from '@/app/[lng]/components/Header/components/HeaderBar';
import { render, screen } from '@testing-library/react';



describe('HeaderBar Component', () => {
  it('renders children correctly', () => {
    render(
      <HeaderBar>
        <div>Test Child</div>
      </HeaderBar>
    );
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });
});
