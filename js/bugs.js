function initBugs() {
    const style = document.createElement('style');
    style.innerHTML = `
        .bug-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 9999;
            overflow: hidden;
            display: none;
        }
        body.time-day .bug-container,
        body.light-theme:not(.theme-auto) .bug-container {
            display: block;
        }
        
        .bug-wrapper {
            position: absolute;
            transition: transform 3s ease-in-out;
            will-change: transform;
        }

        /* Butterfly */
        .butterfly {
            width: 20px;
            height: 20px;
            position: relative;
            transform-style: preserve-3d;
            transition: transform 0.5s ease;
        }
        .butterfly-wing {
            position: absolute;
            width: 12px;
            height: 20px;
            background: linear-gradient(135deg, #f43f5e, #fb923c);
            border-radius: 50% 50% 0 50%;
            transform-origin: right center;
            box-shadow: inset 0 0 4px rgba(0,0,0,0.3);
            opacity: 0.9;
        }
        .butterfly-wing.right {
            left: 12px;
            background: linear-gradient(225deg, #f43f5e, #fb923c);
            border-radius: 50% 50% 50% 0;
            transform-origin: left center;
        }
        .butterfly-body {
            position: absolute;
            left: 11px;
            top: 2px;
            width: 2px;
            height: 16px;
            background: #333;
            border-radius: 2px;
            z-index: 2;
        }

        /* Dragonfly */
        .dragonfly {
            width: 30px;
            height: 30px;
            position: relative;
            transform-style: preserve-3d;
            transition: transform 0.5s ease;
        }
        .dragonfly-wing {
            position: absolute;
            width: 25px;
            height: 6px;
            background: rgba(255, 255, 255, 0.6);
            border: 1px solid rgba(16, 185, 129, 0.4);
            border-radius: 50%;
            transform-origin: right center;
        }
        .dragonfly-wing.right {
            left: 15px;
            transform-origin: left center;
        }
        .dragonfly-wing.top { top: 6px; }
        .dragonfly-wing.bottom { top: 14px; width: 20px; }
        .dragonfly-body {
            position: absolute;
            left: 14px;
            top: 0;
            width: 2px;
            height: 30px;
            background: #10b981;
            border-radius: 1px;
            z-index: 2;
        }

        /* Flapping animations */
        .flapping .butterfly-wing { animation: flap-left 0.15s ease-in-out alternate infinite; }
        .flapping .butterfly-wing.right { animation: flap-right 0.15s ease-in-out alternate infinite; }
        
        .flapping .dragonfly-wing { animation: flap-left-fast 0.05s linear alternate infinite; }
        .flapping .dragonfly-wing.right { animation: flap-right-fast 0.05s linear alternate infinite; }
        
        /* Resting animations (slow breathing) */
        .resting .butterfly-wing { animation: rest-left 3s ease-in-out alternate infinite; }
        .resting .butterfly-wing.right { animation: rest-right 3s ease-in-out alternate infinite; }

        @keyframes flap-left { from { transform: rotateY(0deg); } to { transform: rotateY(70deg); } }
        @keyframes flap-right { from { transform: rotateY(0deg); } to { transform: rotateY(-70deg); } }
        @keyframes flap-left-fast { from { transform: rotateY(0deg) rotateZ(-10deg); } to { transform: rotateY(45deg) rotateZ(-10deg); } }
        @keyframes flap-right-fast { from { transform: rotateY(0deg) rotateZ(10deg); } to { transform: rotateY(-45deg) rotateZ(10deg); } }
        
        @keyframes rest-left { from { transform: rotateY(20deg); } to { transform: rotateY(40deg); } }
        @keyframes rest-right { from { transform: rotateY(-20deg); } to { transform: rotateY(-40deg); } }
    `;
    document.head.appendChild(style);

    const container = document.createElement('div');
    container.className = 'bug-container';
    document.body.appendChild(container);

    const activeBugs = [];

    function createBug(type) {
        const wrapper = document.createElement('div');
        wrapper.className = 'bug-wrapper';
        
        const bug = document.createElement('div');
        bug.className = type + ' flapping';
        
        if (type === 'butterfly') {
            const body = document.createElement('div'); body.className = 'butterfly-body';
            const wingL = document.createElement('div'); wingL.className = 'butterfly-wing left';
            const wingR = document.createElement('div'); wingR.className = 'butterfly-wing right';
            const hue = Math.floor(Math.random() * 360);
            wingL.style.filter = `hue-rotate(${hue}deg)`;
            wingR.style.filter = `hue-rotate(${hue}deg)`;
            bug.appendChild(body); bug.appendChild(wingL); bug.appendChild(wingR);
        } else {
            const body = document.createElement('div'); body.className = 'dragonfly-body';
            const w1 = document.createElement('div'); w1.className = 'dragonfly-wing left top';
            const w2 = document.createElement('div'); w2.className = 'dragonfly-wing right top';
            const w3 = document.createElement('div'); w3.className = 'dragonfly-wing left bottom';
            const w4 = document.createElement('div'); w4.className = 'dragonfly-wing right bottom';
            bug.appendChild(body);
            bug.appendChild(w1); bug.appendChild(w2);
            bug.appendChild(w3); bug.appendChild(w4);
        }

        const scale = 0.4 + Math.random() * 0.5;
        bug.style.transform = `scale(${scale})`;
        wrapper.appendChild(bug);
        container.appendChild(wrapper);

        let x = Math.random() * window.innerWidth;
        let y = Math.random() * window.innerHeight;
        wrapper.style.transform = `translate(${x}px, ${y}px)`;
        
        const bugObj = {
            wrapper,
            bug,
            restTimeout: null,
            moveTimeout: null,
            isResting: false,
            wakeUp: function() {
                if (this.isResting) {
                    clearTimeout(this.restTimeout);
                    this.isResting = false;
                    this.bug.classList.remove('resting');
                    this.bug.classList.add('flapping');
                    this.moveBug();
                }
            },
            moveBug: function() {
                const willRest = Math.random() > 0.4;
                
                let targetX = Math.random() * window.innerWidth;
                let targetY = Math.random() * window.innerHeight;
                
                if (!willRest) {
                    targetX = (Math.random() - 0.5) * 2 * window.innerWidth + window.innerWidth/2;
                    targetY = (Math.random() - 0.5) * 2 * window.innerHeight + window.innerHeight/2;
                }
                
                const dx = targetX - x;
                const dy = targetY - y;
                const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
                
                this.bug.style.transform = `scale(${scale}) rotate(${angle}deg)`;
                
                const duration = willRest ? (2 + Math.random() * 3) : (3 + Math.random() * 5);
                this.wrapper.style.transition = `transform ${duration}s ${willRest ? 'ease-in-out' : 'linear'}`;
                this.wrapper.style.transform = `translate(${targetX}px, ${targetY}px)`;
                
                this.bug.classList.add('flapping');
                this.bug.classList.remove('resting');
                this.isResting = false;
                
                x = targetX;
                y = targetY;
                
                if (willRest) {
                    this.moveTimeout = setTimeout(() => {
                        this.bug.classList.remove('flapping');
                        this.bug.classList.add('resting');
                        this.isResting = true;
                        this.restTimeout = setTimeout(() => this.moveBug(), 4000 + Math.random() * 8000);
                    }, duration * 1000);
                } else {
                    this.moveTimeout = setTimeout(() => this.moveBug(), duration * 1000);
                }
            }
        };

        activeBugs.push(bugObj);
        setTimeout(() => bugObj.moveBug(), Math.random() * 3000);
    }

    for(let i=0; i<6; i++) createBug('butterfly');
    for(let i=0; i<4; i++) createBug('dragonfly');

    // Wake up bugs on interaction
    let wakeThrottle = false;
    const wakeBugs = () => {
        if (wakeThrottle) return;
        wakeThrottle = true;
        
        // Wake up 1 or 2 bugs randomly when disturbed
        const restingBugs = activeBugs.filter(b => b.isResting);
        if (restingBugs.length > 0) {
            // Wake up up to 2 bugs per interaction to look natural
            const numToWake = Math.min(restingBugs.length, Math.floor(Math.random() * 2) + 1);
            for(let i=0; i<numToWake; i++) {
                const randomBug = restingBugs[Math.floor(Math.random() * restingBugs.length)];
                randomBug.wakeUp();
            }
        }
        
        setTimeout(() => { wakeThrottle = false; }, 500);
    };

    window.addEventListener('scroll', wakeBugs);
    window.addEventListener('mousemove', wakeBugs);
}
if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBugs);
} else {
    initBugs();
}
