import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/common/Header';
import ImageTrail from '../../components/home/ImageTrail';
import products from '../../data/products';
import journals from '../../data/journals';
import terraceImage from '../../assets/images/optimized/collection/02-void-lounge-terrace.webp';
import foundersImage from '../../assets/images/optimized/about/about-founders-01.webp';
import './Home.scss';

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeProduct = products[activeIndex];
  const productNumber = String(activeIndex + 1).padStart(2, '0');
  const featuredProducts = [8, 3].map((id) => products.find((product) => product.id === id));
  const featuredJournals = journals.slice(0, 2);

  function showNextProduct() {
    setActiveIndex((currentIndex) => (currentIndex + 1) % products.length);
  }

  return (
    <div className="home">
      <Header />
      <main>
        <ImageTrail className="hero" labelledBy="hero-heading">
          <div className="hero-editorial">
            <h1 id="hero-heading">OBJECTS<br />IN<br />MOTION.</h1>
            <p>FURNITURE<br />LIGHTING<br />OBJECTS<br />FOR A MORE<br />CREATIVE TOMORROW.</p>
          </div>
          <div className="hero-wordmark" aria-hidden="true">
            <span className="hero-wordmark__pair"><span>M</span><span>O</span></span>
            <span className="hero-wordmark__space">R</span>
            <span className="hero-wordmark__pair"><span>P</span><span>H</span></span>
          </div>
          <Link className="hero-object" data-cursor="view" to={`/product/${activeProduct.id}`} aria-label={`Explore ${activeProduct.name}`}>
            <img key={activeProduct.id} src={activeProduct.image} alt={`${activeProduct.color} ${activeProduct.name}`} fetchPriority="high" />
          </Link>
          <div className="hero-catalog">
            <div aria-live="polite"><span>{productNumber} / {products.length}</span><Link to={`/product/${activeProduct.id}`}>{activeProduct.name}</Link></div>
            <button className="circle-arrow" onClick={showNextProduct} aria-label="Show next product">→</button>
          </div>
          <a className="explore-control" href="#collection"><span>EXPLORE</span><span aria-hidden="true">↓</span></a>
          <p className="hero-quote">“EVERYDAY OBJECTS,<br /><span>A DIFFERENT PERSPECTIVE.”</span></p>
          <div className="hero-pagination"><span>{productNumber}</span><span className="pagination-line" /><span>{products.length}</span></div>
        </ImageTrail>

        <div className="home-content">
          <section className="home-selection" id="collection" aria-labelledby="collection-heading">
            <div className="home-section-heading">
              <h2 id="collection-heading">SELECTED OBJECTS</h2>
              <Link className="home-text-link" to="/shop">VIEW ALL OBJECTS <span aria-hidden="true">↗</span></Link>
            </div>
            <div className="home-selection__grid">
              {featuredProducts.map((product) => (
                <Link className="home-selection__object" key={product.id} to={`/product/${product.id}`} data-cursor="view">
                  <div className="home-selection__image">
                    <img src={product.image} alt={`${product.color} ${product.name}`} loading="lazy" />
                    <span className="home-selection__arrow" aria-hidden="true">↗</span>
                  </div>
                  <div className="home-selection__caption">
                    <div><h3>{product.name}</h3><p>{product.category.toUpperCase()}</p></div>
                    <span>₩{product.price.toLocaleString('ko-KR')}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="home-space" aria-labelledby="home-space-heading">
            <Link className="home-space__image" to="/collection" data-cursor="view" aria-label="Explore MORPH spaces">
              <img src={terraceImage} alt="Chrome VOID LOUNGE and cobalt BEND TABLE on a concrete terrace overlooking trees" loading="lazy" width="1536" height="1024" />
            </Link>
            <div className="home-space__caption">
              <div><h2 className="home-label" id="home-space-heading">MORPH COLLECTION</h2></div>
              <div><Link className="home-text-link" to="/collection">EXPLORE THE COLLECTION <span aria-hidden="true">↗</span></Link></div>
            </div>
          </section>

          <section className="home-story" id="about" aria-labelledby="home-story-heading">
            <div className="home-story__copy">
              <p className="home-label">ABOUT MORPH</p>
              <h2 id="home-story-heading">A different way<br />to live with objects.</h2>
              <p className="home-story__description">MORPH is a Seoul-based furniture and object shop exploring unexpected forms for everyday spaces.</p>
              <Link className="home-text-link" to="/about">MEET MORPH <span aria-hidden="true">↗</span></Link>
            </div>
            <figure className="home-story__portrait">
              <img src={foundersImage} alt="The two MORPH founders seated on a cobalt blue sofa in the studio" loading="lazy" width="1536" height="1024" />
              <figcaption><span>THE PEOPLE BEHIND THE OBJECTS</span><span>SEOUL, KR</span></figcaption>
            </figure>
          </section>

          <section className="home-notes" id="journal" aria-labelledby="home-notes-heading">
            <div className="home-section-heading">
              <h2 id="home-notes-heading">JOURNAL</h2>
              <Link className="home-text-link" to="/journal">ALL STORIES <span aria-hidden="true">↗</span></Link>
            </div>
            <div className="home-notes__grid">
              {featuredJournals.map((journal) => (
                <article className="home-notes__article" key={journal.id}>
                  <Link to={`/journal/${journal.slug}`} data-cursor="view">
                    <div className="home-notes__image"><img src={journal.image} alt={journal.alt} loading="lazy" /></div>
                    <p className="home-label">{journal.category} / {journal.year}</p>
                    <h3>{journal.title}<span aria-hidden="true">↗</span></h3>
                    <p className="home-notes__excerpt">{journal.excerpt}</p>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
      <footer className="home-footer">
        <div className="home-footer__top">
          <div>
            <p>EXPERIMENTAL FURNITURE & OBJECTS<br />SEOUL, SOUTH KOREA</p>
            <a className="home-footer__contact" href="mailto:hello@morph.studio">HELLO@MORPH.STUDIO</a>
          </div>
          <nav aria-label="Footer"><Link to="/shop">SHOP ↗</Link><Link to="/collection">COLLECTION ↗</Link><Link to="/about">ABOUT ↗</Link><Link to="/journal">JOURNAL ↗</Link></nav>
        </div>
        <div className="home-footer__bottom"><Link className="home-footer__wordmark" to="/" aria-label="MORPH home">MORPH</Link><span>© MORPH 2026</span></div>
      </footer>
    </div>
  );
}
