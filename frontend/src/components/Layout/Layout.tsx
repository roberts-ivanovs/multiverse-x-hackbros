import type { PropsWithChildren } from 'react';
import { Footer } from './Footer';
import { Header } from './Header';

export const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className='flex flex-col min-h-screen bg-gray-900'>
      <Header />
      <main className='flex items-stretch justify-center flex-grow p-6 lg:px-12'>
        {children}
      </main>
      <Footer />
    </div>
  );
};
