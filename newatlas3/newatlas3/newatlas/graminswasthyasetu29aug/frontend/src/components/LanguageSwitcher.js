import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('hi')}>हिन्दी</button>
      <button onClick={() => changeLanguage('kn')}>ಕನ್ನಡ</button>
    </div>
  );
};

export default LanguageSwitcher;
