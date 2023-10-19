import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import {
  AxiosInterceptorContext,
  DappProvider,
  Layout,
  NotificationModal,
  SignTransactionsModals,
  // uncomment this to use the custom transaction tracker
  // TransactionsTracker
  TransactionsToastList
} from 'components';

import {
  apiTimeout,
  environment,
  sampleAuthenticatedDomains,
  walletConnectV2ProjectId
} from 'config';
import { RouteNamesEnum } from 'localConstants';
import { PageNotFound } from 'pages';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { routes } from 'routes';

const queryClient = new QueryClient();

const AppContent = () => {
  return (
    <DappProvider
      environment={environment}
      customNetworkConfig={{
        name: 'customConfig',
        apiTimeout,
        walletConnectV2ProjectId
      }}
      dappConfig={{
        shouldUseWebViewProvider: true,
        logoutRoute: RouteNamesEnum.dashboard
      }}
      customComponents={{
        transactionTracker: {
          // uncomment this to use the custom transaction tracker
          // component: TransactionsTracker,
          props: {
            onSuccess: (sessionId: string) => {
              console.log(`Session ${sessionId} successfully completed`);
            },
            onFail: (sessionId: string, errorMessage: string) => {
              console.log(`Session ${sessionId} failed. ${errorMessage ?? ''}`);
            }
          }
        }
      }}
    >
      <QueryClientProvider client={queryClient}>
        <AxiosInterceptorContext.Listener>
          <Layout>
            <TransactionsToastList />
            <NotificationModal />
            <SignTransactionsModals />
            <Routes>
              {routes.map((route) => (
                <Route
                  path={route.path}
                  key={`route-key-'${route.path}`}
                  element={<route.component />}
                />
              ))}
              <Route path='*' element={<PageNotFound />} />
            </Routes>
          </Layout>
          <ToastContainer />
        </AxiosInterceptorContext.Listener>
      </QueryClientProvider>
    </DappProvider>
  );
};

export const App = () => {
  return (
    <AxiosInterceptorContext.Provider>
      <AxiosInterceptorContext.Interceptor
        authenticatedDomanis={sampleAuthenticatedDomains}
      >
        <Router>
          <AppContent />
        </Router>
      </AxiosInterceptorContext.Interceptor>
    </AxiosInterceptorContext.Provider>
  );
};
