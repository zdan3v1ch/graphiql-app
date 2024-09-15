import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GraphqlQueryEditor from '@/components/GraphqlQueryEditor/GraphqlQueryEditor';
import GraphqlQueryInput from '@/app/[lng]/components/GraphiQl/components/GraphqlQueryInput';

jest.mock('@/components/GraphqlQueryEditor/GraphqlQueryEditor', () => jest.fn(({ onChange }: { onChange: (value: string) => void }) => (
  <input
    type="text"
    data-testid="graphql-editor"
    onChange={(e) => onChange(e.target.value)}
  />
)));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('GraphqlQueryInput Component', () => {
  const defaultProps = {
    query: '',
    onQueryChange: jest.fn(),
    schema: undefined,
  };

  it('should render component with default props', () => {
    render(<GraphqlQueryInput {...defaultProps} />);

    expect(screen.getByText('queryGraphql')).toBeInTheDocument();

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should toggle the visibility of GraphqlQueryEditor when button is clicked', () => {
    render(<GraphqlQueryInput {...defaultProps} />);

    const toggleButton = screen.getByRole('button');
    
    fireEvent.click(toggleButton);
    expect(screen.getByTestId('graphql-editor')).toBeInTheDocument();

    fireEvent.click(toggleButton);
    expect(screen.queryByTestId('graphql-editor')).not.toBeInTheDocument();
  });

  it('should render GraphqlQueryEditor with the correct props when visible', () => {
    const propsWithQuery = { ...defaultProps, query: 'initial query' };
    render(<GraphqlQueryInput {...propsWithQuery} />);

    const toggleButton = screen.getByRole('button');

    fireEvent.click(toggleButton);

    expect(GraphqlQueryEditor).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 'initial query',
        onChange: defaultProps.onQueryChange,
        schema: undefined,
        height: '350px',
      }),
      {}
    );
  });

  it('should call onQueryChange when the query input changes', () => {
    render(<GraphqlQueryInput {...defaultProps} />);
    
    const toggleButton = screen.getByRole('button');
    fireEvent.click(toggleButton);

    const input = screen.getByTestId('graphql-editor');
    fireEvent.change(input, { target: { value: 'new query' } });

    expect(defaultProps.onQueryChange).toHaveBeenCalledWith('new query');
  });
});
