import { Link } from 'react-router-dom';
import Header from '../../components/common/Header';
import journals from '../../data/journals';
import './Journal.scss';

export default function Journal() {
  return (
    <div className="journal-page">
      <Header />
      <main className="journal">
        <div className="journal__heading"><h1>JOURNAL</h1><span>2026</span></div>
        <div className="journal__stories">
          {/* 같은 데이터와 JSX를 map()으로 반복하고 첫 기사만 크게 배치합니다. */}
          {journals.map((article, index) => (
            <article className={`journal__story${index === 0 ? ' journal__story--featured' : ''}`} key={article.id}>
              <Link to={`/journal/${article.slug}`} aria-labelledby={`journal-${article.id}`}>
                <div className="journal__image">
                  {article.image ? (
                    <img src={article.image} alt={article.alt} loading={index === 0 ? 'eager' : 'lazy'} />
                  ) : (
                    <div className="journal__placeholder"><span>{article.category} / IMAGE TO BE ADDED</span></div>
                  )}
                </div>
                <p className="journal__meta">{String(index + 1).padStart(2, '0')} — {article.category}</p>
                <h2 id={`journal-${article.id}`}>{article.title}</h2>
                <p className="journal__excerpt">{article.excerpt}</p>
                <span className="journal__read">READ STORY →</span>
              </Link>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
