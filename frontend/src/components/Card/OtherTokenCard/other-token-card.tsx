import { Coin } from '@/assets/gltf/coin';
import { useGetIsLoggedIn } from '@multiversx/sdk-dapp/hooks/account/useGetIsLoggedIn';
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { Suspense } from 'react';

export function OtherTokenCard() {
  const isLoggedIn = useGetIsLoggedIn();

  return (
    <>
      <div className='relative flex items-center justify-center mb-20'>
        <div className='absolute w-1/2 rounded-full opacity-25 aspect-square bg-radial-gradient-yellow' />
        <Canvas camera={{ fov: 40 }} style={{ width: '100%', height: '100%' }}>
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
          {/* <pointLight position={[0, 5, 0]} intensity={100} /> */}
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
        <div className='flex items-center gap-1'>
          <div className='w-2 h-2 bg-green-500 rounded-full' />
          <p className='text-white'>Logged in</p>
        </div>
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
