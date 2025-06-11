# Textures and Materials

This directory contains texture files and material definitions for the portfolio.

## Texture Types
- **Diffuse/Albedo**: Base color textures
- **Normal**: Surface detail and bump mapping
- **Roughness**: Surface roughness for PBR materials
- **Metallic**: Metallic properties for PBR workflow
- **Emission**: Self-illuminating surfaces
- **AO (Ambient Occlusion)**: Contact shadows and depth

## Recommended Formats
- **JPG**: For color textures (smaller file size)
- **PNG**: For textures with transparency
- **WebP**: Modern format with better compression
- **EXR/HDR**: For environment maps and lighting

## Optimization Guidelines
- Use power-of-2 dimensions (256x256, 512x512, 1024x1024, etc.)
- Compress textures appropriately for web delivery
- Consider using texture atlases for multiple small textures
- Use mipmaps for better performance at distance

## PBR Workflow
The portfolio uses Physically Based Rendering (PBR) for realistic materials:
- Use linear color space for accurate lighting
- Follow metallic/roughness workflow
- Include proper normal maps for surface detail
- Use HDR environment maps for realistic reflections
