import React, { useState } from 'react';
import { initReactI18next } from 'react-i18next';
import { Provider as StoreProvider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import {
  MediaContextProvider,
  NotificationContextProvider,
  useNotification,
  useTheme,
  LANG,
  LangContextProvider,
} from '@shared/index';
import { store } from '@store/index';
import { ConfigProvider, Switch, theme as antTheme } from 'antd';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';
import { router } from './router/router';
import './index.css';

i18n
  .use(initReactI18next)
  .use(HttpBackend)
  .use(LanguageDetector)
  .init({
    fallbackLng: 'ru',
    debug: true,
    ns: ['translation', 'phrases'], // Добавляем namespaces
    defaultNS: 'translation',
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    interpolation: {
      escapeValue: false,
    },
  });

export const App = () => {
  const { theme, toggleTheme } = useTheme();
  const themeConfig = {
    algorithm: theme === 'dark' ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
  };

  const { openNotification, NotificationContext: NotificationCtx } = useNotification();
  const [lang, setLang] = useState(LANG.RU);

  return (
    <React.StrictMode>
      <LangContextProvider lang={lang} setLang={setLang}>
        <StoreProvider store={store}>
          <ConfigProvider theme={themeConfig}>
            <MediaContextProvider>
              <NotificationContextProvider openNotification={openNotification}>
                <div className={theme === 'dark' ? 'bg-black' : 'bg-white'}>
                  <Switch
                    className="absolute right-4 top-4"
                    checkedChildren="Dark"
                    unCheckedChildren="Light"
                    defaultChecked
                    onChange={toggleTheme}
                  />
                  
                </div>
                <div className={lang === 'ru' ? 'bg-black' : 'bg-white'}>
                  <Switch
                    className="absolute right-4 top-12"
                    checkedChildren="RU"
                    unCheckedChildren="EN"
                    defaultChecked
                    onChange={() => setLang((prev) => (prev === LANG.EN ? LANG.RU : LANG.EN))}
                  />
                  
                </div>
                <RouterProvider router={router} />
                  <NotificationCtx />
              </NotificationContextProvider>
            </MediaContextProvider>
          </ConfigProvider>
        </StoreProvider>
      </LangContextProvider>
    </React.StrictMode>
  );
};
