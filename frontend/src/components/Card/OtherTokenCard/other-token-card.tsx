import { Coin } from '@/assets/gltf/coin';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { useGetIsLoggedIn } from '@multiversx/sdk-dapp/hooks/account/useGetIsLoggedIn';
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { ChevronsUpDown } from 'lucide-react';
import { Suspense, useState } from 'react';

const chains = ['Ethereum (ETHEREUM)', 'Binance (BSC)'] as const;
type Chain = (typeof chains)[number];

export function OtherTokenCard() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedChain, setSelectedChain] = useState<Chain>(
    'Ethereum (ETHEREUM)'
  );
  const isLoggedIn = useGetIsLoggedIn();

  return (
    <>
      <div className='relative flex items-center justify-center mb-20'>
        <div className='absolute w-[150px] rounded-full opacity-25 aspect-square bg-radial-gradient-yellow' />
        <Canvas
          camera={{ fov: 40 }}
          style={{ width: '150px', height: '150px' }}
        >
          <Suspense fallback={null}>
            <Coin />
          </Suspense>
          <OrbitControls
            rotateSpeed={0.5}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
            autoRotate
            enablePan={false}
            enableZoom={false}
          />
          <pointLight position={[0, 1.5, -2]} intensity={100} />
          <pointLight position={[0, 1.5, 2]} intensity={50} />
          <EffectComposer>
            <Bloom
              luminanceSmoothing={100}
              height={100}
              opacity={1}
              intensity={0.5}
            />
          </EffectComposer>
        </Canvas>
      </div>
      {isLoggedIn ? (
        <>
          <Popover open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <PopoverTrigger asChild>
              <button
                role='combobox'
                className='flex justify-between w-full p-3 mb-4 text-sm text-white bg-gray-700 rounded-lg'
              >
                {selectedChain}
                <ChevronsUpDown className='w-4 h-4 ml-2 opacity-50 shrink-0' />
              </button>
            </PopoverTrigger>
            <PopoverContent className='p-2 bg-gray-700 border-none rounded-lg w-fit'>
              {chains?.map((chain, i) => (
                <div
                  className='p-2 text-sm text-white rounded-lg hover:bg-white/[0.2] duration-150 cursor-pointer'
                  key={i}
                  onClick={() => {
                    setSelectedChain(chain);
                    setIsDropdownOpen(false);
                  }}
                >
                  {chain}
                </div>
              ))}
            </PopoverContent>
          </Popover>
          <div className='flex items-center gap-1'>
            <div className='w-2 h-2 bg-green-500 rounded-full' />
            <p className='text-sm font-normal text-white'>Logged in</p>
          </div>
        </>
      ) : (
        <div className='flex items-center gap-1'>
          <div className='w-2 h-2 bg-red-500 rounded-full' />
          <p className='text-sm font-normal text-white'>
            Connect MultiversX wallet to use
          </p>
        </div>
      )}
    </>
  );
}
