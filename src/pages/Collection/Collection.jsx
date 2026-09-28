import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Link } from 'react-router-dom';
import Header from '../../components/common/Header';
import image01 from '../../assets/images/optimized/collection/01-blob-chair-garden.webp';
import image02 from '../../assets/images/optimized/collection/02-void-lounge-terrace.webp';
import image04 from '../../assets/images/optimized/collection/04-block-light-workspace.webp';
import image06 from '../../assets/images/optimized/collection/06-artist-collaboration.webp';
import image07 from '../../assets/images/optimized/collection/07-studio-event-overview.webp';
import './Collection.scss';

const AUTO_SLIDE_DELAY = 4500;
const FADE_DURATION = 1.1;

// 현재 폴더의 사진 5장을 표시 순서대로 관리합니다.
const collectionImages = [
  { id: 1, src: image01, alt: 'MORPH BLOB CHAIR in an outdoor gravel garden' },
  { id: 2, src: image02, alt: 'MORPH VOID LOUNGE and BEND TABLE on an architectural terrace' },
  { id: 4, src: image04, alt: 'MORPH BLOCK LIGHT in a workspace' },
  { id: 6, src: image06, alt: 'MORPH objects in an artist collaboration space' },
  { id: 7, src: image07, alt: 'Overview of a MORPH studio event' },
];

export default function Collection() {
  // 다음 후보와 실제 표시된 사진을 구분해 실패한 사진을 활성화하지 않습니다.
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleIndex, setVisibleIndex] = useState(null);
  const [allFailed, setAllFailed] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const imageRefs = useRef([]);
  const failedImages = useRef(new Set());

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    function updatePreference() { setReducedMotion(preference.matches); }
    updatePreference();
    preference.addEventListener('change', updatePreference);
    return () => preference.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    const images = imageRefs.current;
    let cancelled = false;
    let timer;
    let fade;
    let zoom;

    async function showImage() {
      let nextIndex = currentIndex;
      let imageReady = false;
      // 최대 사진 수만큼만 시도합니다. 전체 실패 시 무한 반복하지 않습니다.
      for (let attempt = 0; attempt < images.length; attempt += 1) {
        if (!failedImages.current.has(nextIndex)) {
          try {
            await images[nextIndex].decode();
            if (cancelled) return;
            imageReady = true;
            break;
          } catch {
            if (cancelled) return;
            failedImages.current.add(nextIndex);
          }
        }
        nextIndex = (nextIndex + 1) % images.length;
      }
      if (cancelled) return;
      if (!imageReady) {
        setAllFailed(true);
        return;
      }

      const activeImage = images[nextIndex];
      setVisibleIndex(nextIndex);

      // 같은 자리에 겹친 이미지들의 투명도를 동시에 바꿉니다.
      gsap.set(activeImage, { scale: 1 });
      fade = gsap.to(images, {
        opacity: (index) => index === nextIndex ? 1 : 0,
        duration: reducedMotion ? 0 : FADE_DURATION,
        ease: 'sine.inOut',
      });
      if (!reducedMotion) {
        zoom = gsap.to(activeImage, {
          scale: 1.025,
          duration: AUTO_SLIDE_DELAY / 1000,
          ease: 'none',
        });
      }

      // 사진이 바뀔 때마다 4.5초 타이머를 새로 시작합니다.
      if (!reducedMotion && images.length - failedImages.current.size > 1) {
        timer = window.setTimeout(() => {
          setCurrentIndex((nextIndex + 1) % collectionImages.length);
        }, AUTO_SLIDE_DELAY);
      }
    }

    showImage();
    return () => {
      // 페이지 이동·사진 전환·설정 변경 시 타이머와 애니메이션을 정리합니다.
      cancelled = true;
      window.clearTimeout(timer);
      fade?.kill();
      zoom?.kill();
    };
  }, [currentIndex, reducedMotion]);

  return (
    <div className="collection-page">
      <Header />
      <main className="collection" aria-label="Collection photography">
        {collectionImages.map((image, index) => (
          <img
            key={image.id}
            ref={(element) => { imageRefs.current[index] = element; }}
            className="collection__image"
            src={image.src}
            alt={image.alt}
            aria-hidden={index !== visibleIndex}
            loading="eager"
            fetchPriority={index === 0 ? 'high' : 'auto'}
            decoding="async"
            draggable="false"
          />
        ))}
        {allFailed && (
          <div className="collection__error">
            <p role="status">Collection images could not be loaded. Please try again later.</p>
            <Link to="/shop">EXPLORE OBJECTS ↗</Link>
          </div>
        )}
      </main>
    </div>
  );
}
