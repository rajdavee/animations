let scene, camera, renderer, controls;
let model, lights;
let isRevealed = false;

init();
animate();

function init() {
    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(5, 5, 5);

    // Renderer
    renderer = new THREE.WebGLRenderer({ 
        canvas: document.getElementById('modelCanvas'),
        antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    // Controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Lighting
    setupLights();
    
    // Create model (demo cube with segments)
    createModel();

    // Events
    window.addEventListener('resize', onWindowResize);
    document.getElementById('reveal').addEventListener('click', revealModel);
    document.getElementById('reset').addEventListener('click', resetModel);

    // Hide loading message
    document.querySelector('.loading').style.display = 'none';
}

function setupLights() {
    lights = {
        ambient: new THREE.AmbientLight(0x404040, 0.5),
        main: new THREE.DirectionalLight(0xffffff, 0.8),
        spot1: new THREE.SpotLight(0xff0000, 0.5),
        spot2: new THREE.SpotLight(0x0000ff, 0.5)
    };

    lights.main.position.set(5, 5, 5);
    lights.spot1.position.set(-5, 5, 0);
    lights.spot2.position.set(5, -5, 0);

    Object.values(lights).forEach(light => scene.add(light));
}

function createModel() {
    const geometry = new THREE.BoxGeometry(2, 2, 2, 2, 2, 2);
    const material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.5
    });

    model = new THREE.Mesh(geometry, material);
    scene.add(model);

    // Initial state
    model.scale.set(0.1, 0.1, 0.1);
    model.rotation.set(0, 0, 0);
}

function revealModel() {
    if (isRevealed) return;
    isRevealed = true;

    // Camera animation
    gsap.to(camera.position, {
        x: 3,
        y: 4,
        z: 5,
        duration: 2,
        ease: "power2.inOut"
    });

    // Model animation
    gsap.to(model.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 1.5,
        ease: "elastic.out(1, 0.5)"
    });

    gsap.to(model.rotation, {
        y: Math.PI * 2,
        duration: 2,
        ease: "power2.inOut"
    });

    // Material animation
    gsap.to(model.material, {
        opacity: 1,
        duration: 1,
        wireframe: false
    });

    // Lighting animation
    gsap.to(lights.ambient, {
        intensity: 1,
        duration: 1
    });
}

function resetModel() {
    if (!isRevealed) return;
    isRevealed = false;

    gsap.to(camera.position, {
        x: 5,
        y: 5,
        z: 5,
        duration: 1.5
    });

    gsap.to(model.scale, {
        x: 0.1,
        y: 0.1,
        z: 0.1,
        duration: 1
    });

    gsap.to(model.rotation, {
        x: 0,
        y: 0,
        z: 0,
        duration: 1
    });

    gsap.to(model.material, {
        opacity: 0.5,
        duration: 1,
        wireframe: true
    });

    gsap.to(lights.ambient, {
        intensity: 0.5,
        duration: 1
    });
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
