import { AlwaysStencilFunc, AmbientLight, AxesHelper, BackSide, Color, DecrementWrapStencilOp, DirectionalLight, ExtrudeBufferGeometry, FrontSide, IncrementWrapStencilOp, KeepStencilOp, Mesh, MeshBasicMaterial, NotEqualStencilFunc, PerspectiveCamera, Scene, Shape, Vector2, WebGLRenderer } from 'three'
import { MapControls } from 'three/examples/jsm/controls/OrbitControls'
import { terrain } from './terrain'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { ClearPass } from 'three/examples/jsm/postprocessing/ClearPass';
import { MaskPass, ClearMaskPass } from 'three/examples/jsm/postprocessing/MaskPass';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader';
import { TexturePass } from 'three/examples/jsm/postprocessing/TexturePass';
import * as THREE from 'three';

// #region three-js-setup
const scene = new Scene()
const renderer = new WebGLRenderer()
const dom: HTMLElement = document.querySelector('#container')!
dom.appendChild(renderer.domElement)
const ambientLight = new AmbientLight(0x333333)
const directionalLight = new DirectionalLight(0xffffff)
directionalLight.position.set(1, 2, 3)
directionalLight.target.position.set(0, 0, 0)
const width = dom.clientWidth
const height = dom.clientHeight
renderer.setSize(width, height)
renderer.setPixelRatio(window.devicePixelRatio)
const camera = new PerspectiveCamera(45, width / height, 1, 10000)
camera.position.set(5500, 3000, 5)
camera.lookAt(0, 0, 0)
const controls = new MapControls(camera, renderer.domElement)

// #endregion


const scene1 = new THREE.Scene();
scene1.add(ambientLight, directionalLight,)
const scene2 = new THREE.Scene();
let box, torus, composer;
box = new THREE.Mesh(new THREE.BoxGeometry(4, 4, 4));
scene1.add(terrain);

box = new THREE.Mesh(new THREE.BoxGeometry(800, 800, 800));
box.position.y += 300;
scene2.add(box);


const clearPass = new ClearPass();

const clearMaskPass = new ClearMaskPass();

const maskPass1 = new MaskPass(scene1, camera);
const maskPass2 = new MaskPass(scene2, camera);

const texture1 = new THREE.TextureLoader().load('img/pic2.jpeg')
texture1.minFilter = THREE.LinearFilter;
const texture2 = new THREE.TextureLoader().load('img/pic1.jpeg');

const texturePass1 = new TexturePass(texture1);
const texturePass2 = new TexturePass(texture2);

const outputPass = new ShaderPass(CopyShader);

const parameters = {
    stencilBuffer: true
};

const renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, parameters);

composer = new EffectComposer(renderer, renderTarget);
composer.addPass(clearPass);
composer.addPass(maskPass1);
composer.addPass(texturePass1);
composer.addPass(clearMaskPass);
composer.addPass(maskPass2);
composer.addPass(texturePass2);
composer.addPass(clearMaskPass);
composer.addPass(outputPass);


function animate(deltaTime: number) {
    requestAnimationFrame(animate)
    renderer.setClearColor(0xffffff);
    composer.render();
    controls.update()
}
requestAnimationFrame(animate)

export { scene, camera, controls, renderer }
