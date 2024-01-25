import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import Router from './routes';
import NavBar from './components/nav-bar';

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);

root.render(
	<React.StrictMode>
		<NavBar></NavBar>
		<RouterProvider router={Router}></RouterProvider>
	</React.StrictMode>
);
