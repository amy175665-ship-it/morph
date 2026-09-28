import { useContext, useEffect, useRef, useState } from 'react';
import { CartContext } from './CartProvider';
import gsap from 'gsap';
import { Link, useLocation } from 'react-router-dom';
import products from '../../data/products';

const SCROLL_THRESHOLD = 8;
const HEADER_ANIMATION_DURATION = 0.4;

export default function Header() {
  const { totalQuantity } = useContext(CartContext);
  const logoRef = useRef(null);
  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);
  // 홈 경로에서만 히어로에 맞춰 배경을 투명하게 바꿉니다.
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [isInsideHero, setIsInsideHero] = useState(true);

  useEffect(() => {
    if (!isHome) return;
    const header = headerRef.current;
    // 현재 홈 안의 실제 첫 히어로 요소를 찾습니다.
    const hero = header.closest('.home')?.querySelector('main > .hero');
    if (!hero) {
      setIsInsideHero(false);
      return;
    }

    function updateBackground() {
      // 히어로 하단이 화면 위쪽을 지나면 흰색, 돌아오면 투명 배경입니다.
      setIsInsideHero(hero.getBoundingClientRect().bottom > 0);
    }

    updateBackground();
    const resizeObserver = new ResizeObserver(updateBackground);
    resizeObserver.observe(hero);
    window.addEventListener('scroll', updateBackground, { passive: true });
    window.addEventListener('resize', updateBackground);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('scroll', updateBackground);
      window.removeEventListener('resize', updateBackground);
    };
  }, [isHome]);

  useEffect(() => {
    const logo = logoRef.current;
    const letters = logo.querySelectorAll('.wordmark__letter');
    const media = gsap.matchMedia();

    media.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      function dropLetters() {
        gsap.to(letters, {
          y: 26,
          x: (index) => [-4, -2, 0, 3, 5][index],
          rotation: (index) => [-12, 8, -9, 14, -6][index],
          duration: 0.85,
          stagger: 0.065,
          ease: 'bounce.out',
          overwrite: true,
        });
      }

      function restoreLetters() {
        gsap.to(letters, {
          x: 0, y: 0, rotation: 0,
          duration: 0.4, stagger: 0.025,
          ease: 'power3.out', overwrite: true,
        });
      }

      logo.addEventListener('pointerenter', dropLetters);
      logo.addEventListener('pointerleave', restoreLetters);
      return () => {
        logo.removeEventListener('pointerenter', dropLetters);
        logo.removeEventListener('pointerleave', restoreLetters);
        gsap.killTweensOf(letters);
        gsap.set(letters, { clearProps: 'transform' });
      };
    });

    return () => media.revert();
  }, []);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const header = headerRef.current;
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    // 이전 위치와 같은 방향으로 이동한 거리를 저장합니다.
    let previousScrollY = Math.max(0, window.scrollY);
    let scrollDistance = 0;
    let previousDirection = 0;
    let isHidden = false;

    function setHeaderHidden(hidden) {
      if (isHidden === hidden) return;
      isHidden = hidden;
      gsap.to(header, {
        // 숨길 때는 위로 100%, 나타날 때는 원래 위치로 이동합니다.
        yPercent: hidden ? -100 : 0,
        duration: motionPreference.matches ? 0 : HEADER_ANIMATION_DURATION,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }

    function handleScroll() {
      const maxScrollY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const currentScrollY = Math.min(maxScrollY, Math.max(0, window.scrollY));
      const difference = currentScrollY - previousScrollY;
      previousScrollY = currentScrollY;

      if (currentScrollY <= 20 || menuOpen || searchOpen || header.contains(document.activeElement)) {
        scrollDistance = 0;
        previousDirection = 0;
        setHeaderHidden(false);
        return;
      }
      if (difference === 0) return;

      // 양수는 아래, 음수는 위 방향입니다. 방향이 바뀌면 거리를 다시 셉니다.
      const direction = Math.sign(difference);
      if (direction !== previousDirection) scrollDistance = 0;
      previousDirection = direction;
      scrollDistance += Math.abs(difference);

      // 작은 움직임은 누적하고, 8px을 넘었을 때만 표시 상태를 바꿉니다.
      if (scrollDistance > SCROLL_THRESHOLD) {
        setHeaderHidden(direction > 0);
        scrollDistance = 0;
      }
    }

    function handleFocus() { setHeaderHidden(false); }
    function handleMotionChange() {
      gsap.killTweensOf(header);
      gsap.set(header, { yPercent: isHidden ? -100 : 0 });
    }

    gsap.set(header, { yPercent: 0 });
    window.addEventListener('scroll', handleScroll, { passive: true });
    header.addEventListener('focusin', handleFocus);
    motionPreference.addEventListener('change', handleMotionChange);

    return () => {
      // 언마운트하거나 메뉴 상태가 바뀌면 리스너와 헤더 애니메이션을 정리합니다.
      window.removeEventListener('scroll', handleScroll);
      header.removeEventListener('focusin', handleFocus);
      motionPreference.removeEventListener('change', handleMotionChange);
      gsap.killTweensOf(header);
      gsap.set(header, { clearProps: 'transform' });
    };
  }, [menuOpen, searchOpen]);

  function closeMenu(restoreFocus = true) {
    setMenuOpen(false);
    setSearchOpen(false);
    if (restoreFocus) menuButtonRef.current?.focus({ preventScroll: true });
  }

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    // CSS에서 읽은 픽셀 이동값을 없애고 초기 위치를 퍼센트로 통일합니다.
    const context = gsap.context(() => {
      gsap.set(menuRef.current, { x: 0, xPercent: -100 });
    }, headerRef);
    return () => context.revert();
  }, []);

  useEffect(() => {
    const menu = menuRef.current;
    const links = menu.querySelectorAll('.header-menu__nav a');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = reducedMotion ? 0 : 0.7;
    const animation = gsap.timeline();
    // 흰 패널 전체를 왼쪽에서 이동시키고 닫힌 뒤에만 숨깁니다.
    if (menuOpen) gsap.set(menu, { visibility: 'visible' });
    animation.to(menu, {
      x: 0,
      xPercent: menuOpen ? 0 : -100,
      duration, ease: 'power3.inOut', overwrite: 'auto',
    });
    if (menuOpen) {
      animation.fromTo(links,
        { x: reducedMotion ? 0 : -15, opacity: 0 },
        { x: 0, opacity: 1, duration: reducedMotion ? 0 : 0.3, stagger: reducedMotion ? 0 : 0.05 }, reducedMotion ? 0 : 0.25);
    } else {
      animation.set(menu, { visibility: 'hidden' });
    }
    // 메뉴를 빠르게 다시 열어도 이전 애니메이션이 남지 않게 정리합니다.
    return () => animation.kill();
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    // 메뉴를 닫거나 페이지를 이동하면 원래 스크롤과 접근 상태를 복구합니다.
    const bodyOverflow = document.body.style.overflow;
    const rootOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    const pageContent = [...headerRef.current.closest('.site-header-space').parentElement.children]
      .filter((element) => !element.classList.contains('site-header-space'));
    const previousInert = pageContent.map((element) => element.inert);
    pageContent.forEach((element) => { element.inert = true; });
    menuButtonRef.current.focus({ preventScroll: true });

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu();
      }
      if (event.key === 'Tab') {
        // 열린 메뉴와 상단 헤더 안에서만 키보드 포커스를 순환시킵니다.
        const controls = [...headerRef.current.querySelectorAll('a[href], button, input')]
          .filter((element) => element.getClientRects().length && !element.closest('[inert]') && !element.disabled && element.tabIndex >= 0);
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault(); last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault(); first.focus();
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = bodyOverflow;
      document.documentElement.style.overflow = rootOverflow;
      pageContent.forEach((element, index) => { element.inert = previousInert[index]; });
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  const searchResults = products.filter((product) => {
    return `${product.name} ${product.category} ${product.color}`.toLowerCase().includes(searchTerm.trim().toLowerCase());
  });

  return (
    <div className="site-header-space">
      <header className={`site-header${isHome && isInsideHero && !menuOpen ? ' site-header--hero' : ''}`} ref={headerRef}>
        <button className="header-menu-toggle" ref={menuButtonRef} type="button"
          aria-expanded={menuOpen} aria-controls="header-menu" aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => menuOpen ? closeMenu() : setMenuOpen(true)}>
          {menuOpen ? <span className="header-menu-close" aria-hidden="true">×</span> : 'MENU'}
        </button>
        <Link className="wordmark" ref={logoRef} to="/" aria-label="MORPH home" onClick={() => closeMenu(false)}>
          <span className="wordmark__letter">M</span>
          <span className="wordmark__letter">O</span>
          <span className="wordmark__letter wordmark__accent">R</span>
          <span className="wordmark__letter">P</span>
          <span className="wordmark__letter">H</span>
        </Link>
        <Link className="header-cart" to="/cart" onClick={() => closeMenu(false)}>CART ({totalQuantity})</Link>
        <div id="header-menu" className="header-menu" ref={menuRef} inert={!menuOpen} aria-hidden={!menuOpen}>
          <nav className="header-menu__nav" aria-label="Main navigation">
            {[
              { label: 'SHOP', path: '/shop' },
              { label: 'COLLECTION', path: '/collection' },
              { label: 'ABOUT', path: '/about' },
              { label: 'JOURNAL', path: '/journal' },
            ].map((item, index) => (
              <Link key={item.path} to={item.path} onClick={() => closeMenu(location.pathname === item.path)} aria-current={location.pathname === item.path ? 'page' : undefined}>
                <span className="header-menu__index">{String(index + 1).padStart(2, '0')}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="header-menu__bottom">
            <div><p>MORPH<br />EXPERIMENTAL GALLERY</p><span>INSTAGRAM ↗</span><a href="mailto:hello@morph.studio">CONTACT</a></div>
            <div className="header-menu__search">
              <button type="button" aria-expanded={searchOpen} aria-controls="header-search" onClick={() => setSearchOpen(!searchOpen)}>SEARCH</button>
              {searchOpen && (
                <div id="header-search" className="search-panel">
                  <label htmlFor="product-search">FIND AN OBJECT</label>
                  <input id="product-search" type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Name, category, color" aria-describedby="search-status" autoFocus />
                  <p id="search-status" role="status">{searchResults.length === 0 ? 'No objects found. Try another name, category or color.' : `${searchResults.length} objects found.`}</p>
                  <div className="search-results">
                    {searchResults.map((product) => <Link key={product.id} to={`/product/${product.id}`} onClick={() => closeMenu(location.pathname === `/product/${product.id}`)}>{product.name} ↗</Link>)}
                  </div>
                </div>
              )}
            </div>
            <p className="header-menu__location">SEOUL, KR<br />EST. 2026</p>
          </div>
        </div>
      </header>
    </div>
  );
}
