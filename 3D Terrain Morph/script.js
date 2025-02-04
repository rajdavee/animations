let scene, camera, renderer, controls;
let terrain, terrainMaterial;
let clock = new THREE.Clock();

init();
animate();

function init() {
    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 10);

    // Renderer
    renderer = new THREE.WebGLRenderer({ 
        canvas: document.getElementById('terrainCanvas'),
        antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Create terrain
    createTerrain();

    // Events
    window.addEventListener('resize', onWindowResize);
    document.getElementById('morphTerrain').addEventListener('click', morphTerrain);
    document.getElementById('resetTerrain').addEventListener('click', resetTerrain);
}

function createTerrain() {
    const geometry = new THREE.PlaneGeometry(20, 20, 150, 150);
    
    terrainMaterial = new THREE.ShaderMaterial({
        vertexShader: terrainVertexShader,
        fragmentShader: terrainFragmentShader,
        uniforms: {
            uTime: { value: 0 },
            uMorphFactor: { value: 0 }
        },
        wireframe: true
    });

    terrain = new THREE.Mesh(geometry, terrainMaterial);
    terrain.rotation.x = -Math.PI * 0.5;
    scene.add(terrain);
}

function morphTerrain() {
    gsap.to(terrainMaterial.uniforms.uMorphFactor, {
        value: 1,
        duration: 2,
        ease: "power2.inOut"
    });
}

function resetTerrain() {
    gsap.to(terrainMaterial.uniforms.uMorphFactor, {
        value: 0,
        duration: 2,
        ease: "power2.inOut"
    });
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    
    terrainMaterial.uniforms.uTime.value = clock.getElapsedTime();
    
    controls.update();
    renderer.render(scene, camera);
}
