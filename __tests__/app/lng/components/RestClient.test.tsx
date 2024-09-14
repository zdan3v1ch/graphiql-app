import { fireEvent, render, screen } from '@testing-library/react';
import { RestClient } from '@/app/[lng]/components/RestClient/RestClient';
import { usePathname } from 'next/navigation';
import { useLazyGetRestfulApiResponseQuery } from '@/lib/services/apiResponse';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
  useSearchParams: () => []
}));

jest.mock('@/lib/services/apiResponse', () => ({
  useLazyGetRestfulApiResponseQuery: jest.fn()
}));
jest.mock('@/app/utils', () => ({
  removeLocaleFromUrl: () => '/GET',
  parseRestfulClientUrl: () => ''
}));
jest.mock('@/app/[lng]/components/RestClient/utils', () => ({
  validateRequestData: () =>     ({validParsedMethod: 'GET',
  validParsedEndpointUrl: 'Endpoint',
  validParsedHeaders: ['Key1', 'value1'],
  validParsedBody: 'Body'})
}));
const session = {
  user: {
    email: 'test@email'
  },
  expires: ''
};

describe('Given RestClient component', () => {
  it('when render, should have relevant value', () => {

    (usePathname as jest.Mock).mockReturnValue({
      pathname: '/en/GET',
    }); 
    (useLazyGetRestfulApiResponseQuery as jest.Mock).mockReturnValue([jest.fn(),{}]);
    render(<RestClient session={session}/>);

    const result = screen.queryByDisplayValue('Endpoint');

    expect(result).toBeInTheDocument();
  });
  it('when render, should have relevant value', () => {
    (usePathname as jest.Mock).mockReturnValue({
      pathname: '/en/GET',
    });
    (useLazyGetRestfulApiResponseQuery as jest.Mock).mockReturnValue([jest.fn(),{}]);
    
    render(<RestClient session={session}/>);

    const result: HTMLInputElement = screen.getByDisplayValue('Endpoint');
    fireEvent.change(result,{target: {value: 'NewEndpoint'}});
    expect(result.value).toBe('NewEndpoint');
  });
  it('when render, should have relevant value', () => {
    (usePathname as jest.Mock).mockReturnValue({
      pathname: '/en/GET',
    });
    (useLazyGetRestfulApiResponseQuery as jest.Mock).mockReturnValue([jest.fn(),{}]);
    
    render(<RestClient session={session}/>);

    const result: HTMLInputElement = screen.getByDisplayValue('GET');
    fireEvent.change(result,{target: {value: 'POST'}});
    expect(result.value).toBe('POST');
  });
  it('when error, error should be add', () => {
    (usePathname as jest.Mock).mockReturnValue({
      pathname: '/en/GET',
    });
    (useLazyGetRestfulApiResponseQuery as jest.Mock).mockReturnValue([jest.fn(),{error: 'Test Error'}]);

    render(<RestClient session={session}/>);
    const result = screen.getByText('Unknown status: Unexpected error');
    expect(result).toBeInTheDocument();
  });
  it('when render, should have relevant value', () => {
    (usePathname as jest.Mock).mockReturnValue({
      pathname: '/en/GET',
    });
    (useLazyGetRestfulApiResponseQuery as jest.Mock).mockReturnValue([jest.fn(),{}]);
    
    render(<RestClient session={session}/>);

    const result: HTMLInputElement = screen.getByDisplayValue('Key1');
    fireEvent.change(result,{target: {value: 'Key2'}});
    expect(result.value).toBe('Key2');
  });
});
