import { gsap } from 'gsap';

export class AnimationUtils {
    static fadeInUp(elements, delay = 0) {
        return gsap.fromTo(elements, 
            { y: 50, opacity: 0 },
            { 
                y: 0, 
                opacity: 1, 
                duration: 0.8, 
                delay: delay,
                ease: "power2.out"
            }
        );
    }

    static slideInLeft(elements, delay = 0) {
        return gsap.fromTo(elements,
            { x: -100, opacity: 0 },
            {
                x: 0,
                opacity: 1,
                duration: 0.8,
                delay: delay,
                ease: "power2.out"
            }
        );
    }

    static slideInRight(elements, delay = 0) {
        return gsap.fromTo(elements,
            { x: 100, opacity: 0 },
            {
                x: 0,
                opacity: 1,
                duration: 0.8,
                delay: delay,
                ease: "power2.out"
            }
        );
    }

    static scaleIn(elements, delay = 0) {
        return gsap.fromTo(elements,
            { scale: 0, opacity: 0 },
            {
                scale: 1,
                opacity: 1,
                duration: 0.6,
                delay: delay,
                ease: "back.out(1.7)"
            }
        );
    }

    static typeWriter(element, text, speed = 50) {
        return new Promise((resolve) => {
            let i = 0;
            element.textContent = '';
            
            const timer = setInterval(() => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(timer);
                    resolve();
                }
            }, speed);
        });
    }

    static countUp(element, target, duration = 2) {
        return gsap.to(element, {
            textContent: target,
            duration: duration,
            ease: "power1.out",
            snap: { textContent: 1 },
            onUpdate: function() {
                element.textContent = Math.ceil(element.textContent);
            }
        });
    }

    static morphSVG(element, newPath, duration = 1) {
        return gsap.to(element, {
            morphSVG: newPath,
            duration: duration,
            ease: "power2.inOut"
        });
    }

    static parallaxMove(element, multiplier = 0.5) {
        const rect = element.getBoundingClientRect();
        const speed = window.pageYOffset * multiplier;
        
        gsap.set(element, {
            transform: `translateY(${speed}px)`
        });
    }

    static magneticEffect(element, strength = 0.3) {
        const magnetic = element;
        const magneticText = magnetic.querySelector('span') || magnetic;

        magnetic.addEventListener('mouseenter', function(e) {
            gsap.to(magnetic, {
                duration: 0.3,
                scale: 1.1,
                ease: "power2.out"
            });
        });

        magnetic.addEventListener('mouseleave', function(e) {
            gsap.to(magnetic, {
                duration: 0.3,
                scale: 1,
                x: 0,
                y: 0,
                ease: "power2.out"
            });
            gsap.to(magneticText, {
                duration: 0.3,
                x: 0,
                y: 0,
                ease: "power2.out"
            });
        });

        magnetic.addEventListener('mousemove', function(e) {
            const { clientX, clientY } = e;
            const { left, top, width, height } = magnetic.getBoundingClientRect();
            const x = clientX - (left + width / 2);
            const y = clientY - (top + height / 2);

            gsap.to(magnetic, {
                duration: 0.3,
                x: x * strength,
                y: y * strength,
                ease: "power2.out"
            });
            gsap.to(magneticText, {
                duration: 0.3,
                x: x * strength * 0.5,
                y: y * strength * 0.5,
                ease: "power2.out"
            });
        });
    }
}

export class ScrollAnimations {
    constructor() {
        this.initScrollTriggers();
    }

    initScrollTriggers() {
        // Navbar color change on scroll
        gsap.to('.nav', {
            backgroundColor: 'rgba(10, 10, 10, 0.95)',
            duration: 0.3,
            scrollTrigger: {
                trigger: 'body',
                start: '100px top',
                end: 'bottom bottom',
                toggleActions: 'play none none reverse'
            }
        });

        // Section reveals
        gsap.utils.toArray('.section').forEach((section, index) => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                }
            });

            tl.from(section.querySelectorAll('h2, h3, p, .btn'), {
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power2.out"
            });
        });

        // Parallax backgrounds
        gsap.utils.toArray('.parallax-bg').forEach(bg => {
            gsap.to(bg, {
                yPercent: -50,
                ease: "none",
                scrollTrigger: {
                    trigger: bg,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        });

        // Skills progress bars
        gsap.utils.toArray('.skill-progress').forEach(bar => {
            const progress = bar.getAttribute('data-progress');
            gsap.from(bar, {
                width: '0%',
                duration: 1.5,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: bar,
                    start: 'top 80%'
                }
            });
        });

        // Project cards stagger animation
        gsap.from('.project-card', {
            y: 100,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out",
            scrollTrigger: {
                trigger: '.projects-grid',
                start: 'top 80%'
            }
        });

        // Timeline items alternate animation
        gsap.utils.toArray('.timeline-item').forEach((item, index) => {
            const isEven = index % 2 === 0;
            gsap.from(item, {
                x: isEven ? -100 : 100,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: item,
                    start: 'top 80%'
                }
            });
        });
    }
}

export class InteractionEffects {
    constructor() {
        this.initHoverEffects();
        this.initCursorEffects();
    }

    initHoverEffects() {
        // Button hover effects
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                gsap.to(btn, {
                    scale: 1.05,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });

            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, {
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });

        // Project card hover effects
        document.querySelectorAll('.project-card').forEach(card => {
            const image = card.querySelector('.project-image');
            
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    y: -10,
                    duration: 0.3,
                    ease: "power2.out"
                });
                gsap.to(image, {
                    scale: 1.05,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    y: 0,
                    duration: 0.3,
                    ease: "power2.out"
                });
                gsap.to(image, {
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });

        // Skill item hover effects
        document.querySelectorAll('.skill-item').forEach(skill => {
            skill.addEventListener('mouseenter', () => {
                gsap.to(skill.querySelector('.skill-progress'), {
                    scaleY: 1.2,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });

            skill.addEventListener('mouseleave', () => {
                gsap.to(skill.querySelector('.skill-progress'), {
                    scaleY: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });
    }

    initCursorEffects() {
        // Custom cursor
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.innerHTML = '<div class="cursor-dot"></div>';
        document.body.appendChild(cursor);

        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const animateCursor = () => {
            const dx = mouseX - cursorX;
            const dy = mouseY - cursorY;
            
            cursorX += dx * 0.1;
            cursorY += dy * 0.1;
            
            cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
            requestAnimationFrame(animateCursor);
        };
        animateCursor();

        // Cursor interactions
        document.querySelectorAll('a, button, .project-card').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('cursor-hover');
            });
        });
    }
}

export class MobileOptimizations {
    constructor() {
        this.initMobileMenu();
        this.initTouchGestures();
    }

    initMobileMenu() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                const isOpen = navMenu.classList.contains('active');
                
                if (isOpen) {
                    gsap.to(navMenu, {
                        x: '100%',
                        opacity: 0,
                        duration: 0.3,
                        ease: "power2.in",
                        onComplete: () => {
                            navMenu.classList.remove('active');
                            navMenu.style.display = 'none';
                        }
                    });
                } else {
                    navMenu.style.display = 'flex';
                    navMenu.classList.add('active');
                    gsap.fromTo(navMenu,
                        { x: '100%', opacity: 0 },
                        { x: '0%', opacity: 1, duration: 0.3, ease: "power2.out" }
                    );
                }
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                    navMenu.classList.remove('active');
                }
            });
        }
    }

    initTouchGestures() {
        let startY = 0;
        let startX = 0;

        document.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
            startX = e.touches[0].clientX;
        });

        document.addEventListener('touchmove', (e) => {
            if (!startY || !startX) return;

            const currentY = e.touches[0].clientY;
            const currentX = e.touches[0].clientX;
            
            const diffY = startY - currentY;
            const diffX = startX - currentX;

            // Implement custom swipe behaviors here
            if (Math.abs(diffY) > Math.abs(diffX)) {
                // Vertical swipe
                if (diffY > 50) {
                    // Swipe up
                    console.log('Swipe up detected');
                } else if (diffY < -50) {
                    // Swipe down
                    console.log('Swipe down detected');
                }
            }

            startY = 0;
            startX = 0;
        });
    }
}
