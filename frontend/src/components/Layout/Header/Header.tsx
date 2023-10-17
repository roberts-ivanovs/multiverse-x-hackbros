import { environment } from 'config';
import { logout } from 'helpers';
import { useGetIsLoggedIn } from 'hooks';
import MultiversXLogo from '../../../assets/img/multiversx-logo.svg?react';

export const Header = () => {
  const isLoggedIn = useGetIsLoggedIn();

  const handleLogout = () => {
    sessionStorage.clear();
    logout(`${window.location.origin}/unlock`, undefined, false);
  };

  return (
    <header className='flex flex-row justify-between px-12 pt-6 align-center'>
      <div className='flex gap-5'>
        <MultiversXLogo className='w-full h-6' />
        <div className='h-full w-[1px] bg-gray-700' />
        <h1 className='text-lg font-bold text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 bg-clip-text animate-text'>
          xChains
        </h1>
      </div>

      <nav className='w-full h-full text-sm sm:relative sm:left-auto sm:top-auto sm:flex sm:w-auto sm:flex-row sm:justify-end sm:bg-transparent'>
        <div className='container flex items-center justify-end gap-2 mx-auto'>
          <div className='flex items-center gap-1'>
            <div className='w-2 h-2 bg-green-500 rounded-full' />
            <p className='text-white'>{environment}</p>
          </div>
        </div>
      </nav>
    </header>
  );
};
