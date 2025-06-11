# Sample 3D Models for Portfolio

This directory contains 3D models and assets for the portfolio.

## Recommended Model Formats
- `.glb` or `.gltf` for Three.js compatibility
- `.fbx` for complex models with animations
- `.obj` for simple geometric models

## Optimization Tips
- Keep polygon count reasonable for web (under 10k triangles for complex models)
- Use compressed textures (JPG for color maps, PNG for transparency)
- Consider using Draco compression for .glb files
- Use Level of Detail (LOD) for performance

## Adding Your Models

1. Place your 3D model files in this directory
2. Update the model loader in `src/main.js`
3. Add model showcase in the projects section

Example code to load a model:
```javascript
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
loader.load('/assets/models/your-model.glb', (gltf) => {
    scene.add(gltf.scene);
});
```
