import * as React from 'react';
import I18nInstance from '../../i18n';
import styled from 'styled-components';

export const LANGUAGES = {
  PL: 'pl',
  EN: 'en',
};

const Item = styled.span`
  cursor: pointer;
  ${({ active }) => active && `font-weight: 700;`}
`;

const onSwitchLanguage = lang => I18nInstance.changeLanguage(lang);

const LanguageSwitcher = () => {
  const currentLanguage = I18nInstance.language ? I18nInstance.language : 'en';
  return (
    <div>
      {Object.values(LANGUAGES)
        .map(lang => (
          <Item
            active={lang === currentLanguage}
            onClick={() => onSwitchLanguage(lang)}
          >
            {lang}
          </Item>
        ))
        .reduce((prev, curr) => (
          <React.Fragment>
            {prev} / {curr}
          </React.Fragment>
        ))}
    </div>
  );
};

export default LanguageSwitcher;
