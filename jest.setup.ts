import '@testing-library/jest-dom/jest-globals';
import '@testing-library/jest-dom';

jest.mock('react-i18next', () => {
  const originalModule = jest.requireActual('react-i18next');
  return {
    ...originalModule,
    useTranslation: () => ({ t: (key: string) => key }),
  };
});
