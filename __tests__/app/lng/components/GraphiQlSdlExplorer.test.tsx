import { render, screen } from '@testing-library/react';
import { GraphQLSchema, buildSchema } from 'graphql';

import SdlExplorer from '@/app/[lng]/components/GraphiQl/components/SdlExplorer';

describe('SdlExplorer', () => {
  it('should render the title from translation', () => {
    render(<SdlExplorer />);

    const titleElement = screen.getByText('sdlExplorerTitle');
    expect(titleElement).toBeInTheDocument();
  });

  it('should render the prompt when no schema is provided', () => {
    render(<SdlExplorer />);

    const promptElement = screen.getByText('sdlExplorerPrompt');
    expect(promptElement).toBeInTheDocument();
  });

  it('should render the schema in CodeMirror when schema is provided', () => {
    const schema: GraphQLSchema = buildSchema(`
      type Query {
        hello: String
      }
    `);

    render(<SdlExplorer schema={schema} />);

    const codeMirrorElement = screen.getByText(/hello/);
    expect(codeMirrorElement).toBeInTheDocument();
  });

  it('should render CodeMirror with readonly mode when schema is provided', () => {
    const schema: GraphQLSchema = buildSchema(`
      type Query {
        hello: String
      }
    `);

    render(<SdlExplorer schema={schema} />);

    const codeMirrorElement = screen.getByTestId('sdl-explorer');
    expect(codeMirrorElement).toBeInTheDocument();
  });
});
