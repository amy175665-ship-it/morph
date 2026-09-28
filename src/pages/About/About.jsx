import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import founders01 from '../../assets/images/optimized/about/about-founders-01.webp';
import founders02 from '../../assets/images/optimized/about/about-founders-02.webp';
import founders03 from '../../assets/images/optimized/about/about-founders-03.webp';
import founders04 from '../../assets/images/optimized/about/about-founders-04.webp';
import './About.scss';

gsap.registerPlugin(ScrollTrigger);

// 실제 브랜드 계정 URL이 준비되면 연결합니다.
const instagramUrl = '';

export default function About() {
  const aboutRef = useRef(null);

  useEffect(() => {
    const media = gsap.matchMedia();
    media.add({
      desktop: '(min-width: 601px)',
      mobile: '(max-width: 600px)',
      reducedMotion: '(prefers-reduced-motion: reduce)',
    }, (context) => {
      // 동작 줄이기 설정에서는 숨기거나 이동시키지 않고 원래 화면을 표시합니다.
      if (context.conditions.reducedMotion) return;

      const photos = aboutRef.current.querySelectorAll('.about__photo');
      const copy = aboutRef.current.querySelectorAll('.about__statement h2, .about__founders > div');
      photos.forEach((photo) => {
        gsap.from(photo, {
          opacity: 0,
          y: context.conditions.mobile ? 12 : 28,
          duration: 0.8,
          ease: 'power2.out',
          clearProps: 'opacity,transform',
          scrollTrigger: { trigger: photo, start: 'top 90%', once: true },
        });
      });
      copy.forEach((element) => {
        gsap.from(element, {
          opacity: 0,
          duration: 0.55,
          ease: 'power1.out',
          clearProps: 'opacity',
          scrollTrigger: { trigger: element, start: 'top 90%', once: true },
        });
      });
    }, aboutRef);

    // StrictMode 재실행·페이지 이탈 시 이 페이지의 모션과 트리거만 정리합니다.
    return () => media.revert();
  }, []);

  return (
    <div className="about-page">
      <Header />
      <main className="about" ref={aboutRef}>
        <section className="about__intro" aria-labelledby="about-title">
          <p className="about__label">ABOUT</p>
          <h1 id="about-title">
            MORPH IS AN<br />
            EXPERIMENTAL GALLERY<br />
            FOR FURNITURE, OBJECTS<br />
            AND EVERYTHING IN BETWEEN.
          </h1>
          <p className="about__location">SEOUL, SOUTH KOREA<br />EST. 2026</p>
        </section>

        <figure className="about__photo about__photo--first">
          <img src={founders01} alt="Two MORPH founders seated on a cobalt blue sofa in the studio" width="1536" height="1024" fetchPriority="high" />
          <figcaption><span>MORPH FOUNDERS</span><span>SEOUL, 2026</span></figcaption>
        </figure>

        <section className="about__statement" aria-labelledby="about-statement">
          <h2 id="about-statement">WE COLLECT THINGS<br />THAT REFUSE TO SIT STILL.</h2>
        </section>

        <figure className="about__photo about__photo--second">
          <img src={founders02} alt="The two MORPH founders laughing together during their studio portrait session" width="1536" height="1024" loading="lazy" />
        </figure>

        <section className="about__founders" aria-labelledby="about-founders">
          <h2 id="about-founders" className="about__label">FOUNDERS</h2>
          <div>
            <p className="about__founders-copy">MORPH WAS FOUNDED IN SEOUL<br />BY TWO FRIENDS WITH A SHARED<br />OBSESSION FOR OBJECTS,<br />SPACES AND STRANGE IDEAS.</p>
            <p className="about__location">MORPH STUDIO<br />SEOUL, KR</p>
          </div>
        </section>

        <figure className="about__photo about__photo--third">
          <img src={founders03} alt="The founders sharing a relaxed smile after laughing on the blue sofa" width="1536" height="1024" loading="lazy" />
        </figure>

        <section className="about__contact" aria-labelledby="about-contact">
          <figure className="about__photo about__photo--last">
            <img src={founders04} alt="One MORPH founder leaving the frame while the other remains seated and smiling" width="1536" height="1024" loading="lazy" />
          </figure>
          <div className="about__contact-details">
            <h2 id="about-contact" className="about__label">CONTACT</h2>
            <div className="about__contact-links">
              <a href="mailto:hello@morph.studio">HELLO@MORPH.STUDIO</a>
              {instagramUrl ? (
                <a href={instagramUrl} target="_blank" rel="noreferrer">INSTAGRAM ↗</a>
              ) : (
                <span>INSTAGRAM ↗</span>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
