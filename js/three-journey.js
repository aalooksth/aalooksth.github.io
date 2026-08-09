import * as THREE from 'https://unpkg.com/three@0.128.0/build/three.module.js';

// Particle Journey Simulation for Personal Portfolio
class ParticleJourney {
    constructor() {
        this.canvas = document.getElementById('three-canvas');
        if (!this.canvas) return;

        // Configuration
        this.config = {
            mainCount: 40000,      // Main morphing liquid wave
            bgCount: 15000,        // Starfield background
            fgCount: 50,          // Floating foreground dust orbs
            colors: {
                primary: new THREE.Color('#8b5cf6'),   // Violet
                secondary: new THREE.Color('#3b82f6'), // Blue
                accent: new THREE.Color('#10b981'),    // Emerald Green
                highlight: new THREE.Color('#f43f5e'), // Pink
                cyan: new THREE.Color('#06b6d4')       // Neon Cyan
            }
        };

        // Scroll state
        this.scroll = {
            current: 0,
            target: 0,
            ease: 0.05
        };

        // Mouse parallax
        this.mouse = {
            x: 0,
            y: 0,
            targetX: 0,
            targetY: 0,
            ease: 0.04
        };

        // Initializer
        try {
            this.init();
        } catch (e) {
            console.error('WebGL failed to initialize:', e);
            this.canvas.style.display = 'none';
        }
    }

    init() {
        // 1. Scene
        this.scene = new THREE.Scene();

        // 2. Camera
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, -25, 45);
        this.currentLookAt = new THREE.Vector3(0, 0, 0);

        // 3. Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Create a custom texture helper for soft glowing particles
        this.particleTexture = this.createGlowTexture();

        // 4. Create Three Layers of Particles
        this.createBackgroundStarfield();
        this.createMainMorphingParticles();
        this.createForegroundDust();

        // 5. Camera Keyframes (scroll position 0.0 to 1.0)
        // Maps to sections: Hero, Skills, Experience, Education, Contact
        this.cameraKeyframes = [
            { x: 0, y: -22, z: 45, lookX: 0, lookY: 2, lookZ: 0 },       // Section 0: Hero (Calm flow)
            { x: 14, y: -8, z: 32, lookX: -5, lookY: 6, lookZ: 0 },      // Section 1: Skills (Hovering spheres)
            { x: -16, y: -16, z: 36, lookX: 12, lookY: -2, lookZ: 0 },   // Section 2: Experience (Timeline river)
            { x: 0, y: -20, z: 32, lookX: 0, lookY: 4, lookZ: 0 },       // Section 3: Education (Helix)
            { x: 0, y: -4, z: 46, lookX: 0, lookY: 4, lookZ: -15 }       // Section 4: Contact (Vortex funnel)
        ];

        // 6. Event listeners
        window.addEventListener('resize', this.onResize.bind(this));
        window.addEventListener('scroll', this.onScroll.bind(this));
        window.addEventListener('mousemove', this.onMouseMove.bind(this));

        // Trigger initial scroll calculation
        this.onScroll();

        // Hook up HTML hover interactions to target WebGL particle structures
        this.setupTimelineInteractions();

        // 7. Clock & Animation Loop
        this.clock = new THREE.Clock();
        this.animate();
        
        // Add success class to body
        document.body.classList.add('webgl-initialized');
    }

    setupTimelineInteractions() {
        // Query experience timeline items
        const expItems = document.querySelectorAll('#experience .timeline-item');
        expItems.forEach((item, index) => {
            item.addEventListener('mouseenter', () => {
                if (this.material && this.material.uniforms) {
                    this.material.uniforms.uActiveNode.value = parseFloat(index);
                    this.material.uniforms.uActiveType.value = 1.0; // Experience
                }
            });
            item.addEventListener('mouseleave', () => {
                if (this.material && this.material.uniforms) {
                    this.material.uniforms.uActiveNode.value = -1.0;
                    this.material.uniforms.uActiveType.value = 0.0;
                }
            });
        });

        // Query education timeline items
        const eduItems = document.querySelectorAll('#education .timeline-item');
        eduItems.forEach((item, index) => {
            item.addEventListener('mouseenter', () => {
                if (this.material && this.material.uniforms) {
                    this.material.uniforms.uActiveNode.value = parseFloat(index);
                    this.material.uniforms.uActiveType.value = 2.0; // Education
                }
            });
            item.addEventListener('mouseleave', () => {
                if (this.material && this.material.uniforms) {
                    this.material.uniforms.uActiveNode.value = -1.0;
                    this.material.uniforms.uActiveType.value = 0.0;
                }
            });
        });
    }

    // Creates a high-quality Canvas-based radial gradient texture for the particles
    createGlowTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');

        // Draw a radial gradient that fades out softly
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.15, 'rgba(255, 255, 255, 0.9)');
        gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.2)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);

        const texture = new THREE.CanvasTexture(canvas);
        return texture;
    }

    // Layer 1: Background Starfield (Deep, tiny, rotating particles)
    createBackgroundStarfield() {
        const count = this.config.bgCount;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        const colorOptions = [this.config.colors.secondary, this.config.colors.primary, this.config.colors.cyan];

        for (let i = 0; i < count; i++) {
            // Distribute randomly in a massive sphere
            const r = 120 + Math.random() * 80;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);

            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);

            // Give background stars soft blue/indigo tinting
            const chosenColor = colorOptions[Math.floor(Math.random() * colorOptions.length)];
            colors[i * 3] = chosenColor.r * 0.6;
            colors[i * 3 + 1] = chosenColor.g * 0.65;
            colors[i * 3 + 2] = chosenColor.b * 0.9;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.35,
            vertexColors: true,
            transparent: true,
            opacity: 0.45,
            map: this.particleTexture,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.bgPoints = new THREE.Points(geometry, material);
        this.scene.add(this.bgPoints);
    }

    // Layer 2: Main Morphing Particles (The organic liquid flow)
    createMainMorphingParticles() {
        const count = this.config.mainCount;
        const positions = new Float32Array(count * 3);
        const aRandom = new Float32Array(count);
        const aGroup = new Float32Array(count); // Orbit grouping for skills

        const size = Math.sqrt(count); // 200x200 grid
        let idx = 0;
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                // Flat grid centered on X and Y
                positions[idx * 3] = ((i / size) - 0.5) * 85;
                positions[idx * 3 + 1] = ((j / size) - 0.5) * 85;
                positions[idx * 3 + 2] = 0;

                aRandom[idx] = Math.random();
                aGroup[idx] = idx % 3; // Split into 3 groups for skill clusters

                idx++;
            }
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('aRandom', new THREE.BufferAttribute(aRandom, 1));
        geometry.setAttribute('aGroup', new THREE.BufferAttribute(aGroup, 1));

        // Shader Material incorporating 3D Simplex Noise for organic morphing
        this.material = new THREE.ShaderMaterial({
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            uniforms: {
                uTime: { value: 0 },
                uScroll: { value: 0 },
                uMouse: { value: new THREE.Vector2(0, 0) },
                uActiveNode: { value: -1.0 },
                uActiveType: { value: 0.0 },
                uColorPrimary: { value: this.config.colors.primary },
                uColorSecondary: { value: this.config.colors.secondary },
                uColorAccent: { value: this.config.colors.accent },
                uColorHighlight: { value: this.config.colors.highlight },
                uColorCyan: { value: this.config.colors.cyan }
            },
            vertexShader: `
                uniform float uTime;
                uniform float uScroll;
                uniform vec2 uMouse;
                uniform float uActiveNode;
                uniform float uActiveType;
                
                attribute float aRandom;
                attribute float aGroup;
                
                varying vec3 vColor;
                varying float vRandom;
                
                uniform vec3 uColorPrimary;
                uniform vec3 uColorSecondary;
                uniform vec3 uColorAccent;
                uniform vec3 uColorHighlight;
                uniform vec3 uColorCyan;
                
                #define PI 3.14159265359

                // --- Stefan Gustavson's 3D Simplex Noise ---
                vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
                vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
                vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
                vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
                
                float snoise(vec3 v) {
                    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
                    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
                    
                    vec3 i  = floor(v + dot(v, C.yyy));
                    vec3 x0 = v - i + dot(i, C.xxx);
                    
                    vec3 g = step(x0.yzx, x0.xyz);
                    vec3 l = 1.0 - g;
                    vec3 i1 = min(g.xyz, l.zxy);
                    vec3 i2 = max(g.xyz, l.zxy);
                    
                    vec3 x1 = x0 - i1 + C.xxx;
                    vec3 x2 = x0 - i2 + C.yyy;
                    vec3 x3 = x0 - D.yyy;
                    
                    i = mod289(i);
                    vec4 p = permute(permute(permute(
                                i.z + vec4(0.0, i1.z, i2.z, 1.0))
                            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
                            
                    float n_ = 0.142857142857;
                    vec3 ns = n_ * D.wyz - D.xzx;
                    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
                    
                    vec4 x_ = floor(j * ns.z);
                    vec4 y_ = floor(j - 7.0 * x_);
                    
                    vec4 x = x_ * ns.x + ns.yyyy;
                    vec4 y = y_ * ns.x + ns.yyyy;
                    vec4 h = 1.0 - abs(x) - abs(y);
                    
                    vec4 b0 = vec4(x.xy, y.xy);
                    vec4 b1 = vec4(x.zw, y.zw);
                    
                    vec4 s0 = floor(b0)*2.0 + 1.0;
                    vec4 s1 = floor(b1)*2.0 + 1.0;
                    vec4 sh = -step(h, vec4(0.0));
                    
                    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
                    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
                    
                    vec3 p0 = vec3(a0.xy, h.x);
                    vec3 p1 = vec3(a0.zw, h.y);
                    vec3 p2 = vec3(a1.xy, h.z);
                    vec3 p3 = vec3(a1.zw, h.w);
                    
                    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
                    p0 *= norm.x;
                    p1 *= norm.y;
                    p2 *= norm.z;
                    p3 *= norm.w;
                    
                    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
                    m = m * m;
                    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
                }

                // State 0: Hero (Organic liquid wave terrain)
                vec3 getHeroState(vec3 pos, float time) {
                    vec3 p = pos;
                    // Layer noise for complex, beautiful liquid undulations
                    float n1 = snoise(vec3(p.x * 0.02, p.y * 0.02, time * 0.25)) * 9.0;
                    float n2 = snoise(vec3(p.x * 0.05, p.y * 0.05, time * 0.45)) * 3.5;
                    p.z += n1 + n2;
                    return p;
                }

                // State 1: Skills (Three Organic Floating Nebula Cells)
                vec3 getSkillsState(vec3 pos, float time) {
                    vec3 center;
                    if (aGroup == 0.0) {
                        center = vec3(-22.0, 10.0, 5.0);      // Left category
                    } else if (aGroup == 1.0) {
                        center = vec3(0.0, -8.0, 12.0);       // Center category
                    } else {
                        center = vec3(22.0, 15.0, 0.0);       // Right category
                    }
                    
                    // Sphere coordinate mapping
                    float phi = pos.x * 0.15;
                    float theta = pos.y * 0.08;
                    
                    // Warp radius using noise to create soft, boiling plasma cells
                    float n = snoise(vec3(cos(phi) * 1.5, sin(theta) * 1.5, time * 0.5 + aRandom * 0.2));
                    float r = 7.0 + n * 2.2;
                    
                    vec3 spherePos;
                    spherePos.x = r * sin(theta) * cos(phi);
                    spherePos.y = r * sin(theta) * sin(phi);
                    spherePos.z = r * cos(theta);
                    
                    // Orbit the particles inside each nebula
                    float orbitSpeed = time * 0.15 * (aGroup + 1.2);
                    vec3 rotatedSphere = spherePos;
                    rotatedSphere.x = spherePos.x * cos(orbitSpeed) - spherePos.y * sin(orbitSpeed);
                    rotatedSphere.y = spherePos.x * sin(orbitSpeed) + spherePos.y * cos(orbitSpeed);
                    
                    return center + rotatedSphere;
                }

                // State 2: Experience (Flowing snaking river timeline)
                vec3 getExperienceState(vec3 pos, float time) {
                    vec3 p = pos;
                    // Snaking path + flowing ripples
                    float flow = time * 1.2 + pos.y * 0.1;
                    float n = snoise(vec3(pos.y * 0.04, flow * 0.25, 0.0)) * 14.0;
                    p.x = n + pos.x * 0.1; // narrow width
                    p.z += snoise(vec3(pos.y * 0.08, pos.x * 0.08, flow * 0.5)) * 4.0;
                    return p;
                }

                // State 3: Education (Double Helix with organic waviness)
                vec3 getEducationState(vec3 pos, float time) {
                    float strand = step(1.5, mod(pos.x, 3.0));
                    float angle = pos.y * 0.16 + time * 1.4;
                    if (strand > 0.5) {
                        angle += PI;
                    }
                    
                    // Radius deformed by noise
                    float rNoise = snoise(vec3(pos.y * 0.06, time * 0.5, aRandom)) * 1.5;
                    float r = 7.5 + rNoise;
                    
                    vec3 p;
                    p.x = cos(angle) * r;
                    p.y = pos.y * 0.85;
                    p.z = sin(angle) * r;
                    
                    // Add connection bars
                    if (mod(pos.y, 4.5) < 0.18 && aRandom > 0.45) {
                        p = mix(
                            vec3(cos(angle)*r, pos.y*0.85, sin(angle)*r),
                            vec3(cos(angle+PI)*r, pos.y*0.85, sin(angle+PI)*r),
                            aRandom
                        );
                    }
                    
                    return p;
                }

                // State 4: Contact (Dense Spinning Space Portal Vortex)
                vec3 getContactState(vec3 pos, float time) {
                    float radius = (pos.y + 42.0) * 0.45; // 0 to ~38
                    
                    // Radial spiral twist + acceleration
                    float angle = pos.x * 0.12 + radius * 0.3 + time * 2.8;
                    
                    // Add noise to spiral to look chaotic and gaseous
                    float n = snoise(vec3(cos(angle)*1.5, sin(angle)*1.5, radius * 0.1 - time * 0.6)) * 2.0;
                    float finalRadius = max(0.2, radius + n);
                    
                    vec3 p;
                    p.x = cos(angle) * finalRadius;
                    p.y = sin(angle) * finalRadius;
                    // Funnel depth
                    p.z = -35.0 + finalRadius * 1.6 + sin(finalRadius * 0.4 - time * 3.5) * 2.5;
                    return p;
                }

                void main() {
                    vRandom = aRandom;
                    
                    // Fetch morphed coords
                    vec3 s0 = getHeroState(position, uTime);
                    vec3 s1 = getSkillsState(position, uTime);
                    vec3 s2 = getExperienceState(position, uTime);
                    vec3 s3 = getEducationState(position, uTime);
                    vec3 s4 = getContactState(position, uTime);
                    
                    // Segment-based interpolation
                    float progress = clamp(uScroll * 4.0, 0.0, 4.0);
                    vec3 finalPos;
                    float stateProgress;
                    
                    if (progress <= 1.0) {
                        stateProgress = smoothstep(0.0, 1.0, progress);
                        finalPos = mix(s0, s1, stateProgress);
                    } else if (progress <= 2.0) {
                        stateProgress = smoothstep(0.0, 1.0, progress - 1.0);
                        finalPos = mix(s1, s2, stateProgress);
                    } else if (progress <= 3.0) {
                        stateProgress = smoothstep(0.0, 1.0, progress - 2.0);
                        finalPos = mix(s2, s3, stateProgress);
                    } else {
                        stateProgress = smoothstep(0.0, 1.0, progress - 3.0);
                        finalPos = mix(s3, s4, stateProgress);
                    }
                    
                    // Advanced interactive mouse ripple force
                    float distToMouse = length(finalPos.xy - uMouse * 40.0);
                    if (distToMouse < 18.0) {
                        // Push out and elevate based on distance
                        float factor = 1.0 - (distToMouse / 18.0);
                        float ripple = sin(distToMouse * 0.4 - uTime * 6.0) * 1.5;
                        finalPos.z += (factor * 3.5) + ripple;
                    }
                    
                    // High-end color mapping based on scroll states and positions
                    vec3 col = uColorPrimary;
                    
                    // Hero (Purple to Teal)
                    if (progress <= 1.0) {
                        col = mix(uColorPrimary, uColorCyan, clamp((finalPos.x + 30.0)/60.0, 0.0, 1.0));
                    }
                    // Skills (Purple, Blue, Emerald blend)
                    else if (progress <= 2.0) {
                        if (aGroup == 0.0) {
                            col = mix(uColorPrimary, uColorSecondary, clamp(finalPos.z * 0.1 + 0.5, 0.0, 1.0));
                        } else if (aGroup == 1.0) {
                            col = mix(uColorSecondary, uColorCyan, clamp(finalPos.z * 0.1 + 0.5, 0.0, 1.0));
                        } else {
                            col = mix(uColorCyan, uColorAccent, clamp(finalPos.z * 0.1 + 0.5, 0.0, 1.0));
                        }
                    }
                    // Experience (Cyan to Emerald river)
                    else if (progress <= 3.0) {
                        col = mix(uColorCyan, uColorAccent, clamp((finalPos.y + 40.0)/80.0, 0.0, 1.0));
                        // Add highlighted flow details
                        if (aRandom > 0.85) {
                            col = uColorHighlight;
                        }
                    }
                    // Education (Emerald to Violet helix)
                    else if (progress <= 3.8) {
                        col = mix(uColorAccent, uColorPrimary, clamp((finalPos.y + 30.0)/60.0, 0.0, 1.0));
                        if (mod(pos.y, 4.5) < 0.18) {
                            col = uColorHighlight; // glow the helix connectors
                        }
                    }
                    // Contact (Vortex: Magenta highlight outer, deep violet inner)
                    else {
                        float distCenter = length(finalPos.xy);
                        col = mix(uColorHighlight, uColorPrimary, clamp((distCenter - 3.0) / 25.0, 0.0, 1.0));
                    }

                    // --- ACTIVE TIMELINE NODE HIGHLIGHTS ---
                    float sizeMultiplier = 1.0;
                    if (uActiveType == 1.0 && progress > 1.2 && progress < 2.8) {
                        float nodeIdx = -1.0;
                        if (position.y > 15.0) nodeIdx = 0.0;
                        else if (position.y > 0.0) nodeIdx = 1.0;
                        else if (position.y > -15.0) nodeIdx = 2.0;
                        else nodeIdx = 3.0;
                        
                        if (abs(nodeIdx - uActiveNode) < 0.1) {
                            sizeMultiplier = 2.5;
                            col = mix(col, uColorHighlight, 0.85);
                            finalPos.z += sin(uTime * 8.0 + position.y) * 3.0; // active ripple
                        }
                    }
                    else if (uActiveType == 2.0 && progress > 2.2 && progress < 3.8) {
                        float nodeIdx = -1.0;
                        if (position.y > 10.0) nodeIdx = 0.0;
                        else if (position.y > -10.0) nodeIdx = 1.0;
                        else nodeIdx = 2.0;
                        
                        if (abs(nodeIdx - uActiveNode) < 0.1) {
                            sizeMultiplier = 2.8;
                            col = mix(col, uColorHighlight, 0.9);
                            finalPos.x += sin(uTime * 9.0 + position.y) * 2.0; // active helix oscillation
                            finalPos.z += cos(uTime * 9.0 + position.y) * 2.0;
                        }
                    }
                    
                    vColor = col;
                    
                    // Project and calculate point size with attenuation
                    vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
                    gl_Position = projectionMatrix * mvPosition;
                    
                    // High-quality size decay (closer is larger) * sizeMultiplier
                    gl_PointSize = (10.0 + aRandom * 7.0) * (330.0 / -mvPosition.z) * sizeMultiplier;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                varying float vRandom;
                
                void main() {
                    // Coordinates relative to center of particle (-0.5 to 0.5)
                    float dist = length(gl_PointCoord - vec2(0.5));
                    if (dist > 0.5) discard;
                    
                    // Soft gradient circle + exponential glowing aura core
                    float alpha = smoothstep(0.5, 0.05, dist);
                    float glow = exp(-dist * 8.0) * 1.4;
                    
                    gl_FragColor = vec4(vColor, alpha * (0.35 + vRandom * 0.25) + glow * 0.55);
                }
            `
        });

        this.mainPoints = new THREE.Points(geometry, this.material);
        this.scene.add(this.mainPoints);
    }

    // Layer 3: Foreground Dust / Fireflies
    createForegroundDust() {
        const count = this.config.fgCount;
        this.fgGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const randoms = new Float32Array(count);
        // Additional arrays for firefly behavior
        const colors = new Float32Array(count * 3);
        const opacities = new Float32Array(count);

        const orbColor = this.config.colors.cyan;
        const fireflyColor = new THREE.Color('#bef264'); // Yellow-green

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 75;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 75;
            positions[i * 3 + 2] = Math.random() * 40;
            randoms[i] = Math.random();
            opacities[i] = Math.random();
            // Start with orb color
            colors[i * 3] = orbColor.r;
            colors[i * 3 + 1] = orbColor.g;
            colors[i * 3 + 2] = orbColor.b;
        }

        this.fgGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.fgGeometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));
        this.fgGeometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
        this.fgGeometry.setAttribute('aOpacityOffset', new THREE.BufferAttribute(opacities, 1));

        // Use a ShaderMaterial for dynamic transitions between Orbs (Light) and Fireflies (Dark)
        this.fgMaterial = new THREE.ShaderMaterial({
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            uniforms: {
                uTime: { value: 0 },
                uTexture: { value: this.particleTexture },
                uIsNight: { value: 0.0 }
            },
            vertexShader: `
                uniform float uTime;
                uniform float uIsNight;
                attribute float aRandom;
                attribute float aOpacityOffset;
                attribute vec3 aColor;
                varying vec3 vColor;
                varying float vAlpha;
                void main() {
                    vColor = aColor;
                    
                    // Firefly pulsing
                    float pulse = (sin(uTime * 3.0 + aOpacityOffset * 10.0) + 1.0) * 0.5;
                    float baseAlpha = pulse * 0.8 * uIsNight; // Only visible in the dark
                    vAlpha = baseAlpha;
                    
                    // Firefly jitter (only apply at night)
                    vec3 pos = position;
                    float jitterX = sin(uTime * 5.0 + aRandom * 20.0) * 0.5 * uIsNight;
                    float jitterY = cos(uTime * 4.3 + aRandom * 20.0) * 0.5 * uIsNight;
                    pos.x += jitterX;
                    pos.y += jitterY;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_Position = projectionMatrix * mvPosition;
                    
                    // Size is smaller for fireflies, larger for orbs
                    float targetSize = mix(0.9, 0.4, uIsNight);
                    gl_PointSize = (targetSize * 600.0) / -mvPosition.z; // Increased multiplier so they are visible!
                }
            `,
            fragmentShader: `
                uniform sampler2D uTexture;
                varying vec3 vColor;
                varying float vAlpha;
                void main() {
                    vec4 texColor = texture2D(uTexture, gl_PointCoord);
                    gl_FragColor = vec4(vColor, vAlpha * texColor.a);
                }
            `
        });

        this.fgPoints = new THREE.Points(this.fgGeometry, this.fgMaterial);
        this.scene.add(this.fgPoints);
        this.fgRandoms = randoms;
    }

    getCameraConfig(p) {
        const segment = p * 4; // Scale 0-1 to 0-4
        const index = Math.floor(segment);
        const t = segment - index;
        
        if (index >= 4) return this.cameraKeyframes[4];
        
        const p1 = this.cameraKeyframes[index];
        const p2 = this.cameraKeyframes[index + 1];
        
        // Hermite curve easing for cinematic transition
        const easeT = t * t * (3 - 2 * t);
        
        return {
            x: p1.x + (p2.x - p1.x) * easeT,
            y: p1.y + (p2.y - p1.y) * easeT,
            z: p1.z + (p2.z - p1.z) * easeT,
            lookX: p1.lookX + (p2.lookX - p1.lookX) * easeT,
            lookY: p1.lookY + (p2.lookY - p1.lookY) * easeT,
            lookZ: p1.lookZ + (p2.lookZ - p1.lookZ) * easeT
        };
    }

    onScroll() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        this.scroll.target = docHeight > 0 ? scrollTop / docHeight : 0;
    }

    onMouseMove(event) {
        this.mouse.targetX = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.targetY = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        const time = this.clock.getElapsedTime();
        this.material.uniforms.uTime.value = time;

        // 1. Smoothly interpolate scroll
        this.scroll.current += (this.scroll.target - this.scroll.current) * this.scroll.ease;
        this.material.uniforms.uScroll.value = this.scroll.current;

        // 2. Smoothly interpolate mouse
        this.mouse.x += (this.mouse.targetX - this.mouse.x) * this.mouse.ease;
        this.mouse.y += (this.mouse.targetY - this.mouse.y) * this.mouse.ease;
        this.material.uniforms.uMouse.value.set(this.mouse.x, this.mouse.y);

        // 3. Camera Position Interpolation
        const camConfig = this.getCameraConfig(this.scroll.current);
        
        let targetCamX = camConfig.x;
        let targetCamY = camConfig.y;
        
        // Mouse parallax depth effect (tilts the scene perspective)
        targetCamX += this.mouse.x * 4.5;
        targetCamY += this.mouse.y * 3.5;

        this.camera.position.x += (targetCamX - this.camera.position.x) * 0.05;
        this.camera.position.y += (targetCamY - this.camera.position.y) * 0.05;
        this.camera.position.z += (camConfig.z - this.camera.position.z) * 0.05;

        // Smooth lookAt tracking
        const targetLookAt = new THREE.Vector3(camConfig.lookX, camConfig.lookY, camConfig.lookZ);
        this.currentLookAt.lerp(targetLookAt, 0.05);
        this.camera.lookAt(this.currentLookAt);

        // 4. Animate Background Starfield (very slow base drift)
        this.bgPoints.rotation.y = time * 0.003;
        this.bgPoints.rotation.x = time * 0.001;

        // 5. Animate Foreground Dust / Fireflies
        const isNight = document.body.classList.contains('theme-auto') ? document.body.classList.contains('time-night') : document.body.classList.contains('dark-theme');
        // Smoothly interpolate the night uniform
        this.fgMaterial.uniforms.uIsNight.value += ( (isNight ? 1.0 : 0.0) - this.fgMaterial.uniforms.uIsNight.value ) * 0.05;
        this.fgMaterial.uniforms.uTime.value = time;
        
        const nightRatio = this.fgMaterial.uniforms.uIsNight.value;
        const orbColor = this.config.colors.cyan;
        const fireflyColor = new THREE.Color('#bef264');
        
        const fgPositions = this.fgGeometry.attributes.position.array;
        const fgColors = this.fgGeometry.attributes.aColor.array;
        
        for (let i = 0; i < this.config.fgCount; i++) {
            const rand = this.fgRandoms[i];
            
            // Apply drift animation in all axes
            // Fireflies drift slightly faster and randomly
            const driftSpeed = 0.012 + (0.01 * nightRatio);
            fgPositions[i * 3 + 1] += Math.sin(time * 0.15 + rand * 100.0) * driftSpeed; // drift Y
            fgPositions[i * 3] += Math.cos(time * 0.1 + rand * 100.0) * driftSpeed;     // drift X
            
            // Loop particles back to bottom/top if they wander too far
            if (fgPositions[i * 3 + 1] > 40) fgPositions[i * 3 + 1] = -40;
            if (fgPositions[i * 3 + 1] < -40) fgPositions[i * 3 + 1] = 40;
            if (fgPositions[i * 3] > 40) fgPositions[i * 3] = -40;
            if (fgPositions[i * 3] < -40) fgPositions[i * 3] = 40;
            
            // Interpolate color dynamically on CPU
            fgColors[i * 3] = orbColor.r + (fireflyColor.r - orbColor.r) * nightRatio;
            fgColors[i * 3 + 1] = orbColor.g + (fireflyColor.g - orbColor.g) * nightRatio;
            fgColors[i * 3 + 2] = orbColor.b + (fireflyColor.b - orbColor.b) * nightRatio;
        }
        this.fgGeometry.attributes.position.needsUpdate = true;
        this.fgGeometry.attributes.aColor.needsUpdate = true;
        
        // Rotate main mesh slightly
        this.mainPoints.rotation.z = time * 0.015;

        this.renderer.render(this.scene, this.camera);
    }
}

// Start simulation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ParticleJourney();
});
