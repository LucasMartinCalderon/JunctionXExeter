import React from 'react';
import ReactDOM from 'react-dom';
import './styles/base.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { CloudinaryContext } from 'cloudinary-react';
import WebFont from 'webfontloader';

//GraphQL
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import configureStore from './redux/configureStore';
import config from './config';

const httpLink = createHttpLink({
    uri: config.GRAPHQL_BASE_URL
});

const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache()
});

const { store, persistor } = configureStore();

WebFont.load({
    google: {
        families: ['Montserrat:400,400i,700,700i', 'Lato:400,400i,700,700i']
    }
});

ReactDOM.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <ApolloProvider client={client}>
                <CloudinaryContext cloudName={config.CLOUDINARY_CLOUD_NAME}>
                    <App />
                </CloudinaryContext>
            </ApolloProvider>
        </PersistGate>
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
