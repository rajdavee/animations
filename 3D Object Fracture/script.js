let scene, camera, renderer, controls;
let model, lights;
let isRevealed = false;
let isFractured = false;
let world, fragments = [], physicsBodies = [];
const timeStep = 1/60;

init();
animate();

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(5, 5, 5);

    renderer = new THREE.WebGLRenderer({ 
        canvas: document.getElementById('modelCanvas'),
        antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);
    world.broadphase = new CANNON.NaiveBroadphase();

    setupLights();
    createModel();

    window.addEventListener('resize', onWindowResize);
    document.getElementById('reveal').addEventListener('click', revealModel);
    document.getElementById('fracture').addEventListener('click', fractureObject);
    document.getElementById('reset').addEventListener('click', resetModel);

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

    model.scale.set(0.1, 0.1, 0.1);
    model.rotation.set(0, 0, 0);
}

function revealModel() {
    if (isRevealed) return;
    isRevealed = true;

    gsap.to(camera.position, {
        x: 3,
        y: 4,
        z: 5,
        duration: 2,
        ease: "power2.inOut"
    });

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

    gsap.to(model.material, {
        opacity: 1,
        duration: 1,
        wireframe: false
    });

    gsap.to(lights.ambient, {
        intensity: 1,
        duration: 1
    });
}

function createFragments() {
    const fragments = [];
    const originalSize = 2; // Size of original cube
    const fragmentCount = 27; // 3x3x3 subdivision
    const size = originalSize / 3; // Size of each fragment

    // Create fragments in a 3x3x3 grid
    for(let x = 0; x < 3; x++) {
        for(let y = 0; y < 3; y++) {
            for(let z = 0; z < 3; z++) {
                const points = [];
                const offset = new THREE.Vector3(
                    (x - 1) * size,
                    (y - 1) * size,
                    (z - 1) * size
                );

                // Generate points for convex hull
                for(let i = 0; i < 12; i++) {
                    points.push(new THREE.Vector3(
                        Math.random() * size * 0.8 + offset.x,
                        Math.random() * size * 0.8 + offset.y,
                        Math.random() * size * 0.8 + offset.z
                    ));
                }

                // Create fragment geometry
                const geometry = new THREE.ConvexGeometry(points);
                const material = new THREE.MeshPhongMaterial({
                    color: new THREE.Color(
                        0.8 + Math.random() * 0.2,
                        0.8 + Math.random() * 0.2,
                        0.8 + Math.random() * 0.2
                    ),
                    flatShading: true
                });

                const fragment = new THREE.Mesh(geometry, material);
                fragment.position.copy(offset);

                // Create physics body
                const shape = new CANNON.Box(new CANNON.Vec3(size * 0.4, size * 0.4, size * 0.4));
                const body = new CANNON.Body({ 
                    mass: 1,
                    linearDamping: 0.1,
                    angularDamping: 0.1
                });
                body.addShape(shape);
                body.position.copy(offset);
                
                fragments.push({ mesh: fragment, body: body });
            }
        }
    }
    
    return fragments;
}

function fractureObject() {
    if(isFractured || !isRevealed) return;
    isFractured = true;

    scene.remove(model);

    // Update world physics parameters
    world.gravity.set(0, -20, 0); // Stronger gravity
    world.defaultContactMaterial.friction = 0.3;
    world.defaultContactMaterial.restitution = 0.2;

    fragments = createFragments();
    fragments.forEach(fragment => {
        scene.add(fragment.mesh);
        world.addBody(fragment.body);
        
        // Calculate explosion direction from center
        const direction = fragment.body.position.clone();
        const distance = direction.length();
        direction.normalize();
        
        // Apply explosion force
        const force = new CANNON.Vec3(
            direction.x * (2000 + Math.random() * 1000),
            direction.y * (2000 + Math.random() * 1000) + 1000, // Extra upward force
            direction.z * (2000 + Math.random() * 1000)
        );
        
        // Add random rotation
        const torque = new CANNON.Vec3(
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 100
        );
        
        fragment.body.applyForce(force, fragment.body.position);
        fragment.body.applyTorque(torque);

        // Add rotation animation
        gsap.to(fragment.mesh.rotation, {
            x: Math.random() * Math.PI * 8,
            y: Math.random() * Math.PI * 8,
            z: Math.random() * Math.PI * 8,
            duration: 2.5,
            ease: "power1.out"
        });
    });
}

function resetModel() {
    if(!isRevealed) return;
    
    fragments.forEach(fragment => {
        scene.remove(fragment.mesh);
        world.remove(fragment.body);
    });
    fragments = [];
    
    isFractured = false;
    isRevealed = false;
    createModel();
    
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
    
    world.step(timeStep);
    
    fragments.forEach(fragment => {
        fragment.mesh.position.copy(fragment.body.position);
        fragment.mesh.quaternion.copy(fragment.body.quaternion);
    });
    
    controls.update();
    renderer.render(scene, camera);
}
