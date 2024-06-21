import * as THREE from '//unpkg.com/three/build/three.module.js';

export class GlobeVisualizer {
    constructor(containerId) {
        this.containerId = containerId;
        this.arcsData = [];
        this.gData = [];
        this.particles = [];
        this.maxParticles = 10;
        this.texture = null;
        this.world = null;
        this.particleCanvas = document.createElement('canvas');
        this.ctx = this.particleCanvas.getContext('2d');
        this.img = new Image();
        this.resetViewTimeout = null;

        this.particleCanvas.width = 500;
        this.particleCanvas.height = 500;

        this.initialize();
    }

    initialize() {
        this.generateData();
        this.createHeartParticleCanvas();
        this.createWorld();
        this.loadLandData();
        this.addResetViewListener();
    }

    getRandomLocation(region) {
        let lat, lng;
        if (region === 'US') {
            lat = (Math.random() * (49 - 25) + 25);
            lng = -(Math.random() * (125 - 67) + 67);
        } else if (region === 'Europe') {
            lat = (Math.random() * (71 - 35) + 35);
            lng = (Math.random() * (40 - -10) + -10);
        }
        return { lat, lng };
    }

    generateData() {
        const targets = [
            { lat: 9.082, lng: 8.6753 },
            { lat: 7.9465, lng: -1.0232 },
            { lat: -1.2921, lng: 36.8219 },
            { lat: 3.848, lng: 11.5021 }
        ];

        for (let i = 0; i < 5; i++) {
            const region = Math.random() > 0.5 ? 'US' : 'Europe';
            const start = this.getRandomLocation(region);
            const end = targets[Math.floor(Math.random() * targets.length)];
            const duration = Math.random() * 3000 + 2000;

            this.arcsData.push({
                startLat: start.lat,
                startLng: start.lng,
                endLat: end.lat,
                endLng: end.lng,
                duration: duration,
                color: ['#00A2DC', '#FFF']
            });

            this.gData.push({
                lat: end.lat,
                lng: end.lng,
                alt: 0.05,
                shape: 'heart',
                color: 'blue',
                duration: duration
            });
        }
    }

    createHeartParticleCanvas() {
        const svgData = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="50" height="50">
              <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" fill="red"/>
            </svg>
        `;
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        this.img.src = url;

        this.img.onload = () => {
            this.animateParticles();
        };
    }

    createParticle(x, y, baseAngle, spread, oscillate) {
        const angle = baseAngle + (Math.random() - 0.5) * spread;
        const speed = Math.random() * 10;
        const radians = angle * (Math.PI / 180);
        const speedX = Math.cos(radians) * speed;
        const speedY = Math.sin(radians) * speed;
        const oscillationFactor = Math.random() * 0.1 + 0.05;

        return {
            x: x,
            y: y,
            size: Math.random() * 30 + 10,
            speedX: speedX,
            speedY: speedY,
            opacity: Math.random(),
            angle: angle,
            oscillate: oscillate,
            time: 0,
            oscillationFactor: oscillationFactor,
            update: function () {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.oscillate) {
                    this.time += 0.1;
                    this.x += Math.sin(this.time) * this.oscillationFactor * 10;
                }
                if (this.size > 0.2) this.size -= 0.1;
            },
            draw: function () {
                this.ctx.globalAlpha = this.opacity;
                this.ctx.drawImage(this.img, this.x, this.y, this.size, this.size);
                this.ctx.globalAlpha = 1;
            }
        };
    }

    resetParticles() {
        this.particles.length = 0;
        const baseAngle = 270;
        const spread = 45;
        const oscillate = true;
        const centerX = this.particleCanvas.width / 2;
        const centerY = this.particleCanvas.height / 2;

        for (let i = 0; i < this.maxParticles; i++) {
            this.particles.push(this.createParticle(centerX, centerY, baseAngle, spread, oscillate));
        }
    }

    handleParticles() {
        this.ctx.clearRect(0, 0, this.particleCanvas.width, this.particleCanvas.height);
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].update();
            this.particles[i].draw();
            if (this.particles[i].size <= 0.3) {
                this.particles.splice(i, 1);
                i--;
            }
        }
    }

    animateParticles() {
        this.handleParticles();
        this.texture.needsUpdate = true;
        requestAnimationFrame(this.animateParticles.bind(this));
    }

    createHeartParticles() {
        const material = new THREE.SpriteMaterial({ map: this.texture, transparent: true });
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(40, 40, 1);
        return sprite;
    }

    createWorld() {
        this.texture = new THREE.CanvasTexture(this.particleCanvas);

        this.world = Globe()
            .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
            (document.getElementById(this.containerId))
            .pointOfView({ lat: -8, lng: 10, altitude: 2 })
            .backgroundColor('#023C8B00')
            .showGlobe(false)
            .showAtmosphere(true)
            .arcsData(this.arcsData)
            .arcColor('color')
            .arcStroke(0.3)
            .arcDashLength(1)
            .arcDashGap(1)
            .arcDashAnimateTime(d => d.duration)
            .customLayerData(this.gData)
            .customThreeObject(d => {
                if (d.shape === 'heart') {
                    const sprite = this.createHeartParticles();
                    d.sprite = sprite;
                    return sprite;
                }
                return new THREE.Mesh(
                    new THREE.SphereGeometry(d.radius),
                    new THREE.MeshLambertMaterial({ color: d.color })
                );
            })
            .customThreeObjectUpdate((obj, d) => {
                Object.assign(obj.position, this.world.getCoords(d.lat, d.lng, d.alt));
            });

        this.world.controls().enableZoom = false;
        this.startParticleAnimationAtDestination();
    }

    startParticleAnimationAtDestination() {
        this.gData.forEach(data => {
            const duration = data.duration;
            setInterval(() => {
                this.resetParticles();
            }, duration);
        });
    }

    loadLandData() {
        fetch('//unpkg.com/world-atlas/land-110m.json').then(res => res.json())
            .then(landTopo => {
                this.world
                    .polygonsData(topojson.feature(landTopo, landTopo.objects.land).features)
                    .polygonCapMaterial(new THREE.MeshLambertMaterial({ color: '#0662B9', side: THREE.DoubleSide }))
                    .polygonSideColor(() => '#023C8B');
            });
    }

    addResetViewListener() {
        this.world.controls().addEventListener('change', () => {
            if (this.resetViewTimeout) {
                clearTimeout(this.resetViewTimeout);
            }
            this.resetViewTimeout = setTimeout(() => {
                this.world.pointOfView({ lat: -8, lng: 10 }, 1000);
            }, 200);
        });
    }
}