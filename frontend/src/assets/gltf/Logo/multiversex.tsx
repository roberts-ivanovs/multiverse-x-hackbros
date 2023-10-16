/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.13 ./multiversex.gltf -t
*/

import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { GLTF } from 'three-stdlib';

type GLTFResult = GLTF & {
  nodes: {
    Curve: THREE.Mesh;
  };
  materials: {
    ['Material.002']: THREE.MeshStandardMaterial;
  };
};

export function MultiversexLogo(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('./multiversex.gltf') as GLTFResult;

  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.Curve.geometry}
        scale={2}
        material={materials['Material.002']}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
      />
    </group>
  );
}

useGLTF.preload('/multiversex.gltf');