// src/components/ThreeScene.jsx
import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeScene({
  className = "w-full h-72 md:h-[60vh] rounded-2xl",
}) {
  const mountRef = useRef(null);
  const rafRef = useRef(null);
  const animatingRef = useRef(false);
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Helper to get mount size
    const getSize = () => {
      const rect = mount.getBoundingClientRect();
      return {
        width: Math.max(1, rect.width),
        height: Math.max(1, rect.height),
      };
    };

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.outputEncoding = THREE.sRGBEncoding;
    mount.appendChild(renderer.domElement);

    // Scene + camera (will adjust camera after geometry center)
    const scene = new THREE.Scene();

    const { width, height } = getSize();
    const DPR =
      typeof window !== "undefined" && window.devicePixelRatio
        ? Math.min(window.devicePixelRatio, 2)
        : 1;
    renderer.setPixelRatio(DPR);
    renderer.setSize(width, height, false);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0.9, 4);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.25);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xbfe9ff, 1.0);
    dirLight.position.set(4, 6, 2);
    scene.add(dirLight);

    const point1 = new THREE.PointLight(0x6df0ff, 0.9, 12);
    point1.position.set(3, 2, 2.5);
    scene.add(point1);

    const point2 = new THREE.PointLight(0xb36bff, 0.7, 12);
    point2.position.set(-2.8, -1.8, 2.6);
    scene.add(point2);

    // Geometry - create and center it
    const isMobile = window.matchMedia("(max-width:400px)").matches;
    const geom = new THREE.IcosahedronGeometry(0.5, isMobile ? 0 : 1);

    // IMPORTANT: compute bounding sphere & center geometry so it's truly centered at origin
    geom.computeBoundingSphere();
    if (geom.boundingSphere) {
      const bs = geom.boundingSphere;
      // center the geometry so mesh is around origin
      geom.center();
      // recompute bounding sphere after centering
      geom.computeBoundingSphere();
    }

    const mat = new THREE.MeshStandardMaterial({
      color: 0x2d3bff,
      metalness: 0.45,
      roughness: 0.18,
      emissive: 0x112244,
      emissiveIntensity: 0.15,
    });

    const mesh = new THREE.Mesh(geom, mat);
    mesh.castShadow = false;
    mesh.scale.setScalar(.8)
    mesh.position.set(0, 0, 0); // ensure at origin
    scene.add(mesh);

    // wireframe overlay
    const wire = new THREE.LineSegments(
      new THREE.EdgesGeometry(geom),
      new THREE.LineBasicMaterial({
        color: 0xffffff,
        opacity: 0.12,
        transparent: true,
      })
    );
    mesh.add(wire);

    // After centering, get boundingSphere radius for camera fit & shadow placement
    const boundingRadius =
      geom.boundingSphere && geom.boundingSphere.radius
        ? geom.boundingSphere.radius
        : 1.0;

    // Adjust camera distance to 'fit' the model nicely (factor tweakable)
    const fitOffset = 2.6; // increase to zoom out, decrease to zoom in
    const cameraZ = boundingRadius * fitOffset;
    camera.position.set(0, boundingRadius * 0.5, cameraZ);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // Soft contact shadow (canvas texture) placed under origin, scale by boundingRadius
    const shadowSize = 512;
    const sc = document.createElement("canvas");
    sc.width = shadowSize;
    sc.height = shadowSize;
    const sctx = sc.getContext("2d");
    const cx = shadowSize / 2;
    const cy = shadowSize / 2;
    const grd = sctx.createRadialGradient(cx, cy, 0, cx, cy, shadowSize * 0.5);
    grd.addColorStop(0, "rgba(0,0,0,0.9)");
    grd.addColorStop(0.4, "rgba(0,0,0,0.35)");
    grd.addColorStop(1, "rgba(0,0,0,0)");
    sctx.fillStyle = grd;
    sctx.fillRect(0, 0, shadowSize, shadowSize);

    const shadowTex = new THREE.CanvasTexture(sc);
    shadowTex.needsUpdate = true;
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(boundingRadius * 2.6, boundingRadius * 2.6),
      shadowMat
    );
    shadowMesh.rotation.x = -Math.PI / 2;
    // position it a bit below origin according to radius
    shadowMesh.position.y = -boundingRadius * 0.98;
    scene.add(shadowMesh);

    // initial pose & small visual offset
    mesh.rotation.set(0.5, 0.4, 0);
    mesh.position.y = 0; // centered

    // render once to ensure visible
    const renderOnce = () => renderer.render(scene, camera);
    renderOnce();

    // Interaction: drag to rotate around origin
    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    const startDrag = (x, y) => {
      dragging = true;
      lastX = x;
      lastY = y;
    };

    const moveDrag = (x, y) => {
      if (!dragging) return;
      const dx = (x - lastX) * 0.01;
      const dy = (y - lastY) * 0.01;
      // rotate around Y and X but keep center fixed
      mesh.rotation.y += dx;
      mesh.rotation.x += dy;
      lastX = x;
      lastY = y;

      // update shadow slightly based on mesh vertical position
      const height = mesh.position.y + boundingRadius;
      const shadowScale = THREE.MathUtils.lerp(
        1.05,
        0.6,
        Math.min(Math.max((height - 0.0) / (boundingRadius * 0.8), 0), 1)
      );
      const shadowOpacity = THREE.MathUtils.lerp(
        0.75,
        0.28,
        Math.min(Math.max((height - 0.0) / (boundingRadius * 0.8), 0), 1)
      );
      shadowMesh.scale.setScalar(shadowScale);
      shadowMat.opacity = shadowOpacity;

      renderOnce();
    };

    const endDrag = () => {
      dragging = false;
    };

    const onPointerDown = (e) => {
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      const y = e.touches ? e.touches[0].clientY : e.clientY;
      startDrag(x, y);
    };

    const onPointerMove = (e) => {
      if (e.touches) {
        moveDrag(e.touches[0].clientX, e.touches[0].clientY);
      } else {
        moveDrag(e.clientX, e.clientY);
      }
    };

    const onPointerUp = () => endDrag();

    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("touchstart", onPointerDown, {
      passive: true,
    });
    renderer.domElement.addEventListener("touchmove", onPointerMove, {
      passive: true,
    });
    renderer.domElement.addEventListener("touchend", onPointerUp, {
      passive: true,
    });

    // Burst animation on tap (short)
    let lastTap = 0;
    const clock = new THREE.Clock();
    const animateLoop = () => {
      const t = clock.getElapsedTime();
      mesh.rotation.y += 0.007;
      mesh.rotation.x = 0.5 + Math.sin(t * 0.6) * 0.12;
      mesh.position.y = Math.sin(t * 0.6) * 0.08;

      // shadow adapt
      const height = mesh.position.y + boundingRadius;
      const shadowScale = THREE.MathUtils.lerp(
        1.05,
        0.6,
        Math.min(Math.max((height - 0.0) / (boundingRadius * 0.8), 0), 1)
      );
      const shadowOpacity = THREE.MathUtils.lerp(
        0.75,
        0.28,
        Math.min(Math.max((height - 0.0) / (boundingRadius * 0.8), 0), 1)
      );
      shadowMesh.scale.setScalar(shadowScale);
      shadowMat.opacity = shadowOpacity;

      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(animateLoop);
    };

    const startAnimation = () => {
      if (animatingRef.current) return;
      animatingRef.current = true;
      clock.start();
      rafRef.current = requestAnimationFrame(animateLoop);
    };
    const stopAnimation = () => {
      if (!animatingRef.current) return;
      animatingRef.current = false;
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      clock.stop && clock.stop();
      renderOnce();
    };

    const onTap = () => {
      const now = Date.now();
      if (now - lastTap < 300) return;
      lastTap = now;
      startAnimation();
      setTimeout(() => stopAnimation(), 1800);
    };
    renderer.domElement.addEventListener("click", onTap);
    renderer.domElement.addEventListener("touchend", onTap);

    // ResizeObserver - keep canvas sized & re-fit camera if needed
    const ro = new ResizeObserver(() => {
      const { width: w, height: h } = getSize();
      const DPR2 = Math.min(window.devicePixelRatio || 1, 2);
      renderer.setPixelRatio(DPR2);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderOnce();
    });
    ro.observe(mount);

    // ensure visible
    renderOnce();

    // cleanup
    return () => {
      ro.disconnect();
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("touchstart", onPointerDown);
      renderer.domElement.removeEventListener("touchmove", onPointerMove);
      renderer.domElement.removeEventListener("touchend", onPointerUp);
      renderer.domElement.removeEventListener("click", onTap);
      renderer.domElement.removeEventListener("touchend", onTap);
      cancelAnimationFrame(rafRef.current);
      if (renderer.domElement && mount.contains(renderer.domElement))
        mount.removeChild(renderer.domElement);

      // dispose resources
      geom.dispose && geom.dispose();
      mat.dispose && mat.dispose();
      shadowTex.dispose && shadowTex.dispose();
      shadowMat.dispose && shadowMat.dispose();
      renderer.dispose && renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className={className} />;
}
ThreeScene.propTypes = {
  className: PropTypes.string,
};
