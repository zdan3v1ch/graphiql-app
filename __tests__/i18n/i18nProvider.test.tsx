import { render, screen, waitFor } from '@testing-library/react';
import { createInstance } from 'i18next';
import { initI18n } from '@/app/i18n/i18n';
import I18nProvider from '@/app/i18n/i18nProvider';

jest.mock('i18next', () => ({
  createInstance: jest.fn(() => ({
    use: jest.fn().mockReturnThis(),
    init: jest.fn().mockResolvedValue(true),
  })),
}));

jest.mock('@/app/i18n/i18n', () => ({
  initI18n: jest.fn().mockResolvedValue({
    i18n: { services: { resourceStore: { data: {} } }, t: jest.fn() },
    resources: {},
    t: jest.fn(),
  }),
}));

describe('I18nProvider', () => {
  const mockChildren = <div>Test Child</div>;

  it('should render children', async () => {
    render(
      <I18nProvider language="en" namespaces={['common']} resources={{}}>
        {mockChildren}
      </I18nProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Child')).toBeInTheDocument();
    });
  });

  it('should call initI18n with correct arguments', async () => {
    const language = 'en';
    const namespaces = ['common'];
    const resources = {};

    render(
      <I18nProvider
        language={language}
        namespaces={namespaces}
        resources={resources}
      >
        {mockChildren}
      </I18nProvider>
    );

    await waitFor(() => {
      expect(initI18n).toHaveBeenCalledWith({
        language,
        namespaces,
        i18nInst: expect.any(Object) as unknown,
        resources,
      });
    });
  });

  it('should use createInstance to create i18n instance', () => {
    render(
      <I18nProvider language="en" namespaces={['common']} resources={{}}>
        {mockChildren}
      </I18nProvider>
    );

    expect(createInstance).toHaveBeenCalled();
  });
});
