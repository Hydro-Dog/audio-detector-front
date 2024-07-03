import React, { createContext, useState } from 'react';
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
  AudioSettingsContextProvider,
  VideoSettingsContextProvider,
} from '@shared/index';
import { store } from '@store/index';
import { ConfigProvider, Switch, theme as antTheme } from 'antd';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';
import { router } from './router/router';
import dayjs from 'dayjs';
import 'dayjs/locale/ru'; // импорт русской локализации
import utc from 'dayjs/plugin/utc'; // для работы с UTC
import ruRU from 'antd/lib/locale/ru_RU';
import enUS from 'antd/lib/locale/en_US';

import './index.css';

dayjs.extend(utc); // активация плагина
dayjs.locale('ru'); // установка локали

i18n
  .use(initReactI18next)
  .use(HttpBackend)
  .use(LanguageDetector)
  .init({
    fallbackLng: 'ru',
    debug: false, //вывод отладочной информации в консоль
    ns: ['translation', 'phrases'], // Добавляем namespaces
    defaultNS: 'translation',
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    interpolation: {
      escapeValue: false,
    },
  });

export const AudioLevelContext = createContext<any>(null);

export const App = () => {
  const { theme, toggleTheme } = useTheme();
  const themeConfig = {
    algorithm: theme === 'dark' ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
  };

  const { openNotification, NotificationContext: NotificationCtx } = useNotification();
  const [lang, setLang] = useState(LANG.RU);

  const [audioLevel, setAudioLevel] = useState(0);

  return (
    <React.StrictMode>
      <LangContextProvider lang={lang} setLang={setLang}>
        <StoreProvider store={store}>
          <ConfigProvider theme={themeConfig} locale={lang === LANG.RU ? ruRU : enUS}>
            <MediaContextProvider>
              <AudioLevelContext.Provider value={{ audioLevel, setAudioLevel }}>
                <AudioSettingsContextProvider>
                  <VideoSettingsContextProvider>
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
                  </VideoSettingsContextProvider>
                </AudioSettingsContextProvider>
              </AudioLevelContext.Provider>
            </MediaContextProvider>
          </ConfigProvider>
        </StoreProvider>
      </LangContextProvider>
    </React.StrictMode>
  );
};
