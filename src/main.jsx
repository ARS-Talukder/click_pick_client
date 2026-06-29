import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import App from './App.jsx'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ScrollToTop from './pages/ScrollToTop.jsx';
import TagManager from 'react-gtm-module';

const tagManagerArgs = {
  gtmId: "GTM-MFJZ66RS", // Replace with your GTM ID
};

TagManager.initialize(tagManagerArgs);

const queryClient = new QueryClient()
ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ScrollToTop />
      <App />
    </BrowserRouter>,
  </QueryClientProvider>
)
