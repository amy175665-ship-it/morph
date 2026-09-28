import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import liquidBlob from '../../assets/images/optimized/cursor/liquid-blob.webp';
import liquidSphere from '../../assets/images/optimized/cursor/liquid-sphere.webp';
import liquidDroplet from '../../assets/images/optimized/cursor/liquid-droplet.webp';
import './Cursor.scss';

export default function Cursor() {
  const cursorRef = useRef(null);
  const blobRef = useRef(null);
  const sphereRef = useRef(null);
  const ringRef = useRef(null);
  const particlesRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const blob = blobRef.current;
    const sphere = sphereRef.current;
    const ring = ringRef.current;
    const particleLayer = particlesRef.current;
    const media = gsap.matchMedia();

    media.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      // 커서를 사용하는 환경에서만 이미지 요청을 시작합니다.
      blob.src = liquidBlob;
      sphere.src = liquidSphere;
      const root = document.documentElement;
      const dropletAsset = new Image();
      dropletAsset.src = liquidDroplet;
      let previous = null;
      let position = null;
      let visible = false;
      let hovered = false;
      let viewLink = false;
      let pressed = false;
      let dragging = false;
      let pressPosition = null;
      let scrolling = false;
      let lastScrollY = window.scrollY;
      let scrollAngle = 90;
      let stretch = 0;
      let rotation = 0;
      let state = '';
      let morph = null;
      const particles = new Map();
      const moveX = gsap.quickTo(cursor, 'x', { duration: 0.12, ease: 'power3.out' });
      const moveY = gsap.quickTo(cursor, 'y', { duration: 0.12, ease: 'power3.out' });
      const rotate = gsap.quickTo(blob, 'rotation', { duration: 0.18, ease: 'power2.out' });
      const scaleX = gsap.quickTo(blob, 'scaleX', { duration: 0.22, ease: 'power2.out' });
      const scaleY = gsap.quickTo(blob, 'scaleY', { duration: 0.22, ease: 'power2.out' });

      function turnTo(angle) {
        rotation += ((angle - rotation + 180) % 360 + 360) % 360 - 180;
        rotate(rotation);
      }

      // One priority order keeps hover, scrolling and dragging from fighting.
      function updateState() {
        let next = 'DEFAULT';
        if (pressed) next = dragging ? 'DRAG' : 'CLICK';
        else if (viewLink) next = 'LINK';
        else if (hovered) next = 'HOVER';
        else if (scrolling) next = 'SCROLL';
        else if (stretch > 0) next = 'MOVE';

        if (next !== state) {
          state = next;
          cursor.dataset.state = state;
          const useSphere = state === 'LINK' || state === 'HOVER';
          morph?.kill();
          morph = gsap.timeline({ defaults: { duration: 0.18, ease: 'power2.out', overwrite: 'auto' } });
          // Opacity is animated on the blob wrapper, deformation on its image.
          morph.to(blob.parentElement, { opacity: useSphere ? 0 : 1, scale: useSphere ? 0.8 : 1 }, 0)
            .to(sphere, { opacity: useSphere ? 1 : 0, scale: useSphere ? 1.35 : 0.7 }, 0)
            .to(ring, { opacity: state === 'LINK' ? 1 : 0, scale: state === 'LINK' ? 1 : 0.75 }, 0);
        }

        if (state === 'SCROLL') {
          turnTo(scrollAngle);
          scaleX(1.5);
          scaleY(0.5);
        } else {
          const compression = state === 'CLICK' ? 0.85 : 1;
          const strength = state === 'DRAG' ? 1.6 : 1;
          const flattening = state === 'DRAG' ? 0.5 : 0.4;
          scaleX((1 + stretch * strength) * compression);
          scaleY((1 - stretch * flattening) * compression);
        }
      }

      const relax = gsap.delayedCall(0.09, () => {
        stretch = 0;
        updateState();
      }).pause();

      function readTarget(target) {
        hovered = Boolean(target?.closest('a, button, input, textarea, select, [data-cursor="view"]'));
        viewLink = Boolean(target?.closest('[data-cursor="view"]'));
      }

      const stopScroll = gsap.delayedCall(0.14, () => {
        scrolling = false;
        if (position) readTarget(document.elementFromPoint(position.x, position.y));
        updateState();
      }).pause();

      function removeParticle(image) {
        particles.get(image)?.kill();
        particles.delete(image);
        image.remove();
      }

      function emitParticles(x, y) {
        if (!dropletAsset.complete || !dropletAsset.naturalWidth) return;
        for (let index = 0; index < 3; index += 1) {
          if (particles.size >= 12) removeParticle(particles.keys().next().value);
          const image = document.createElement('img');
          image.src = liquidDroplet;
          image.alt = '';
          image.draggable = false;
          image.className = 'liquid-cursor__particle';
          particleLayer.appendChild(image);
          const angle = (index * 120 + gsap.utils.random(-25, 25)) * Math.PI / 180;
          const distance = gsap.utils.random(35, 55);
          gsap.set(image, { left: x, top: y, xPercent: -50, yPercent: -50, opacity: 0, scale: 0.3 });
          const animation = gsap.timeline({ onComplete: () => removeParticle(image) });
          particles.set(image, animation);
          animation.to(image, { opacity: 1, scale: gsap.utils.random(0.8, 1), duration: 0.1 })
            .to(image, { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance, rotation: gsap.utils.random(-35, 35), duration: 0.45, ease: 'power2.out' }, 0)
            .to(image, { opacity: 0, scale: 0.3, duration: 0.2 }, 0.4);
        }
      }

      function hide() {
        visible = false;
        previous = null;
        position = null;
        pressed = dragging = hovered = viewLink = scrolling = false;
        stretch = 0;
        relax.pause();
        stopScroll.pause();
        particles.forEach((animation, image) => removeParticle(image));
        updateState();
        gsap.set(cursor, { opacity: 0 });
        root.classList.remove('liquid-cursor-active');
      }

      function handleMove(event) {
        if (event.pointerType !== 'mouse' || !blob.complete || !blob.naturalWidth || !sphere.complete || !sphere.naturalWidth) {
          hide();
          return;
        }
        const { clientX: x, clientY: y, timeStamp } = event;
        position = { x, y };
        if (!visible) {
          gsap.set(cursor, { x, y, opacity: 1 });
          readTarget(event.target instanceof Element ? event.target : null);
          root.classList.add('liquid-cursor-active');
          visible = true;
        }
        moveX(x);
        moveY(y);
        if (pressed && pressPosition && Math.hypot(x - pressPosition.x, y - pressPosition.y) > 4) dragging = true;
        if (previous) {
          const deltaX = x - previous.x;
          const deltaY = y - previous.y;
          const distance = Math.hypot(deltaX, deltaY);
          const velocity = distance / Math.max(timeStamp - previous.time, 8);
          stretch = Math.min(velocity / 2, 1);
          if (distance > 0.5) turnTo(Math.atan2(deltaY, deltaX) * 180 / Math.PI);
        }
        previous = { x, y, time: timeStamp };
        updateState();
        relax.restart(true);
      }

      function handleHover(event) {
        readTarget(event.target instanceof Element ? event.target : null);
        updateState();
      }
      function handleDown(event) {
        if (event.pointerType !== 'mouse' || !visible) return;
        pressed = true;
        dragging = false;
        pressPosition = { x: event.clientX, y: event.clientY };
        updateState();
        emitParticles(event.clientX, event.clientY);
      }
      function handleUp(event) {
        pressed = dragging = false;
        readTarget(event.target instanceof Element ? event.target : null);
        updateState();
      }
      function handleScroll() {
        const delta = window.scrollY - lastScrollY;
        lastScrollY = window.scrollY;
        if (!visible || delta === 0) return;
        scrolling = true;
        scrollAngle = delta > 0 ? 90 : -90;
        updateState();
        stopScroll.restart(true);
      }
      function handleOut(event) { if (!event.relatedTarget) hide(); }
      function handleVisibility() { if (document.hidden) hide(); }

      window.addEventListener('pointermove', handleMove, { passive: true });
      window.addEventListener('pointerover', handleHover);
      window.addEventListener('pointerout', handleOut);
      window.addEventListener('pointerdown', handleDown);
      window.addEventListener('pointerup', handleUp);
      window.addEventListener('pointercancel', hide);
      window.addEventListener('blur', hide);
      window.addEventListener('scroll', handleScroll, { passive: true });
      // Native HTML dragging suppresses pointermove; reset instead of leaving a stuck cursor.
      window.addEventListener('dragstart', hide);
      document.addEventListener('visibilitychange', handleVisibility);
      blob.addEventListener('error', hide);
      sphere.addEventListener('error', hide);

      return () => {
        window.removeEventListener('pointermove', handleMove);
        window.removeEventListener('pointerover', handleHover);
        window.removeEventListener('pointerout', handleOut);
        window.removeEventListener('pointerdown', handleDown);
        window.removeEventListener('pointerup', handleUp);
        window.removeEventListener('pointercancel', hide);
        window.removeEventListener('blur', hide);
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('dragstart', hide);
        document.removeEventListener('visibilitychange', handleVisibility);
        blob.removeEventListener('error', hide);
        sphere.removeEventListener('error', hide);
        hide();
        blob.removeAttribute('src');
        sphere.removeAttribute('src');
        relax.kill();
        stopScroll.kill();
        morph?.kill();
        [moveX, moveY, rotate, scaleX, scaleY].forEach((animation) => animation.tween.kill());
        gsap.killTweensOf([cursor, blob, blob.parentElement, sphere, ring]);
      };
    });
    return () => media.revert();
  }, []);

  return (
    <>
      <div className="liquid-cursor" ref={cursorRef} aria-hidden="true">
        <div className="liquid-cursor__blob"><img ref={blobRef} alt="" draggable="false" /></div>
        <img className="liquid-cursor__sphere" ref={sphereRef} alt="" draggable="false" />
        <span className="liquid-cursor__ring" ref={ringRef}><span>VIEW</span></span>
      </div>
      <div className="liquid-cursor-particles" ref={particlesRef} aria-hidden="true" />
    </>
  );
}
