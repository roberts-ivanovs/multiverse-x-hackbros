import type { PropsWithChildren } from 'react';

export const PageWrapper = ({ children }: PropsWithChildren) => {
  return (
    <div className='flex items-center justify-center flex-1 p-6 bg-black lg:p-14 rounded-xl sm:flex-row'>
      {children}
    </div>
  );
};
