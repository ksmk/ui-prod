import { ApolloProvider } from 'react-apollo';
import * as React from 'react';
import { client } from './src/apollo/client';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';

export const wrapRootElement = ({ element }) => (
  <MuiPickersUtilsProvider utils={MomentUtils}>
    <ApolloProvider client={client}>
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>{element}</Provider>
      </I18nextProvider>
    </ApolloProvider>
  </MuiPickersUtilsProvider>
);
