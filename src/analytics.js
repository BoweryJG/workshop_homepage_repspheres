import ReactGA from 'react-ga4';

export function initAnalytics() {
  if (!process.env.REACT_APP_GA_ID) {
    console.warn('REACT_APP_GA_ID not set');
    return;
  }
  ReactGA.initialize(process.env.REACT_APP_GA_ID);
  logPageView();
  window.addEventListener('popstate', logPageView);
}

export function logPageView() {
  ReactGA.send({ hitType: 'pageview', page: window.location.pathname });
}
