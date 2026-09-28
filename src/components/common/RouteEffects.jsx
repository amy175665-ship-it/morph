import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const pageTitles = {
  '/': 'MORPH',
  '/shop': 'Shop — MORPH',
  '/collection': 'Collection — MORPH',
  '/about': 'About — MORPH',
  '/journal': 'Journal — MORPH',
  '/cart': 'Cart — MORPH',
};

export default function RouteEffects() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const scrollPositions = useRef(new Map());
  const previousLocation = useRef(null);

  useEffect(() => {
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    return () => { window.history.scrollRestoration = previousRestoration; };
  }, []);

  useEffect(() => {
    const previous = previousLocation.current;
    const selectionOnly = previous && previous.pathname === location.pathname && previous.hash === location.hash && navigationType === 'REPLACE';
    previousLocation.current = location;
    // SHOP 조건 변경은 페이지 이동이 아니므로 스크롤·포커스를 유지합니다.
    if (selectionOnly) {
      scrollPositions.current.set(location.key, window.scrollY);
      function savePosition() { scrollPositions.current.set(location.key, window.scrollY); }
      window.addEventListener('scroll', savePosition, { passive: true });
      return () => window.removeEventListener('scroll', savePosition);
    }
    const main = document.querySelector('main');
    const heading = main?.querySelector('h1');
    document.title = pageTitles[location.pathname] || `${heading?.textContent || 'Page not found'} — MORPH`;

    // SPA에서는 문서가 새로 열리지 않으므로 이동한 본문에 포커스를 전달합니다.
    const focusTarget = heading || main;
    focusTarget?.setAttribute('tabindex', '-1');
    focusTarget?.focus({ preventScroll: true });

    let hashTarget;
    try {
      hashTarget = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    } catch {
      // 잘못 인코딩된 해시여도 페이지 자체는 정상적으로 표시합니다.
    }
    const savedPosition = scrollPositions.current.get(location.key);
    if (navigationType === 'POP' && savedPosition !== undefined) {
      window.scrollTo({ top: savedPosition, behavior: 'instant' });
    } else if (hashTarget) {
      hashTarget.scrollIntoView({ behavior: 'instant' });
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }

    // 이전 화면이 사라지기 전에 스크롤 위치를 기록해 뒤로 가기에 사용합니다.
    function savePosition() { scrollPositions.current.set(location.key, window.scrollY); }
    window.addEventListener('scroll', savePosition, { passive: true });
    return () => window.removeEventListener('scroll', savePosition);
  }, [location.key, location.pathname, location.hash, navigationType]);

  return null;
}
