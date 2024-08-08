import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/styles/index.css'
import App from './components/App';
import { ApolloProvider } from '@apollo/client';
import gqlapi from './apis/gqlapi';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ApolloProvider client={gqlapi}>
        <App />
    </ApolloProvider>
);