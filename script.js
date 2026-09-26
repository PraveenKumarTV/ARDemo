import * as THREE from "three";

import { OrbitControls }
    from "three/addons/controls/OrbitControls.js";

import { ARButton }
    from "three/addons/webxr/ARButton.js";


// ------------------------------------
// BASIC THREE.JS SETUP
// ------------------------------------

const container =
    document.getElementById("canvas-container");

const status =
    document.getElementById("status");

const startAR =
    document.getElementById("startAR");


const scene = new THREE.Scene();


// Camera

const camera = new THREE.PerspectiveCamera(
    60,
    container.clientWidth / container.clientHeight,
    0.01,
    100
);

camera.position.set(10, 7, 12);


// Renderer

const renderer =
    new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });

renderer.setSize(
    container.clientWidth,
    container.clientHeight
);

renderer.setPixelRatio(
    window.devicePixelRatio
);

renderer.xr.enabled = true;

container.appendChild(renderer.domElement);


// ------------------------------------
// LIGHTING
// ------------------------------------

const ambientLight =
    new THREE.HemisphereLight(
        0xffffff,
        0x444444,
        2
    );

scene.add(ambientLight);


const directionalLight =
    new THREE.DirectionalLight(
        0xffffff,
        2
    );

directionalLight.position.set(
    10,
    20,
    10
);

scene.add(directionalLight);


// ------------------------------------
// GROUND
// ------------------------------------

const groundGeometry =
    new THREE.BoxGeometry(
        30,
        0.2,
        25
    );

const groundMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x78909c
    });

const ground =
    new THREE.Mesh(
        groundGeometry,
        groundMaterial
    );

ground.position.y = -0.1;

scene.add(ground);


// ------------------------------------
// BUILDING GROUP
// ------------------------------------

const college =
    new THREE.Group();


// ------------------------------------
// BUILDING MATERIALS
// ------------------------------------

const wallMaterial =
    new THREE.MeshStandardMaterial({
        color: 0xe8e8e8
    });

const roofMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x37474f
    });

const windowMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x1565c0,
        metalness: 0.2,
        roughness: 0.2
    });

const doorMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x5d4037
    });

const grassMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x4caf50
    });


// ------------------------------------
// HELPER FUNCTION
// ------------------------------------

function createBox(
    width,
    height,
    depth,
    material,
    x,
    y,
    z
) {

    const geometry =
        new THREE.BoxGeometry(
            width,
            height,
            depth
        );

    const mesh =
        new THREE.Mesh(
            geometry,
            material
        );

    mesh.position.set(
        x,
        y,
        z
    );

    college.add(mesh);

    return mesh;
}


// ------------------------------------
// MAIN BUILDING
// ------------------------------------

createBox(
    10,
    6,
    5,
    wallMaterial,
    0,
    3,
    0
);


// ------------------------------------
// SECOND FLOOR
// ------------------------------------

createBox(
    10,
    3,
    5,
    wallMaterial,
    0,
    7.5,
    0
);


// ------------------------------------
// ROOF
// ------------------------------------

createBox(
    10.5,
    0.5,
    5.5,
    roofMaterial,
    0,
    9.25,
    0
);


// ------------------------------------
// ENTRANCE
// ------------------------------------

createBox(
    2,
    3,
    0.4,
    doorMaterial,
    0,
    1.5,
    -2.7
);


// ------------------------------------
// WINDOWS
// ------------------------------------

function createWindow(x, y, z) {

    createBox(
        1.2,
        1.2,
        0.25,
        windowMaterial,
        x,
        y,
        z
    );
}


// Front windows

createWindow(-3, 2, -2.7);
createWindow(-1.5, 2, -2.7);
createWindow(1.5, 2, -2.7);
createWindow(3, 2, -2.7);

createWindow(-3, 6.5, -2.7);
createWindow(-1.5, 6.5, -2.7);
createWindow(1.5, 6.5, -2.7);
createWindow(3, 6.5, -2.7);


// ------------------------------------
// COLLEGE SIGN
// ------------------------------------

const canvas =
    document.createElement("canvas");

canvas.width = 1024;
canvas.height = 256;

const context =
    canvas.getContext("2d");

context.fillStyle = "#0645ad";

context.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
);

context.fillStyle = "white";

context.font =
    "bold 90px Arial";

context.textAlign = "center";

context.fillText(
    "COLLEGE CAMPUS",
    512,
    160
);


const texture =
    new THREE.CanvasTexture(canvas);

const signMaterial =
    new THREE.MeshBasicMaterial({
        map: texture
    });

const signGeometry =
    new THREE.BoxGeometry(
        6,
        1.5,
        0.1
    );

const sign =
    new THREE.Mesh(
        signGeometry,
        signMaterial
    );

sign.position.set(
    0,
    4.5,
    -2.75
);

college.add(sign);


// ------------------------------------
// FRONT GRASS
// ------------------------------------

createBox(
    8,
    0.1,
    4,
    grassMaterial,
    0,
    0.05,
    -5
);


// ------------------------------------
// WALKWAY
// ------------------------------------

const walkwayMaterial =
    new THREE.MeshStandardMaterial({
        color: 0xbdbdbd
    });

createBox(
    3,
    0.12,
    6,
    walkwayMaterial,
    0,
    0.08,
    -4
);


// ------------------------------------
// ADD BUILDING TO SCENE
// ------------------------------------

scene.add(college);


// ------------------------------------
// ROTATION / ZOOM CONTROLS
// ------------------------------------

const controls =
    new OrbitControls(
        camera,
        renderer.domElement
    );

controls.enableDamping = true;

controls.target.set(
    0,
    4,
    0
);


// ------------------------------------
// AR SUPPORT
// ------------------------------------

startAR.addEventListener(
    "click",
    () => {

        if (!navigator.xr) {

            status.textContent =
                "WebXR AR is not supported on this device/browser.";

            return;
        }

        status.textContent =
            "Starting AR...";

        const arButton =
            ARButton.createButton(
                renderer,
                {
                    requiredFeatures: [
                        "hit-test"
                    ]
                }
            );

        arButton.click();

    }
);


// ------------------------------------
// RESIZE
// ------------------------------------

window.addEventListener(
    "resize",
    () => {

        camera.aspect =
            container.clientWidth /
            container.clientHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            container.clientWidth,
            container.clientHeight
        );

    }
);


// ------------------------------------
// ANIMATION
// ------------------------------------

function animate() {

    controls.update();

    renderer.render(
        scene,
        camera
    );
}

renderer.setAnimationLoop(
    animate
);


status.textContent =
    "3D campus model ready.";