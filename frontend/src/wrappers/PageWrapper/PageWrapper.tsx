import type { PropsWithChildren } from 'react';

export const PageWrapper = ({ children }: PropsWithChildren) => {
  return (
    <div className='flex items-center justify-center flex-1 bg-black p-14 rounded-xl sm:flex-row'>
      {children}
    </div>
  );
};
