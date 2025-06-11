import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimationUtils, ScrollAnimations, InteractionEffects, MobileOptimizations } from './scripts/animations.js';
import PortfolioRenderer from './scripts/portfolio-renderer.js';
import ThemeManager from './scripts/theme-manager.js';
import PerformanceMonitor from './scripts/performance-monitor.js';
import portfolioAPI from './scripts/api.js';
import { 
    particleVertexShader, 
    particleFragmentShader, 
    geometryVertexShader, 
    geometryFragmentShader 
} from './shaders/shaders.js';

gsap.registerPlugin(ScrollTrigger);

class Portfolio3D {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.geometryShapes = [];
        this.mouse = new THREE.Vector2();
        this.windowHalf = new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2);
        this.themeManager = null;
        this.performanceMonitor = null;
        this.particleCount = 2000; // Default particle count
        this.portfolioData = null; // Store fetched portfolio data
        
        this.init();
        this.setupEventListeners();
    }

    async init() {
        try {
            // Load portfolio data from API
            await this.loadPortfolioData();
            
            // Initialize the 3D scene
            this.initScene();
            this.createParticles();
            this.createGeometryShapes();
            this.setupScrollAnimations();
            this.setupThemeListener();
            this.setupPerformanceOptimization();
            this.animate();

            // Hide loading screen
            this.hideLoadingScreen();
        } catch (error) {
            console.error('Failed to initialize portfolio:', error);
            // Continue with static content as fallback
            this.initScene();
            this.createParticles();
            this.createGeometryShapes();
            this.setupScrollAnimations();
            this.setupThemeListener();
            this.setupPerformanceOptimization();
            this.animate();
            this.hideLoadingScreen();
        }
    }

    async loadPortfolioData() {
        try {
            console.log('Loading portfolio data from API...');
            this.portfolioData = await portfolioAPI.getPortfolioData();
            
            // Update content with API data
            this.updateContent();
        } catch (error) {
            console.error('Failed to load portfolio data:', error);
            throw error;
        }
    }

    updateContent() {
        if (!this.portfolioData) return;

        // Update hero section
        this.updateHeroSection();
        
        // Update about section
        this.updateAboutSection();
        
        // Update skills section
        this.updateSkillsSection();
        
        // Update projects section
        this.updateProjectsSection();
    }

    updateHeroSection() {
        const { about } = this.portfolioData;
        if (!about) return;

        // Update hero greeting and description
        const heroGreeting = document.querySelector('.hero-greeting');
        const heroName = document.querySelector('.hero-name');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        const heroDescription = document.querySelector('.hero-description');

        if (heroGreeting && about.greeting) {
            heroGreeting.textContent = about.greeting;
        }
        if (heroSubtitle && about.subtitle) {
            heroSubtitle.textContent = about.subtitle;
        }
        if (heroDescription && about.hero_description) {
            heroDescription.textContent = about.hero_description;
        }
    }

    updateAboutSection() {
        const { about } = this.portfolioData;
        if (!about) return;

        // Update about section content
        const aboutIntro = document.querySelector('.about-intro');
        if (aboutIntro && about.description) {
            aboutIntro.textContent = about.description;
        }
    }

    updateSkillsSection() {
        const { skills } = this.portfolioData;
        if (!skills) return;

        const skillsGrid = document.querySelector('.skills-grid');
        if (!skillsGrid) return;

        // Clear existing content
        skillsGrid.innerHTML = '';

        // Transform and render skills from API
        const transformedSkills = portfolioAPI.transformSkillsData(skills);
        
        Object.entries(transformedSkills).forEach(([categoryKey, skillsArray]) => {
            const categoryTitle = this.getCategoryTitle(categoryKey);
            
            const skillCategory = document.createElement('div');
            skillCategory.className = 'skill-category';
            
            skillCategory.innerHTML = `
                <h3 class="category-title">${categoryTitle}</h3>
                <div class="skills-list">
                    ${skillsArray.map(skill => `
                        <div class="skill-item">
                            <div class="skill-header">
                                <span class="skill-name">${skill.name}</span>
                                <span class="skill-percentage">${skill.level}%</span>
                            </div>
                            <div class="skill-bar">
                                <div class="skill-progress" data-progress="${skill.level}"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;

            skillsGrid.appendChild(skillCategory);
        });
    }

    updateProjectsSection() {
        const { projects } = this.portfolioData;
        if (!projects || projects.length === 0) return;

        const projectsGrid = document.querySelector('.projects-grid');
        if (!projectsGrid) return;

        // Clear existing content
        projectsGrid.innerHTML = '';

        // Transform and render projects from API
        const transformedProjects = portfolioAPI.transformProjectsData(projects);
        
        // Sort by featured and year
        transformedProjects.sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return (b.year || 0) - (a.year || 0);
        });

        transformedProjects.forEach(project => {
            const projectCard = this.createProjectCard(project);
            projectsGrid.appendChild(projectCard);
        });
    }

    createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.setAttribute('data-category', project.category);
        
        if (project.featured) {
            card.classList.add('featured');
        }

        card.innerHTML = `
            <div class="project-image">
                <div class="project-placeholder">
                    ${this.getCategoryIcon(project.category)}
                    ${project.year ? `<span class="project-year">${project.year}</span>` : ''}
                </div>
                ${project.featured ? '<div class="featured-badge">Featured</div>' : ''}
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                ${project.tags && project.tags.length > 0 ? `
                    <div class="project-tags">
                        ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                ` : ''}
                <div class="project-links">
                    ${this.createProjectLinks(project.links)}
                </div>
            </div>
        `;

        return card;
    }

    createProjectLinks(links) {
        if (!links) return '';
        
        const linkLabels = {
            demo: 'View Demo',
            github: 'GitHub',
            download: 'Download',
            store: 'Store'
        };

        return Object.entries(links)
            .filter(([key, url]) => url && url !== '#' && url !== null)
            .map(([key, url]) => {
                return `<a href="${url}" class="project-link" target="_blank" rel="noopener">${linkLabels[key] || key}</a>`;
            })
            .join('');
    }

    getCategoryIcon(category) {
        const icons = {
            unity: 'Unity Game',
            vr: 'VR Experience',
            ar: 'AR App',
            '3d': '3D Model',
            modeling: '3D Model'
        };
        return icons[category] || 'Project';
    }

    getCategoryTitle(categoryKey) {
        const titles = {
            unity: 'Game Development',
            vr: 'VR/AR Development',
            modeling: '3D Modeling',
            technical: 'Technical Skills'
        };
        return titles[categoryKey] || categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1);
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            gsap.to(loadingScreen, {
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                    loadingScreen.style.display = 'none';
                }
            });
        }
    }

    initScene() {
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x0a0a0a, 1, 1000);

        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 5;

        // Renderer setup
        const canvas = document.getElementById('webgl-canvas');
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x0a0a0a, 0);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0x00d4ff, 1);
        directionalLight.position.set(-1, 1, 1);
        this.scene.add(directionalLight);

        const pointLight = new THREE.PointLight(0x7b2cbf, 0.8, 100);
        pointLight.position.set(10, 10, 10);
        this.scene.add(pointLight);
    }    createParticles() {
        const positions = new Float32Array(this.particleCount * 3);
        const colors = new Float32Array(this.particleCount * 3);
        const randomness = new Float32Array(this.particleCount * 3);

        const color1 = new THREE.Color(0x00d4ff);
        const color2 = new THREE.Color(0x7b2cbf);
        const color3 = new THREE.Color(0xffffff);

        for (let i = 0; i < this.particleCount; i++) {
            // Position - create a galaxy-like distribution
            const radius = Math.random() * 50;
            const spinAngle = radius * 0.1;
            const branchAngle = (i % 3) * (Math.PI * 2 / 3);

            positions[i * 3] = Math.cos(branchAngle + spinAngle) * radius + (Math.random() - 0.5) * 2;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 2] = Math.sin(branchAngle + spinAngle) * radius + (Math.random() - 0.5) * 2;

            // Randomness for shader animation
            randomness[i * 3] = (Math.random() - 0.5) * 10;
            randomness[i * 3 + 1] = (Math.random() - 0.5) * 10;
            randomness[i * 3 + 2] = (Math.random() - 0.5) * 10;

            // Color based on distance from center
            const distance = Math.sqrt(positions[i * 3] ** 2 + positions[i * 3 + 2] ** 2);
            const colorMix = distance / 25;
            
            let mixedColor;
            if (colorMix < 0.5) {
                mixedColor = color1.clone().lerp(color2, colorMix * 2);
            } else {
                mixedColor = color2.clone().lerp(color3, (colorMix - 0.5) * 2);
            }
            
            colors[i * 3] = mixedColor.r;
            colors[i * 3 + 1] = mixedColor.g;
            colors[i * 3 + 2] = mixedColor.b;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('aRandomness', new THREE.BufferAttribute(randomness, 3));

        // Custom shader material
        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uSize: { value: 30 },
                uColor1: { value: new THREE.Color(0x00d4ff) },
                uColor2: { value: new THREE.Color(0x7b2cbf) }
            },
            vertexShader: particleVertexShader,
            fragmentShader: particleFragmentShader,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.particles = new THREE.Points(geometry, material);
        this.particles.name = 'particles'; // Add name for easier identification
        this.scene.add(this.particles);
    }createGeometryShapes() {
        const shapes = [
            { geometry: new THREE.IcosahedronGeometry(0.8, 1), position: [-10, 6, -8] },
            { geometry: new THREE.OctahedronGeometry(1.2), position: [12, -6, -5] },
            { geometry: new THREE.TetrahedronGeometry(1.0), position: [-8, -8, -6] },
            { geometry: new THREE.DodecahedronGeometry(0.9), position: [10, 8, -10] },
            { geometry: new THREE.ConeGeometry(0.8, 1.5, 8), position: [6, -4, -4] },
            { geometry: new THREE.CylinderGeometry(0.5, 0.5, 1.5, 12), position: [-6, 4, -5] },
            { geometry: new THREE.TorusGeometry(0.8, 0.3, 8, 16), position: [4, 2, -7] },
            { geometry: new THREE.TorusKnotGeometry(0.6, 0.2, 64, 8), position: [-4, -2, -8] }
        ];

        shapes.forEach((shapeData, index) => {
            // Use custom shader material for enhanced visuals
            const material = new THREE.ShaderMaterial({
                uniforms: {
                    uTime: { value: 0 },
                    uColor1: { value: new THREE.Color(index % 2 === 0 ? 0x00d4ff : 0x7b2cbf) },
                    uColor2: { value: new THREE.Color(index % 2 === 0 ? 0x7b2cbf : 0x00d4ff) }
                },
                vertexShader: geometryVertexShader,
                fragmentShader: geometryFragmentShader,
                transparent: true,
                wireframe: Math.random() > 0.6
            });

            const mesh = new THREE.Mesh(shapeData.geometry, material);
            mesh.position.set(...shapeData.position);
            mesh.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );

            // Add custom properties for animation
            mesh.userData = {
                originalPosition: new THREE.Vector3(...shapeData.position),
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.02,
                    y: (Math.random() - 0.5) * 0.02,
                    z: (Math.random() - 0.5) * 0.02
                },
                floatSpeed: Math.random() * 0.001 + 0.001,
                floatAmplitude: Math.random() * 2 + 1
            };

            this.geometryShapes.push(mesh);
            this.scene.add(mesh);
        });
    }

    setupEventListeners() {
        // Mouse movement
        document.addEventListener('mousemove', (event) => {
            this.mouse.x = ((event.clientX - this.windowHalf.x) / this.windowHalf.x);
            this.mouse.y = ((event.clientY - this.windowHalf.y) / this.windowHalf.y);
        });

        // Window resize
        window.addEventListener('resize', () => {
            this.windowHalf.set(window.innerWidth / 2, window.innerHeight / 2);
            
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
            });
        });

        // Project filter
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');
                this.filterProjects(filter);
                
                // Update active button
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        // Contact form
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', this.handleFormSubmit.bind(this));
        }
    }

    setupScrollAnimations() {
        // Animate stats on scroll
        gsap.from('.stat-number', {
            textContent: 0,
            duration: 2,
            ease: "power1.out",
            snap: { textContent: 1 },
            scrollTrigger: {
                trigger: '.hero-stats',
                start: 'top 80%'
            },
            stagger: 0.2
        });

        // Animate skill bars
        gsap.fromTo('.skill-progress', 
            { width: '0%' },
            {
                width: (i, el) => el.getAttribute('data-progress') + '%',
                duration: 1.5,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: '.skills-section',
                    start: 'top 70%'
                },
                stagger: 0.1
            }
        );

        // Fade in animations
        gsap.utils.toArray('.section').forEach(section => {
            gsap.fromTo(section.children,
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    stagger: 0.2,
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 80%'
                    }
                }
            );
        });

        // Project cards animation
        gsap.fromTo('.project-card',
            { y: 50, opacity: 0, scale: 0.9 },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.8,
                stagger: 0.1,
                scrollTrigger: {
                    trigger: '.projects-grid',
                    start: 'top 80%'
                }
            }
        );

        // Timeline animation
        gsap.fromTo('.timeline-item',
            { x: 100, opacity: 0 },
            {
                x: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.3,
                scrollTrigger: {
                    trigger: '.timeline',
                    start: 'top 70%'
                }
            }
        );
    }    animate() {
        requestAnimationFrame(this.animate.bind(this));

        const time = Date.now() * 0.0005;

        // Update particle shader uniforms
        if (this.particles && this.particles.material.uniforms) {
            this.particles.material.uniforms.uTime.value = time;
            this.particles.rotation.y = time * 0.05;
        }

        // Animate geometry shapes with individual behaviors
        this.geometryShapes.forEach((shape, index) => {
            if (shape.userData) {
                // Rotation
                shape.rotation.x += shape.userData.rotationSpeed.x;
                shape.rotation.y += shape.userData.rotationSpeed.y;
                shape.rotation.z += shape.userData.rotationSpeed.z;

                // Floating motion
                const floatOffset = Math.sin(time * shape.userData.floatSpeed + index) * shape.userData.floatAmplitude;
                shape.position.y = shape.userData.originalPosition.y + floatOffset;

                // Update shader uniforms if using custom material
                if (shape.material.uniforms) {
                    shape.material.uniforms.uTime.value = time;
                }
            }
        });

        // Enhanced mouse interaction with smoothing
        const targetX = this.mouse.x * 1.2;
        const targetY = -this.mouse.y * 1.2;
        
        this.camera.position.x += (targetX - this.camera.position.x) * 0.02;
        this.camera.position.y += (targetY - this.camera.position.y) * 0.02;
        
        // Subtle camera rotation
        this.camera.rotation.z = -this.camera.position.x * 0.05;
        
        this.camera.lookAt(this.scene.position);
        this.renderer.render(this.scene, this.camera);
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            gsap.to(window, {
                duration: 1.5,
                scrollTo: section,
                ease: "power2.out"
            });
            
            // Update active nav link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    }

    filterProjects(filter) {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            const shouldShow = filter === 'all' || category === filter;
            
            gsap.to(card, {
                opacity: shouldShow ? 1 : 0.3,
                scale: shouldShow ? 1 : 0.9,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        // Show success message (in a real implementation, you'd send this to a server)
        gsap.to('.contact-form', {
            opacity: 0.5,
            duration: 0.3,
            onComplete: () => {
                alert('Thank you for your message! I\'ll get back to you soon.');
                e.target.reset();
                gsap.to('.contact-form', { opacity: 1, duration: 0.3 });
            }
        });
    }

    setupThemeListener() {
        // Listen for theme changes and update Three.js scene accordingly
        window.addEventListener('themeChanged', (event) => {
            this.updateSceneTheme(event.detail.theme);
        });
    }

    updateSceneTheme(theme) {
        const colors = {
            light: {
                background: 0xffffff,
                primary: 0x2563eb,
                secondary: 0x7c3aed,
                fog: 0xf8fafc
            },
            dark: {
                background: 0x0a0a0a,
                primary: 0x00d4ff,
                secondary: 0x7b2cbf,
                fog: 0x0a0a0a
            }
        };

        const themeColors = colors[theme];

        // Update renderer background
        this.renderer.setClearColor(themeColors.background, theme === 'light' ? 0.1 : 0);

        // Update fog
        if (this.scene.fog) {
            this.scene.fog.color.setHex(themeColors.fog);
        }

        // Update particle colors
        if (this.particles && this.particles.material.uniforms) {
            this.particles.material.uniforms.uColor1.value.setHex(themeColors.primary);
            this.particles.material.uniforms.uColor2.value.setHex(themeColors.secondary);
        }

        // Update geometry shapes
        this.geometryShapes.forEach((shape, index) => {
            if (shape.material.uniforms) {
                shape.material.uniforms.uColor1.value.setHex(
                    index % 2 === 0 ? themeColors.primary : themeColors.secondary
                );
                shape.material.uniforms.uColor2.value.setHex(
                    index % 2 === 0 ? themeColors.secondary : themeColors.primary
                );
            }
        });

        // Update lighting for light theme
        this.scene.traverse((child) => {
            if (child.isDirectionalLight) {
                child.intensity = theme === 'light' ? 0.8 : 1;
            }
            if (child.isAmbientLight) {
                child.intensity = theme === 'light' ? 0.6 : 0.4;
            }
        });
    }

    setupPerformanceOptimization() {
        // Listen for performance optimization events
        window.addEventListener('optimizePerformance', (event) => {
            this.applyPerformanceOptimizations(event.detail);
        });
    }

    applyPerformanceOptimizations(settings) {
        console.log('Applying performance optimizations:', settings);

        // Adjust particle count
        if (settings.particleCount && settings.particleCount !== this.particleCount) {
            this.particleCount = settings.particleCount;
            this.recreateParticles();
        }

        // Disable advanced effects if needed
        if (settings.disableAdvancedEffects) {
            this.geometryShapes.forEach(shape => {
                if (shape.material.wireframe !== undefined) {
                    shape.material.wireframe = true; // Wireframe is less intensive
                }
            });
        }

        // Reduce geometry complexity
        if (settings.reduceQuality) {
            this.geometryShapes.forEach(shape => {
                if (shape.geometry.dispose) {
                    shape.geometry.dispose();
                }
            });
            // Recreate with lower detail
            this.createSimpleGeometry();
        }
    }

    recreateParticles() {
        // Remove existing particles
        if (this.particles) {
            this.scene.remove(this.particles);
            this.particles.geometry.dispose();
            this.particles.material.dispose();
        }

        // Create new particles with updated count
        this.createParticles();
    }

    createSimpleGeometry() {
        // Remove existing geometry
        this.geometryShapes.forEach(shape => {
            this.scene.remove(shape);
        });
        this.geometryShapes = [];

        // Create simpler geometry for performance
        const simpleShapes = [
            { geometry: new THREE.BoxGeometry(1, 1, 1), position: [-8, 4, -5] },
            { geometry: new THREE.SphereGeometry(0.8, 8, 6), position: [8, -4, -3] },
            { geometry: new THREE.ConeGeometry(0.6, 1, 6), position: [-6, -6, -4] },
        ];

        simpleShapes.forEach((shapeData, index) => {
            const material = new THREE.MeshBasicMaterial({
                color: index % 2 === 0 ? 0x00d4ff : 0x7b2cbf,
                wireframe: true
            });

            const mesh = new THREE.Mesh(shapeData.geometry, material);
            mesh.position.set(...shapeData.position);

            this.geometryShapes.push(mesh);
            this.scene.add(mesh);
        });
    }

    // ...existing code...
}

// Initialize loading screen and portfolio
class LoadingManager {
    constructor() {
        this.loadingScreen = document.getElementById('loading-screen');
        this.loadingBar = document.querySelector('.loading-bar');
        this.progress = 0;
        
        this.simulateLoading();
    }

    simulateLoading() {
        const interval = setInterval(() => {
            this.progress += Math.random() * 15;
            if (this.progress >= 100) {
                this.progress = 100;
                clearInterval(interval);
                setTimeout(() => this.hideLoadingScreen(), 500);
            }
            this.updateProgress();
        }, 150);
    }

    updateProgress() {
        if (this.loadingBar) {
            this.loadingBar.style.width = `${this.progress}%`;
        }
    }    hideLoadingScreen() {
        gsap.to(this.loadingScreen, {
            opacity: 0,
            duration: 1,
            ease: "power2.out",
            onComplete: () => {
                this.loadingScreen.style.display = 'none';
                // Initialize portfolio after loading
                const portfolio3D = new Portfolio3D();
                // Initialize portfolio content renderer
                new PortfolioRenderer();
                // Initialize theme manager
                const themeManager = new ThemeManager();
                // Initialize performance monitor
                const performanceMonitor = new PerformanceMonitor();
                
                // Set references
                portfolio3D.themeManager = themeManager;
                portfolio3D.performanceMonitor = performanceMonitor;
                
                // Apply initial theme to 3D scene
                const initialTheme = themeManager.currentTheme;
                portfolio3D.updateSceneTheme(initialTheme);
            }
        });
    }
}

// Global functions
window.scrollToSection = function(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        gsap.to(window, {
            duration: 1.5,
            scrollTo: section,
            ease: "power2.out"
        });
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LoadingManager();
    
    // Initialize additional features
    new ScrollAnimations();
    new InteractionEffects();
    new MobileOptimizations();
    
    // Mobile menu toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
    
    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add scroll progress indicator
    const scrollIndicator = document.createElement('div');
    scrollIndicator.className = 'scroll-indicator';
    document.body.appendChild(scrollIndicator);

    window.addEventListener('scroll', () => {
        const scrolled = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        scrollIndicator.style.transform = `scaleX(${scrolled / 100})`;
    });

    // Performance optimization: Reduce animations on low-end devices
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) {
        document.documentElement.classList.add('low-performance');
    }

    // Keyboard navigation support
    document.addEventListener('keydown', (e) => {
        if (e.key === 't' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            const themeToggle = document.querySelector('.theme-toggle');
            if (themeToggle) {
                themeToggle.click();
            }
        }
    });
});

export default Portfolio3D;
