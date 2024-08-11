import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
} from 'react';
import { useTranslation } from 'react-i18next';

export enum LANG {
  RU = 'ru',
  EN = 'en',
}

export type LangContextType = {
  lang: LANG;
  setLang: Dispatch<SetStateAction<LANG>>;
};

const langContextInitialValue: LangContextType = {
  lang: LANG.RU,
  setLang: () => null,
};

const LangContext = createContext<LangContextType>(langContextInitialValue);

export const useLangContext = () => useContext(LangContext);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const LangContextProvider = ({ children, lang, setLang }: PropsWithChildren<any>) => {
  const { i18n } = useTranslation();

  useEffect(() => {
    console.log('lang: ', lang);
    i18n.changeLanguage(lang);
  }, [i18n, lang]);

  return (
    <LangContext.Provider
      value={{
        lang,
        setLang,
      }}>
      {children}
    </LangContext.Provider>
  );
};
