let murphyPlatformContext = {
    detectedPlatform: 'Unknown',
    userAgent: navigator.userAgent || ''
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initQRCodes();
    initPlatformDetection();
    initCounters();
    initParallax();
    initSmoothScroll();
    initDebugSuite();
});

// Generate Multiple QR Codes
function initQRCodes() {
    const repoURL = "https://github.com/Blackcockatoo/murphys-lore-";

    // QR Code for iOS/Mac
    if (document.getElementById("qrcode-apple")) {
        new QRCode(document.getElementById("qrcode-apple"), {
            text: repoURL,
            width: 180,
            height: 180,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    }

    // QR Code for Android/Windows
    if (document.getElementById("qrcode-android")) {
        new QRCode(document.getElementById("qrcode-android"), {
            text: repoURL,
            width: 180,
            height: 180,
            colorDark: "#3ddc84",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    }

    // QR Code for GitHub (Universal)
    if (document.getElementById("qrcode-github")) {
        new QRCode(document.getElementById("qrcode-github"), {
            text: repoURL,
            width: 200,
            height: 200,
            colorDark: "#6366f1",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    }
}

// Platform Detection
function initPlatformDetection() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    let detectedPlatform = '';
    let platformCard = null;

    // Detect iOS/Mac
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        detectedPlatform = 'iOS 📱';
        platformCard = document.getElementById('apple-card');
    } else if (/Mac/.test(userAgent)) {
        detectedPlatform = 'macOS 💻';
        platformCard = document.getElementById('apple-card');
    }
    // Detect Android
    else if (/android/i.test(userAgent)) {
        detectedPlatform = 'Android 📱';
        platformCard = document.getElementById('windows-card');
    }
    // Detect Windows
    else if (/Win/.test(userAgent)) {
        detectedPlatform = 'Windows 🖥️';
        platformCard = document.getElementById('windows-card');
    }
    // Detect Linux
    else if (/Linux/.test(userAgent)) {
        detectedPlatform = 'Linux 🐧';
        platformCard = document.getElementById('windows-card');
    }

    murphyPlatformContext = {
        detectedPlatform: detectedPlatform || 'Unknown',
        userAgent,
        timestamp: Date.now()
    };

    // Highlight detected platform
    if (platformCard) {
        platformCard.classList.add('detected');

        // Show notification
        const notification = document.getElementById('platformDetected');
        const platformSpan = document.getElementById('detectedPlatform');

        if (platformSpan && notification) {
            platformSpan.textContent = detectedPlatform;
            notification.classList.add('show');

            // Auto-hide after 5 seconds
            setTimeout(() => {
                notification.classList.remove('show');
            }, 5000);
        }

        // Scroll to platform section on mobile
        if (window.innerWidth <= 768) {
            setTimeout(() => {
                platformCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 500);
        }
    }

    // Log platform info for debugging
    console.log(`🎯 Platform detected: ${detectedPlatform || 'Unknown'}`);
}

// Debug Suite
function initDebugSuite() {
    const runButton = document.getElementById('runDiagnostics');
    const copyButton = document.getElementById('copyDebugLog');

    if (!runButton && !copyButton) return;

    const runSweep = () => {
        appendDebugLog('Launching Steelman sweep...');
        renderDiagnostics(collectDiagnostics());
    };

    runSweep();

    if (runButton) {
        runButton.addEventListener('click', runSweep);
    }

    if (copyButton) {
        copyButton.addEventListener('click', () => {
            const log = document.getElementById('debugLog');
            if (log) {
                copyToClipboard(log.textContent);
                appendDebugLog('Debug log copied to clipboard.');
            }
        });
    }

    window.addEventListener('online', runSweep);
    window.addEventListener('offline', runSweep);
    window.addEventListener('resize', runSweep);
}

function collectDiagnostics() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const bandwidth = connection?.downlink ? `${connection.downlink} Mbps` : 'Unknown';
    const connectionType = connection?.effectiveType || connection?.type || 'Unavailable';
    const onlineStatus = navigator.onLine ? 'Online ✅' : 'Offline ⚠️';
    const viewport = `${window.innerWidth} x ${window.innerHeight}`;
    const locale = navigator.language || (navigator.languages && navigator.languages[0]) || 'Unknown';
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown';
    const memory = navigator.deviceMemory ? `${navigator.deviceMemory} GB` : 'Unknown';
    const ua = murphyPlatformContext.userAgent || navigator.userAgent || 'Unavailable';

    return {
        platform: murphyPlatformContext.detectedPlatform || 'Unknown',
        onlineStatus,
        connectionType,
        bandwidth,
        viewport,
        locale,
        timezone,
        memory,
        ua
    };
}

function renderDiagnostics(data) {
    const { platform, onlineStatus, connectionType, bandwidth, viewport, locale, timezone, memory, ua } = data;

    updateElementText('debugPlatform', platform);
    updateElementText('debugNetwork', onlineStatus);
    updateElementText('debugConnection',
        connectionType === 'Unavailable' && bandwidth === 'Unknown'
            ? 'Connection API unavailable'
            : `${connectionType} | ${bandwidth}`
    );
    updateElementText('debugViewport', viewport);
    updateElementText('debugLocale', locale);
    updateElementText('debugTimezone', timezone);
    updateElementText('debugMemory', memory);

    appendDebugLog(`Steelman sweep: ${platform} · ${onlineStatus} · ${connectionType} (${bandwidth})`);
    appendDebugLog(`Vitals: ${viewport} | ${locale} | ${timezone} | Memory: ${memory}`);
    appendDebugLog(`UA: ${ua.substring(0, 140)}${ua.length > 140 ? '…' : ''}`);
}

function appendDebugLog(message) {
    const log = document.getElementById('debugLog');
    if (!log) return;

    const existing = log.textContent.trim() === 'Ready for diagnostics...'
        ? []
        : log.textContent.split('\n').filter(Boolean);

    const timestamp = new Date().toLocaleTimeString();
    existing.unshift(`[${timestamp}] ${message}`);

    log.textContent = existing.slice(0, 12).join('\n');
}

function updateElementText(id, value) {
    const el = document.getElementById(id);
    if (el) {
        el.textContent = value;
    }
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
