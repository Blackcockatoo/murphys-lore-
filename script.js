// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initQRCode();
    initCounters();
    initParallax();
    initSmoothScroll();
});

// Generate QR Code
function initQRCode() {
    const qrcode = new QRCode(document.getElementById("qrcode"), {
        text: "https://github.com/Blackcockatoo/murphys-lore-",
        width: 200,
        height: 200,
        colorDark: "#6366f1",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
}

// Animated Counter
function initCounters() {
    const counters = document.querySelectorAll('.stat-value');
    const speed = 200; // Animation speed

    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const increment = target / speed;
        let count = 0;

        const updateCount = () => {
            count += increment;
            if (count < target) {
                counter.textContent = Math.ceil(count);
                requestAnimationFrame(updateCount);
            } else {
                counter.textContent = target;
            }
        };

        updateCount();
    };

    // Intersection Observer for triggering animation when in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// Copy to Clipboard Function
function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification();
        }).catch(err => {
            fallbackCopyToClipboard(text);
        });
    } else {
        fallbackCopyToClipboard(text);
    }
}

// Fallback for older browsers
function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        document.execCommand('copy');
        showNotification();
    } catch (err) {
        console.error('Failed to copy text: ', err);
    }

    document.body.removeChild(textArea);
}

// Show Copy Notification
function showNotification() {
    const notification = document.getElementById('copyNotification');
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

// Parallax Effect on Mouse Move
function initParallax() {
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    const updateParallax = () => {
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        const cards = document.querySelectorAll('.glass-card');
        cards.forEach((card, index) => {
            const depth = (index + 1) * 0.02;
            const moveX = (targetX - window.innerWidth / 2) * depth;
            const moveY = (targetY - window.innerHeight / 2) * depth;
            card.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });

        requestAnimationFrame(updateParallax);
    };

    // Only enable parallax on desktop
    if (window.innerWidth > 768) {
        updateParallax();
    }
}

// Smooth Scroll for Internal Links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
}

// Add Sparkle Effect on Click
document.addEventListener('click', (e) => {
    createSparkle(e.clientX, e.clientY);
});

function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.style.position = 'fixed';
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    sparkle.style.width = '10px';
    sparkle.style.height = '10px';
    sparkle.style.background = 'radial-gradient(circle, #6366f1, transparent)';
    sparkle.style.borderRadius = '50%';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '9999';
    sparkle.style.animation = 'sparkle-fade 0.6s ease-out forwards';

    document.body.appendChild(sparkle);

    setTimeout(() => {
        sparkle.remove();
    }, 600);
}

// Add sparkle animation
const style = document.createElement('style');
style.textContent = `
    @keyframes sparkle-fade {
        0% {
            transform: scale(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: scale(3) rotate(180deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Add Ripple Effect to Buttons
document.querySelectorAll('.download-btn, .github-link').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.5)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s ease-out';
        ripple.style.pointerEvents = 'none';

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Easter Egg: Konami Code
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);

    if (konamiCode.join('') === konamiPattern.join('')) {
        activateEasterEgg();
    }
});

function activateEasterEgg() {
    document.body.style.animation = 'rainbow 2s linear infinite';
    const easterEggStyle = document.createElement('style');
    easterEggStyle.textContent = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(easterEggStyle);

    setTimeout(() => {
        document.body.style.animation = '';
    }, 5000);
}

// Add Loading Animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Mobile Touch Effects
if ('ontouchstart' in window) {
    document.querySelectorAll('.glass-card').forEach(card => {
        card.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });

        card.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

// Add PWA-like Features
if ('serviceWorker' in navigator) {
    // Uncomment when you add a service worker
    // navigator.serviceWorker.register('/sw.js');
}

// Performance Monitoring
if (window.performance) {
    window.addEventListener('load', () => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`🚀 Page loaded in ${pageLoadTime}ms - Murphy's Lore is FAST! 💎`);
    });
}

// Add Visibility Change Detection
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        document.title = '👋 Come back to Murphy\'s Lore!';
    } else {
        document.title = 'Murphy\'s Lore 🔥';
    }
});

console.log(`
🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
   MURPHY'S LORE
   Campaign 2025
   No Cap Mode: ON
   Swag Level: MAX
🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
`);
