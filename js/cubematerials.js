import { MeshBasicMaterial } from 'three';

const OPACITY = 0.75

export const randomMaterials = () => {
    return Array.from({ length: 6 },
        () => new MeshBasicMaterial({
            color: Math.random() * 0xffffff,
            opacity: OPACITY/*, side: THREE.DoubleSide*/}))
}