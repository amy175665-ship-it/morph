import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import products from '../../data/products';
import './ImageTrail.scss';

export default function ImageTrail({ children, className = '', labelledBy }) {
  const sectionRef = useRef(null);
  const layerRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const layer = layerRef.current;
    const media = gsap.matchMedia();

    // Only attach pointer events when a precise, hovering pointer is available.
    media.add('(hover: hover) and (pointer: fine) and (min-width: 701px) and (prefers-reduced-motion: no-preference)', () => {
      let lastPosition = null;
      let productIndex = 0;
      let imageOrder = 0;
      const activeImages = new Map();

      // Warm the browser cache before images are needed by the pointer handler.
      const preloadImages = products.map((product) => {
        const image = new Image();
        image.src = product.image;
        return image;
      });

      function removeImage(image) {
        activeImages.get(image)?.kill();
        activeImages.delete(image);
        image.remove();
      }

      function resetPosition() {
        lastPosition = null;
      }

      function handlePointerMove(event) {
        if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;

        const bounds = section.getBoundingClientRect();
        const x = event.clientX - bounds.left;
        const y = event.clientY - bounds.top;
        if (x < 0 || y < 0 || x > bounds.width || y > bounds.height) return;

        const threshold = bounds.width < 1100 ? 110 : 80;
        if (lastPosition) {
          const distance = Math.hypot(x - lastPosition.x, y - lastPosition.y);
          if (distance < threshold) return;
        }
        lastPosition = { x, y };

        // Keep the number of animated DOM nodes bounded, even during fast movement.
        if (activeImages.size >= 12) {
          removeImage(activeImages.keys().next().value);
        }
        if (activeImages.size === 0) imageOrder = 0;

        const image = document.createElement('img');
        image.src = preloadImages[productIndex].src;
        image.alt = '';
        image.className = 'image-trail__image';
        image.draggable = false;
        layer.appendChild(image);

        productIndex = (productIndex + 1) % products.length;
        imageOrder += 1;
        gsap.set(image, {
          left: x, top: y, xPercent: -50, yPercent: -50,
          opacity: 0, scale: 0.7, rotation: gsap.utils.random(-8, 8),
          zIndex: imageOrder,
        });

        const animation = gsap.timeline({ onComplete: () => removeImage(image) });
        activeImages.set(image, animation);
        animation
          .to(image, { opacity: 1, scale: 1, duration: 0.25, ease: 'power2.out' })
          .to(image, { opacity: 0, scale: 0.8, y: -35, duration: 0.5, ease: 'power2.in' }, '+=0.4');
      }

      section.addEventListener('pointermove', handlePointerMove);
      section.addEventListener('pointerleave', resetPosition);
      section.addEventListener('pointercancel', resetPosition);
      window.addEventListener('scroll', resetPosition, { passive: true });

      return () => {
        section.removeEventListener('pointermove', handlePointerMove);
        section.removeEventListener('pointerleave', resetPosition);
        section.removeEventListener('pointercancel', resetPosition);
        window.removeEventListener('scroll', resetPosition);
        activeImages.forEach((animation, image) => removeImage(image));
      };
    });

    return () => media.revert();
  }, []);

  return (
    <section className={`image-trail ${className}`} ref={sectionRef} aria-labelledby={labelledBy}>
      {children}
      <div className="image-trail__layer" ref={layerRef} aria-hidden="true" />
    </section>
  );
}
