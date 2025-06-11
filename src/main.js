import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimationUtils, ScrollAnimations, InteractionEffects, MobileOptimizations } from './scripts/animations.js';
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
        
        this.init();
        this.setupEventListeners();
        this.animate();
        this.setupScrollAnimations();
    }

    init() {
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

        // Create particle system
        this.createParticles();
        
        // Create floating geometric shapes
        this.createGeometryShapes();
    }    createParticles() {
        const particleCount = 2000;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const randomness = new Float32Array(particleCount * 3);

        const color1 = new THREE.Color(0x00d4ff);
        const color2 = new THREE.Color(0x7b2cbf);
        const color3 = new THREE.Color(0xffffff);

        for (let i = 0; i < particleCount; i++) {
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
        this.scene.add(this.particles);
    }

    createGeometryShapes() {
        const shapes = [
            { geometry: new THREE.IcosahedronGeometry(0.5, 1), position: [-8, 4, -5] },
            { geometry: new THREE.OctahedronGeometry(0.7), position: [8, -4, -3] },
            { geometry: new THREE.TetrahedronGeometry(0.6), position: [-6, -6, -4] },
            { geometry: new THREE.DodecahedronGeometry(0.5), position: [6, 6, -6] },
            { geometry: new THREE.ConeGeometry(0.5, 1, 8), position: [4, -2, -2] },
            { geometry: new THREE.CylinderGeometry(0.3, 0.3, 1, 8), position: [-4, 2, -3] }
        ];

        shapes.forEach((shapeData, index) => {
            const material = new THREE.MeshPhongMaterial({
                color: index % 2 === 0 ? 0x00d4ff : 0x7b2cbf,
                transparent: true,
                opacity: 0.7,
                wireframe: Math.random() > 0.5
            });

            const mesh = new THREE.Mesh(shapeData.geometry, material);
            mesh.position.set(...shapeData.position);
            mesh.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );

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
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        const time = Date.now() * 0.0005;

        // Rotate particles
        if (this.particles) {
            this.particles.rotation.x = time * 0.1;
            this.particles.rotation.y = time * 0.15;
        }

        // Animate geometry shapes
        this.geometryShapes.forEach((shape, index) => {
            shape.rotation.x += 0.01 * (index + 1);
            shape.rotation.y += 0.01 * (index + 1);
            shape.position.y += Math.sin(time + index) * 0.002;
        });

        // Mouse interaction
        this.camera.position.x += (this.mouse.x * 0.5 - this.camera.position.x) * 0.03;
        this.camera.position.y += (-this.mouse.y * 0.5 - this.camera.position.y) * 0.03;
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
    }

    hideLoadingScreen() {
        gsap.to(this.loadingScreen, {
            opacity: 0,
            duration: 1,
            ease: "power2.out",
            onComplete: () => {
                this.loadingScreen.style.display = 'none';
                // Initialize portfolio after loading
                new Portfolio3D();
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
});

export default Portfolio3D;
