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
import { routes } from 'routes';
import { BatchTransactionsContextProvider } from 'wrappers';

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
        logoutRoute: RouteNamesEnum.unlock
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
              {/* <Route path={RouteNamesEnum.unlock} element={<Unlock />} /> */}
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
          <BatchTransactionsContextProvider>
            <AppContent />
          </BatchTransactionsContextProvider>
        </Router>
      </AxiosInterceptorContext.Interceptor>
    </AxiosInterceptorContext.Provider>
  );
};
