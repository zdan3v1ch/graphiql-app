import EndpointUrlInput from '@/components/EndpointUrlInput/EndpointUrlInput';
import { render, screen } from '@testing-library/react';

describe('Given EndpointUrlInput component', () => {
  it('when render, should have relevant value', () => {
    render(
      <EndpointUrlInput
        endpointUrl="Endpoint Value"
        onEndpointUrlChange={jest.fn()}
      />
    );

    const result = screen.queryByDisplayValue('Endpoint Value');

    expect(result).toBeInTheDocument();
  });
});
