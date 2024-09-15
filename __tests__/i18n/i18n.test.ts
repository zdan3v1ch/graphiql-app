import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';
import { initI18n } from '@/app/i18n/i18n';
import { i18nConfig, defaultNS } from '@/app/i18n/data/i18n.constants';

jest.mock('i18next', () => ({
  createInstance: jest.fn(() => ({
    use: jest.fn().mockReturnThis(),
    init: jest.fn().mockResolvedValue(true),
    t: jest.fn(),
    services: {
      resourceStore: {
        data: {},
      },
    },
  })),
}));

jest.mock('i18next-resources-to-backend', () => jest.fn(() => jest.fn()));

jest.mock('react-i18next/initReactI18next', () => ({
  initReactI18next: jest.fn(),
}));

describe('initI18n', () => {
  const defaultLanguage = 'en';
  const defaultNamespaces = ['common'];

  it('initializes i18n instance with default resources', async () => {
    const { i18n, resources, t } = await initI18n({
      language: defaultLanguage,
      namespaces: defaultNamespaces,
    });
    const mockI18nUse = jest.spyOn(i18n, 'use');
    const mockI18nInit = jest.spyOn(i18n, 'init');

    expect(createInstance).toHaveBeenCalled();
    expect(mockI18nUse).toHaveBeenCalledWith(initReactI18next);
    expect(mockI18nInit).toHaveBeenCalledWith({
      lng: defaultLanguage,
      fallbackLng: i18nConfig.locales[0],
      supportedLngs: i18nConfig.locales,
      defaultNS: defaultNS,
      fallbackNS: defaultNS,
      ns: defaultNamespaces,
      preload: i18nConfig.locales,
    });
    expect(resources).toEqual(i18n.services.resourceStore.data);
    expect(t).toBe(i18n.t);
  });

  it('initializes i18n instance with provided resources', async () => {
    const mockResources = {
      en: {
        common: {
          key: 'value',
        },
      },
    };

    const { i18n, t } = await initI18n({
      language: defaultLanguage,
      namespaces: defaultNamespaces,
      resources: mockResources,
    });
    const mockI18nUse = jest.spyOn(i18n, 'use');
    const mockI18nInit = jest.spyOn(i18n, 'init');

    expect(createInstance).toHaveBeenCalled();
    expect(mockI18nUse).toHaveBeenCalledWith(initReactI18next);
    expect(mockI18nInit).toHaveBeenCalledWith({
      lng: defaultLanguage,
      fallbackLng: i18nConfig.locales[0],
      supportedLngs: i18nConfig.locales,
      defaultNS: defaultNS,
      fallbackNS: defaultNS,
      ns: defaultNamespaces,
      resources: mockResources,
      preload: [],
    });
    expect(t).toBe(i18n.t);
  });
});
