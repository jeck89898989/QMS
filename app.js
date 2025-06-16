import React from 'react';
import ReactDOM from 'react-dom/client';
import htm from 'htm';
import { App } from './components/App.js';

const html = htm.bind(React.createElement);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(html`<${App} />`);