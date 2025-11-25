document.addEventListener('DOMContentLoaded', () => {
    // Typing Effect
    const typingText = document.querySelector('.typing-text');
    const phrases = ['Scalable Systems.', 'AI Solutions.', 'The Future.'];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            typingText.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            typingText.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500; // Pause before next phrase
        }

        setTimeout(type, typeSpeed);
    }

    type();

    // Experience Tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    const jobPanels = document.querySelectorAll('.job-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and panels
            tabBtns.forEach(b => b.classList.remove('active'));
            jobPanels.forEach(p => p.classList.remove('active'));

            // Add active class to clicked button
            btn.classList.add('active');

            // Show corresponding panel
            const target = btn.getAttribute('data-target');
            document.getElementById(target).classList.add('active');
        });
    });

    // Scroll Animation (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section, .project-card, .other-project-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Add class for animation logic
    const style = document.createElement('style');
    style.innerHTML = `
        .fade-in-up {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // Mobile Menu (Simple Toggle)
    // Note: You'll need to add the CSS for the open state in styles.css if you want a full mobile menu overlay
    // For now, this is a placeholder for the logic
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        document.body.classList.toggle('nav-open');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            document.body.classList.remove('nav-open');
        });
    });

    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved user preference, if any, on load of the website
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
    } else if (!prefersDarkScheme.matches) {
        // If no preference and system is light, set light
        document.documentElement.setAttribute('data-theme', 'light');
    }

    themeToggle.addEventListener('click', () => {
        let theme = 'dark';
        if (document.documentElement.getAttribute('data-theme') !== 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
            theme = 'light';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            theme = 'dark';
        }
        localStorage.setItem('theme', theme);
    });

    // Three.js 3D Object - Data Core
    const initThreeJS = () => {
        const container = document.getElementById('canvas-container');
        if (!container) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        // Theme Colors
        const darkColor = 0x64ffda;
        const lightColor = 0x0071e3;

        const getThemeColor = () => {
            return document.documentElement.getAttribute('data-theme') === 'light' ? lightColor : darkColor;
        };

        // Pivot Group (For positioning and mouse tilt)
        const pivot = new THREE.Group();
        scene.add(pivot);

        // Create Geometry - "Data Core"
        const geometry = new THREE.IcosahedronGeometry(1, 1); // Radius 1, Detail 1
        const material = new THREE.MeshBasicMaterial({ 
            color: getThemeColor(),
            wireframe: true,
            transparent: true,
            opacity: 0.5
        });
        const sphere = new THREE.Mesh(geometry, material);
        pivot.add(sphere); // Add to pivot

        // Inner Core
        const innerGeometry = new THREE.IcosahedronGeometry(0.5, 0);
        const innerMaterial = new THREE.MeshBasicMaterial({
            color: getThemeColor(),
            wireframe: true,
            transparent: true,
            opacity: 0.8
        });
        const innerSphere = new THREE.Mesh(innerGeometry, innerMaterial);
        pivot.add(innerSphere); // Add to pivot

        // Arrow Geometry (For About Section)
        const arrowGroup = new THREE.Group();
        pivot.add(arrowGroup);

        const shaftGeometry = new THREE.CylinderGeometry(0.2, 0.2, 2, 8);
        const shaftMaterial = new THREE.MeshBasicMaterial({ 
            color: getThemeColor(), 
            wireframe: true,
            transparent: true,
            opacity: 0.5
        });
        const shaft = new THREE.Mesh(shaftGeometry, shaftMaterial);
        shaft.rotation.z = -Math.PI / 2; // Point right relative to group
        arrowGroup.add(shaft);

        const headGeometry = new THREE.ConeGeometry(0.5, 1, 8);
        const headMaterial = new THREE.MeshBasicMaterial({ 
            color: getThemeColor(), 
            wireframe: true,
            transparent: true,
            opacity: 0.8
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.rotation.z = -Math.PI / 2; // Point right relative to group
        head.position.x = 1.5; // Tip of the shaft
        arrowGroup.add(head);

        // Rotate entire group to point Down-Left (approx 225 degrees)
        arrowGroup.rotation.z = Math.PI - 0.5; 

        arrowGroup.scale.set(0, 0, 0); // Hidden by default

        // Update colors on theme change
        const updateColors = () => {
            const newColor = getThemeColor();
            material.color.setHex(newColor);
            innerMaterial.color.setHex(newColor);
            shaftMaterial.color.setHex(newColor);
            headMaterial.color.setHex(newColor);
        };

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                    updateColors();
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });

        camera.position.z = 5;

        // Mouse Interaction
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;

        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;

        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX - windowHalfX);
            mouseY = (event.clientY - windowHalfY);
        });

        // Section States (Position X, Y, Z, Pivot Scale, Sphere Opacity, Arrow Opacity, Rotation Speed X, Y)
        const sectionStates = {
            hero: { pos: { x: 2.5, y: 0, z: 0 }, pivotScale: 1, sphereOpacity: 1, arrowOpacity: 0, rot: { x: 0.002, y: 0.005 } },
            about: { pos: { x: 3, y: 2, z: 0 }, pivotScale: 1, sphereOpacity: 0, arrowOpacity: 1, rot: { x: 0.005, y: 0.01 } }, // Top-Right, Arrow
            skills: { pos: { x: 0, y: 0, z: -2 }, pivotScale: 1.2, sphereOpacity: 1, arrowOpacity: 0, rot: { x: 0.01, y: 0.01 } },
            projects: { pos: { x: 0, y: 0, z: 0 }, pivotScale: 5, sphereOpacity: 1, arrowOpacity: 0, rot: { x: 0.001, y: 0.002 } },
            experience: { pos: { x: -2.5, y: 0, z: 0 }, pivotScale: 0.9, sphereOpacity: 1, arrowOpacity: 0, rot: { x: 0.005, y: 0.005 } },
            contact: { pos: { x: 0, y: 0, z: 0 }, pivotScale: 1.5, sphereOpacity: 1, arrowOpacity: 0, rot: { x: 0.002, y: 0.02 } }
        };

        let currentState = sectionStates.hero;
        let targetState = sectionStates.hero;
        let currentSectionId = 'hero'; // Track current section

        // Scroll Detection
        const sections = document.querySelectorAll('section, header');
        
        const updateActiveSection = () => {
            const scrollPosition = window.scrollY + window.innerHeight * 0.6; // Trigger earlier (60% down viewport)

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    currentSectionId = section.getAttribute('id') || 'hero';
                    if (currentSectionId === 'home') currentSectionId = 'hero';
                }
            });

            if (sectionStates[currentSectionId]) {
                targetState = sectionStates[currentSectionId];
            }
        };

        window.addEventListener('scroll', updateActiveSection);

        camera.position.z = 5;

        const animate = () => {
            requestAnimationFrame(animate);

            targetX = mouseX * 0.001;
            targetY = mouseY * 0.001;

            // 1. Smoothly interpolate PIVOT Position & Scale (Scroll Transitions)
            pivot.position.x += (targetState.pos.x - pivot.position.x) * 0.03;
            pivot.position.y += (targetState.pos.y - pivot.position.y) * 0.03;
            pivot.position.z += (targetState.pos.z - pivot.position.z) * 0.03;

            const pivotScaleLerp = (targetState.pivotScale - pivot.scale.x) * 0.03;
            pivot.scale.setScalar(pivot.scale.x + pivotScaleLerp);

            // 2. Opacity Crossfade (instead of scale)
            const sphereOpacityLerp = (targetState.sphereOpacity - material.opacity) * 0.05;
            material.opacity += sphereOpacityLerp;
            innerMaterial.opacity += sphereOpacityLerp;

            const arrowOpacityLerp = (targetState.arrowOpacity - shaftMaterial.opacity) * 0.05;
            shaftMaterial.opacity += arrowOpacityLerp;
            headMaterial.opacity = shaftMaterial.opacity * 1.6; // Head slightly more opaque

            // 3. Bobbing Animation (only in About section)
            if (currentSectionId === 'about') {
                arrowGroup.position.y = Math.sin(Date.now() * 0.002) * 0.3;
            } else {
                arrowGroup.position.y = 0; // Reset when not in About
            }

            // 4. Mouse Interaction (Tilt the PIVOT, but not in About)
            if (currentSectionId !== 'about') {
                pivot.rotation.y += 0.05 * (targetX - pivot.rotation.y);
                pivot.rotation.x += 0.05 * (targetY - pivot.rotation.x);
            }

            // 5. Constant Rotation
            sphere.rotation.z += targetState.rot.x;
            sphere.rotation.y += targetState.rot.y;
            
            innerSphere.rotation.z -= targetState.rot.x;
            innerSphere.rotation.y -= targetState.rot.y;
            
            // Rotate Arrow slightly for effect
            arrowGroup.rotation.x += 0.005;

            renderer.render(scene, camera);
        };

        animate();

        // Handle Resize
        window.addEventListener('resize', () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });
    };

    // Initialize Three.js only if library is loaded
    if (typeof THREE !== 'undefined') {
        initThreeJS();
    } else {
        // Fallback or wait for load (simple check)
        window.addEventListener('load', () => {
            if (typeof THREE !== 'undefined') initThreeJS();
        });
    }

    // Carousel Logic
    const initCarousels = () => {
        const carousels = document.querySelectorAll('.carousel');
        
        carousels.forEach(carousel => {
            const track = carousel.querySelector('.carousel-track');
            const slides = Array.from(track.children);
            const nextButton = carousel.querySelector('.carousel-btn.next');
            const prevButton = carousel.querySelector('.carousel-btn.prev');
            const indicatorsContainer = carousel.querySelector('.carousel-indicators');
            
            if (slides.length === 0) return;

            let currentIndex = 0;
            let autoSlideInterval;
            
            // Clear existing indicators to prevent duplicates if re-initialized
            if (indicatorsContainer) {
                indicatorsContainer.innerHTML = '';
                slides.forEach((_, index) => {
                    const dot = document.createElement('div');
                    dot.classList.add('dot');
                    if (index === 0) dot.classList.add('active');
                    dot.addEventListener('click', (e) => {
                        e.stopPropagation(); // Prevent bubbling
                        currentIndex = index;
                        updateCarousel();
                        resetAutoSlide();
                    });
                    indicatorsContainer.appendChild(dot);
                });
            }
            
            const updateCarousel = () => {
                // Use container width if slide width is not yet available
                const slideWidth = slides[0].getBoundingClientRect().width || carousel.clientWidth;
                track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
                
                // Update indicators
                if (indicatorsContainer) {
                    const dots = Array.from(indicatorsContainer.children);
                    dots.forEach((dot, index) => {
                        if (index === currentIndex) {
                            dot.classList.add('active');
                        } else {
                            dot.classList.remove('active');
                        }
                    });
                }
            };
            
            const nextSlide = () => {
                currentIndex = (currentIndex + 1) % slides.length;
                updateCarousel();
            };

            const prevSlide = () => {
                currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                updateCarousel();
            };
            
            // Handle window resize to adjust slide width
            window.addEventListener('resize', updateCarousel);

            // Ensure buttons exist before adding listeners
            if (nextButton) {
                nextButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    nextSlide();
                    resetAutoSlide();
                });
            }

            if (prevButton) {
                prevButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    prevSlide();
                    resetAutoSlide();
                });
            }
            
            // Auto-spin logic
            const startAutoSlide = () => {
                stopAutoSlide(); // Ensure no duplicate intervals
                autoSlideInterval = setInterval(nextSlide, 7000);
            };

            const stopAutoSlide = () => {
                if (autoSlideInterval) clearInterval(autoSlideInterval);
            };

            const resetAutoSlide = () => {
                stopAutoSlide();
                startAutoSlide();
            };

            // Start auto-slide
            startAutoSlide();

            // Pause on hover
            carousel.addEventListener('mouseenter', stopAutoSlide);
            carousel.addEventListener('mouseleave', startAutoSlide);
            
            // Initial update to set position
            // Use setTimeout to ensure layout is computed
            setTimeout(updateCarousel, 100);
        });
    };

    // Initialize carousels on load to ensure images are ready
    if (document.readyState === 'complete') {
        initCarousels();
    } else {
        window.addEventListener('load', initCarousels);
    }
});
