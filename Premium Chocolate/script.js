document.addEventListener('DOMContentLoaded', () => {
    // Header Scroll Effect
    const header = document.querySelector('.site-header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check
    handleScroll();

    // Intersection Observer for scroll animations
    const animationOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Apply animation only if the user hasn't requested reduced motion natively or if we just detect it
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            
            if (entry.isIntersecting && !prefersReducedMotion) {
                entry.target.classList.add('is-visible');
                // Optional: stop observing once animated
                // observer.unobserve(entry.target);
            }
        });
    }, animationOptions);
    
    const animatedElements = document.querySelectorAll('.scroll-animate');
    animatedElements.forEach(el => observer.observe(el));
    
    // Add initial reveal to hero elements (also respecting reduced motion)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
        const heroElements = document.querySelectorAll('.hero-section .reveal-text');
        heroElements.forEach((el, index) => {
            el.classList.add('scroll-animate', 'fade-up', 'is-visible');
            el.style.transitionDelay = `${index * 0.2}s`;
        });
    }

    // Hero Canvas Scroll Animation
    const heroCanvas = document.getElementById('hero-canvas');
    if (heroCanvas) {
        const context = heroCanvas.getContext('2d');
        heroCanvas.width = 1920;
        heroCanvas.height = 1080;

        if (!prefersReducedMotion) {
            const frameCount = 80;
            const currentFrame = index => (
                `hero/Chocolate_unwrapping_exploding_202604212100_${index.toString().padStart(3, '0')}.jpg`
            );

            const images = [];

            for (let i = 0; i < frameCount; i++) {
                const img = new Image();
                img.src = currentFrame(i);
                images.push(img);
            }

            // Draw initial frame
            images[0].onload = () => {
                context.drawImage(images[0], 0, 0, heroCanvas.width, heroCanvas.height);
            };

            const updateImage = index => {
                if(images[index] && images[index].complete) {
                    context.drawImage(images[index], 0, 0, heroCanvas.width, heroCanvas.height);
                }
            };

            window.addEventListener('scroll', () => {
                const heroSection = document.querySelector('.hero-section');
                const scrollTop = window.scrollY - heroSection.offsetTop;
                const maxScroll = heroSection.scrollHeight - window.innerHeight;
                
                let scrollFraction = scrollTop / maxScroll;
                if(scrollFraction < 0) scrollFraction = 0;
                if(scrollFraction > 1) scrollFraction = 1;

                const frameIndex = Math.min(
                    frameCount - 1,
                    Math.floor(scrollFraction * frameCount)
                );
                
                requestAnimationFrame(() => updateImage(frameIndex));
            }, { passive: true });
        } else {
            // Reduced motion fallback: show the first frame statically
            const fallbackImg = new Image();
            fallbackImg.src = `hero/Chocolate_unwrapping_exploding_202604212100_000.jpg`;
            fallbackImg.onload = () => {
                 context.drawImage(fallbackImg, 0, 0, heroCanvas.width, heroCanvas.height);
            };
        }
    }
});
