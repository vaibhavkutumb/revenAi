/* ============================================
   RevenAI - Main JavaScript
   ============================================ */

(function () {
    'use strict';

    // =========================================
    // Particle Background
    // =========================================
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };
    let animationFrame;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.4 + 0.1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

            // Mouse interaction
            if (mouse.x !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    const force = (150 - dist) / 150;
                    this.x -= (dx / dist) * force * 1.5;
                    this.y -= (dy / dist) * force * 1.5;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(99, 102, 241, ${this.opacity})`;
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 120);
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    const opacity = (1 - dist / 120) * 0.12;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        drawConnections();
        animationFrame = requestAnimationFrame(animateParticles);
    }

    resizeCanvas();
    initParticles();
    animateParticles();

    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // =========================================
    // Navbar Scroll Effect
    // =========================================
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // =========================================
    // Mobile Menu Toggle
    // =========================================
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // =========================================
    // Smooth Scroll for Anchor Links
    // =========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const y = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: y, behavior: 'smooth' });
                // Close mobile menu if open
                navLinks.classList.remove('active');
            }
        });
    });

    // =========================================
    // Counter Animation (Hero Stats)
    // =========================================
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = parseFloat(counter.getAttribute('data-target'));
            const duration = 2000;
            const start = performance.now();
            const isDecimal = target % 1 !== 0;

            function tick(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = target * eased;

                counter.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);

                if (progress < 1) {
                    requestAnimationFrame(tick);
                }
            }

            requestAnimationFrame(tick);
        });
    }

    // Trigger counters when hero is visible
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                heroObserver.disconnect();
            }
        });
    }, { threshold: 0.3 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        heroObserver.observe(heroStats);
    }

    // =========================================
    // Scroll Reveal Animations
    // =========================================
    const revealElements = document.querySelectorAll(
        '.feature-card, .step, .pricing-card, .section-header'
    );

    revealElements.forEach(el => el.classList.add('fade-in'));

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    // =========================================
    // Neural Network Visualization
    // =========================================
    function createNeuralNetwork() {
        const layers = [
            { id: 'nn-layer-1', count: 4 },
            { id: 'nn-layer-2', count: 6 },
            { id: 'nn-layer-3', count: 3 }
        ];

        layers.forEach(layer => {
            const el = document.getElementById(layer.id);
            if (!el) return;

            for (let i = 0; i < layer.count; i++) {
                const node = document.createElement('div');
                node.style.cssText = `
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: rgba(99, 102, 241, 0.6);
                    box-shadow: 0 0 10px rgba(99, 102, 241, 0.3);
                    animation: core-pulse ${2 + Math.random() * 2}s ease-in-out infinite;
                    animation-delay: ${Math.random() * 2}s;
                `;
                el.appendChild(node);
            }
        });
    }

    createNeuralNetwork();

    // =========================================
    // AI Chat Demo
    // =========================================
    const demoInput = document.getElementById('demo-input');
    const demoSend = document.getElementById('demo-send');
    const demoBody = document.getElementById('demo-body');

    const aiResponses = [
        "Based on my analysis, the data shows a 34% improvement in processing efficiency. I've identified three key optimization opportunities that could further reduce latency by 120ms.",
        "I've processed 2.4 million data points from your dataset. The primary cluster analysis reveals 7 distinct user segments with high confidence (p < 0.001). Shall I generate a detailed report?",
        "The neural network has completed training with 99.2% accuracy on validation data. Model convergence was achieved in 847 epochs. I recommend deploying to staging for A/B testing.",
        "I've detected an anomaly in your API traffic patterns at 14:32 UTC. Cross-referencing with historical data suggests a 78% probability this is related to the new feature rollout rather than malicious activity.",
        "Your natural language query has been processed. I found 156 relevant documents across 3 databases. The top results are ranked by semantic similarity with a confidence threshold of 0.85.",
        "I've optimized your machine learning pipeline. Key changes: batch size increased to 256, learning rate decay schedule adjusted, and gradient clipping threshold set to 1.0. Expected training time reduction: 42%.",
        "Sentiment analysis complete. Overall brand sentiment is 72% positive, 18% neutral, 10% negative. The negative sentiment is concentrated around shipping delays mentioned in 847 customer reviews.",
        "I've generated a predictive model for your Q3 revenue forecast. With 95% confidence interval, projected revenue is $4.2M - $4.8M, representing 23% YoY growth. Key drivers: enterprise adoption and API usage expansion."
    ];

    let responseIndex = 0;
    let isTyping = false;

    function addMessage(type, text) {
        const msg = document.createElement('div');
        msg.className = `demo-message demo-${type}`;

        const prefix = document.createElement('span');
        prefix.className = 'demo-prefix';
        prefix.textContent = type === 'user' ? 'you' : 'ai';

        const content = document.createElement('span');
        content.textContent = text;

        msg.appendChild(prefix);
        msg.appendChild(content);
        demoBody.appendChild(msg);
        demoBody.scrollTop = demoBody.scrollHeight;
    }

    function showTypingIndicator() {
        const msg = document.createElement('div');
        msg.className = 'demo-message demo-ai';
        msg.id = 'typing-msg';

        const prefix = document.createElement('span');
        prefix.className = 'demo-prefix';
        prefix.textContent = 'ai';

        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.innerHTML = '<span></span><span></span><span></span>';

        msg.appendChild(prefix);
        msg.appendChild(indicator);
        demoBody.appendChild(msg);
        demoBody.scrollTop = demoBody.scrollHeight;
    }

    function removeTypingIndicator() {
        const typing = document.getElementById('typing-msg');
        if (typing) typing.remove();
    }

    function typeResponse(text) {
        removeTypingIndicator();

        const msg = document.createElement('div');
        msg.className = 'demo-message demo-ai';

        const prefix = document.createElement('span');
        prefix.className = 'demo-prefix';
        prefix.textContent = 'ai';

        const content = document.createElement('span');
        content.textContent = '';

        msg.appendChild(prefix);
        msg.appendChild(content);
        demoBody.appendChild(msg);

        let i = 0;
        const speed = 15;

        function type() {
            if (i < text.length) {
                content.textContent += text.charAt(i);
                i++;
                demoBody.scrollTop = demoBody.scrollHeight;
                setTimeout(type, speed + Math.random() * 10);
            } else {
                isTyping = false;
            }
        }

        type();
    }

    function handleSend() {
        if (isTyping) return;
        const text = demoInput.value.trim();
        if (!text) return;

        isTyping = true;
        addMessage('user', text);
        demoInput.value = '';

        // Show typing indicator then respond
        setTimeout(() => {
            showTypingIndicator();
            setTimeout(() => {
                const response = aiResponses[responseIndex % aiResponses.length];
                responseIndex++;
                typeResponse(response);
            }, 1200 + Math.random() * 800);
        }, 400);
    }

    if (demoSend) {
        demoSend.addEventListener('click', handleSend);
    }

    if (demoInput) {
        demoInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') handleSend();
        });
    }

})();
