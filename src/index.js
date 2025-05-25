import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import PodcastPage from './PodcastPage';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import AdminAnalyticsPage from './AdminAnalyticsPage';
import reportWebVitals from './reportWebVitals';
import { initAnalytics } from './analytics';

const root = ReactDOM.createRoot(document.getElementById('root'));

const path = window.location.pathname;
const searchParams = new URLSearchParams(window.location.search);
const page = searchParams.get('page');

let PageComponent = App;
if (path.startsWith('/podcast') || path === '/podcast.html' || page === 'podcast') {
  PageComponent = PodcastPage;
} else if (path.startsWith('/login')) {
  PageComponent = LoginPage;
} else if (path.startsWith('/signup')) {
  PageComponent = SignupPage;
} else if (path.startsWith('/admin-analytics')) {
  PageComponent = AdminAnalyticsPage;
}

initAnalytics();

root.render(
  <React.StrictMode>
    <PageComponent />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
