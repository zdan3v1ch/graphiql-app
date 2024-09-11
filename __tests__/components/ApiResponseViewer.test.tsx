import { render, screen } from '@testing-library/react';
import ApiResponseViewer from '@/components/ApiResponseViewer/ApiResponseViewer';

jest.mock('@mui/material', () => {
  const originalModule = jest.requireActual('@mui/material');
  return {
    ...originalModule,
    CircularProgress: () => <div>Loader</div>,
  };
});

describe('Given ApiResponseViewer component', () => {
  it('when loading=true, should render loader', () => {
    render(<ApiResponseViewer loading={true} />);

    const loader = screen.queryByText('Loader');

    expect(loader).toBeInTheDocument();
  });

  it('when loading=false and response undefined, should render relevant data', () => {
    render(<ApiResponseViewer loading={false} />);

    const emptyResponse = screen.queryByText('emptyResponse');

    expect(emptyResponse).toBeInTheDocument();
  });
  it('when loading=false and response string, should render relevant data', () => {
    const response = { status: 200, data: 'Text string' };
    render(<ApiResponseViewer response={response} loading={false} />);

    const data = screen.queryByText('Text string');

    expect(data).toBeInTheDocument();
  });
  it('when loading=false and response json, should render relevant data', () => {
    const response = { status: 200, data: { test: 'json data' } };
    render(<ApiResponseViewer response={response} loading={false} />);

    const data = screen.queryByText('"json data"');

    expect(data).toBeInTheDocument();
  });
});
