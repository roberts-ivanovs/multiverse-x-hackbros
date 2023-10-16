import type { PropsWithChildren, ReactElement } from 'react';

interface Props {
  icon: ReactElement;
  title: string;
}

export const Card = ({ children, icon, title }: PropsWithChildren<Props>) => {
  return (
    <div className='p-5  bg-gray-800 rounded-lg max-w-[300px]'>
      <div className='flex items-center gap-3 mb-16'>
        {icon}
        <p className='text-sm text-white'>{title}</p>
      </div>
      <div className='flex flex-col h-full space-between'>{children}</div>
    </div>
  );
};
