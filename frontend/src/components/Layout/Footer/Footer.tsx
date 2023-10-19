import HeartIcon from '@/assets/img/heart.svg?react';

export const Footer = () => {
  return (
    <footer className='w-full px-12 pb-6 mx-auto text-center text-gray-400 max-w-prose'>
      <div className='flex flex-col items-center text-gray-400 text sm'>
        <a
          target='_blank'
          className='flex items-center text-sm hover:underline'
          href='https://multiversx.com/'
        >
          Made with <HeartIcon className='mx-1 fill-gray-400' /> for Klara
        </a>
      </div>
    </footer>
  );
};
