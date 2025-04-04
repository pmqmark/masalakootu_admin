import { store , persistor } from './store/store';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import App from './App.jsx';
import ReactDOM from 'react-dom/client';
import { PersistGate } from 'redux-persist/integration/react';

const root = ReactDOM.createRoot(document.getElementById('__admin_panel'));
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor} >
        <Toaster />
        <App />
      </PersistGate>
    </Provider>
  </BrowserRouter>
);
