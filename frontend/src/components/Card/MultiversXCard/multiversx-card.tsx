import { MultiversexLogo } from '@/assets/gltf/multiversex';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { RouteNamesEnum } from '@/localConstants';
import {
  ExplorerLink,
  ExtensionLoginButton,
  ExtensionLoginButtonPropsType,
  LedgerLoginButton,
  LedgerLoginButtonPropsType,
  OperaWalletLoginButton,
  OperaWalletLoginButtonPropsType,
  WalletConnectLoginButton,
  WalletConnectLoginButtonPropsType,
  WebWalletLoginButton,
  WebWalletLoginButtonPropsType
} from '@multiversx/sdk-dapp/UI';
import { ACCOUNTS_ENDPOINT } from '@multiversx/sdk-dapp/apiCalls/endpoints';
import { useGetIsLoggedIn } from '@multiversx/sdk-dapp/hooks/account/useGetIsLoggedIn';
import { logout } from '@multiversx/sdk-dapp/utils/logout';
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { contractAddress, nativeAuth } from 'config';
import { PlugZap } from 'lucide-react';
import { Suspense } from 'react';

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

export function MultiversXCard() {
  const isLoggedIn = useGetIsLoggedIn();

  const handleLogout = () => {
    sessionStorage.clear();
    logout(window.location.origin, undefined, false);
  };

  return (
    <>
      <div className='relative flex items-center justify-center mb-10'>
        <div className='absolute w-[150px] rounded-full opacity-25 aspect-square bg-radial-gradient-blue' />
        <Canvas
          camera={{ fov: 40 }}
          style={{ width: '150px', height: '150px' }}
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
      <p className='mb-5 text-left truncate text-accent-10'>
        <label className='block text-xs text-gray-500 uppercase'>
          Contract
        </label>
        <ExplorerLink
          page={`/${ACCOUNTS_ENDPOINT}/${contractAddress}`}
          className='!ml-0 text-sm border-b border-gray-500 w-full border-dotted text-accent-100 hover:border-solid hover:border-gray-800'
        >
          {contractAddress}
        </ExplorerLink>
      </p>
      {isLoggedIn ? (
        <button
          onClick={handleLogout}
          className='w-full py-2 text-sm font-bold text-black rounded-md bg-accent-100'
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
              <LedgerLoginButton loginButtonText='Ledger' {...commonProps} />
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
    </>
  );
}
