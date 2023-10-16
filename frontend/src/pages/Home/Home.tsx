import { MultiversexLogo } from '@/assets/gltf/Logo/Multiversex';
import { Card, ContractAddress } from '@/components';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import type {
  ExtensionLoginButtonPropsType,
  LedgerLoginButtonPropsType,
  OperaWalletLoginButtonPropsType,
  WalletConnectLoginButtonPropsType,
  WebWalletLoginButtonPropsType
} from '@multiversx/sdk-dapp/UI';
import {
  ExtensionLoginButton,
  LedgerLoginButton,
  WalletConnectLoginButton,
  WebWalletLoginButton
} from '@multiversx/sdk-dapp/UI';
import { useGetIsLoggedIn } from '@multiversx/sdk-dapp/hooks/account/useGetIsLoggedIn';
import { logout } from '@multiversx/sdk-dapp/utils/logout';
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { OperaWalletLoginButton } from 'components/sdkDappComponents';
import { nativeAuth } from 'config';
import { RouteNamesEnum } from 'localConstants';
import { PlugZap } from 'lucide-react';
import { Suspense } from 'react';
import { AuthRedirectWrapper, PageWrapper } from 'wrappers';

type CommonPropsType =
  | OperaWalletLoginButtonPropsType
  | ExtensionLoginButtonPropsType
  | WebWalletLoginButtonPropsType
  | LedgerLoginButtonPropsType
  | WalletConnectLoginButtonPropsType;

const commonProps: CommonPropsType = {
  callbackRoute: RouteNamesEnum.home,
  nativeAuth
};

export const Home = () => {
  const isLoggedIn = useGetIsLoggedIn();

  const handleLogout = () => {
    sessionStorage.clear();
    logout(`${window.location.origin}/unlock`, undefined, false);
  };
  return (
    <AuthRedirectWrapper requireAuth={false}>
      <PageWrapper>
        <div className='flex flex-col items-center w-full h-full'>
          <div className='self-start mt-10'>
            <h1 className='mb-10 text-5xl font-bold text-white'>
              <span className='underline decoration-accent-100 decoration-dotted hover:decoration-solid'>
                IBC protocol
              </span>{' '}
              for MultiversX
            </h1>
            <p className='text-gray-400'>
              The{' '}
              <a
                href='https://www.npmjs.com/package/@multiversx/sdk-dapp'
                target='_blank'
                className='text-gray-400 underline decoration-dotted hover:decoration-solid'
              >
                sdk-dapp
              </a>{' '}
              starter project for any dApp <br className='hidden xl:block' />
              built on the{' '}
              <a
                href='https://multiversx.com/'
                target='_blank'
                className='text-gray-400 underline decoration-dotted hover:decoration-solid'
              >
                MultiversX
              </a>{' '}
              blockchain.
            </p>
          </div>
          <div className='flex my-auto self-start flex-col gap-2 max-w-[70sch] text-center sm:text-left font-medium'>
            <div className='flex gap-10'>
              <Card
                icon={
                  <div className='flex items-center justify-center w-8 h-8 text-sm font-bold text-white bg-gray-900 rounded-full'>
                    1
                  </div>
                }
                title='Connect your source wallet'
              >
                <div className='relative flex items-center justify-center mb-20'>
                  <div className='absolute w-1/2 rounded-full opacity-25 aspect-square bg-radial-gradient' />
                  <Canvas
                    camera={{ fov: 40 }}
                    style={{ width: '100%', height: '100%' }}
                  >
                    <Suspense fallback={null}>
                      <MultiversexLogo />
                    </Suspense>
                    <OrbitControls
                      rotateSpeed={0.5}
                      maxPolarAngle={Math.PI / 2}
                      minPolarAngle={Math.PI / 2}
                      autoRotate
                      enablePan={false}
                      enableZoom={false}
                    />
                    <EffectComposer>
                      <Bloom luminanceSmoothing={20} height={50} opacity={1} />
                    </EffectComposer>
                  </Canvas>
                </div>
                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className='w-full py-2 text-sm text-black rounded-md bg-accent-100'
                  >
                    Disconnect
                  </button>
                ) : (
                  <Dialog>
                    <DialogTrigger className='flex font-bold items-center w-full gap-2 py-2.5 justify-center text-sm text-black rounded-md bg-accent-100'>
                      <PlugZap className='w-6 text-black' /> Connect Wallet
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Choose provider</DialogTitle>
                        <DialogDescription>
                          The source of your assets
                        </DialogDescription>
                      </DialogHeader>
                      <div className='flex flex-col md:flex-row'>
                        <WalletConnectLoginButton
                          loginButtonText='xPortal App'
                          {...commonProps}
                        />
                        <LedgerLoginButton
                          loginButtonText='Ledger'
                          {...commonProps}
                        />
                        <ExtensionLoginButton
                          loginButtonText='DeFi Wallet'
                          {...commonProps}
                        />
                        <OperaWalletLoginButton
                          loginButtonText='Opera Crypto Wallet - Beta'
                          {...commonProps}
                        />
                        <WebWalletLoginButton
                          loginButtonText='Web Wallet'
                          data-testid='webWalletLoginBtn'
                          {...commonProps}
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </Card>
              <Card
                icon={
                  <div className='flex items-center justify-center w-8 h-8 text-sm font-bold text-white bg-gray-900 rounded-full'>
                    2
                  </div>
                }
                title='Connect your destination wallet'
              >
                <div className='relative flex items-center justify-center mb-10'>
                  <div className='absolute w-1/2 rounded-full opacity-25 aspect-square bg-radial-gradient' />
                  <Canvas
                    camera={{ fov: 40 }}
                    style={{ width: '100%', height: '100%' }}
                  >
                    <Suspense fallback={null}>
                      <MultiversexLogo />
                    </Suspense>
                    <OrbitControls
                      rotateSpeed={0.5}
                      maxPolarAngle={Math.PI / 2}
                      minPolarAngle={Math.PI / 2}
                      autoRotate
                      enablePan={false}
                      enableZoom={false}
                    />
                    <EffectComposer>
                      <Bloom luminanceSmoothing={20} height={50} opacity={1} />
                    </EffectComposer>
                  </Canvas>
                </div>
                <ContractAddress />
                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className='w-full py-2 text-sm text-black rounded-md bg-accent-100'
                  >
                    Disconnect
                  </button>
                ) : (
                  <Dialog>
                    <DialogTrigger className='flex font-bold items-center w-full gap-2 py-2.5 justify-center text-sm text-black rounded-md bg-accent-100'>
                      <PlugZap className='w-6 text-black' /> Connect Wallet
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Choose provider</DialogTitle>
                        <DialogDescription>
                          The destination of your assets
                        </DialogDescription>
                      </DialogHeader>
                      <div className='flex flex-col md:flex-row'>
                        <WalletConnectLoginButton
                          loginButtonText='xPortal App'
                          {...commonProps}
                        />
                        <LedgerLoginButton
                          loginButtonText='Ledger'
                          {...commonProps}
                        />
                        <ExtensionLoginButton
                          loginButtonText='DeFi Wallet'
                          {...commonProps}
                        />
                        <OperaWalletLoginButton
                          loginButtonText='Opera Crypto Wallet - Beta'
                          {...commonProps}
                        />
                        <WebWalletLoginButton
                          loginButtonText='Web Wallet'
                          data-testid='webWalletLoginBtn'
                          {...commonProps}
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </Card>
            </div>
          </div>
        </div>
      </PageWrapper>
    </AuthRedirectWrapper>
  );
};
