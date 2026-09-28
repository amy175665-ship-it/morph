import { Link, useParams } from 'react-router-dom';
import Header from '../../components/common/Header';
import journals from '../../data/journals';
import './JournalDetail.scss';

export default function JournalDetail() {
  // URL의 :slug를 읽고 find()로 해당 기사 하나를 찾습니다.
  const { slug } = useParams();
  const article = journals.find((item) => item.slug === slug);

  if (!article) {
    return (
      <div className="journal-detail-page">
        <Header />
        <main className="journal-detail">
          <h1>STORY NOT FOUND</h1>
          <p>This story is not in the archive.</p>
          <Link to="/journal">← BACK TO JOURNAL</Link>
        </main>
      </div>
    );
  }

  // 배열의 다음 기사를 선택하고 마지막 기사에서는 처음으로 돌아갑니다.
  const articleIndex = journals.indexOf(article);
  const nextArticle = journals[(articleIndex + 1) % journals.length];

  return (
    <div className="journal-detail-page">
      <Header key={slug} />
      <main className="journal-detail">
        <article>
          <header className="journal-detail__heading">
            <p className="journal-detail__meta">{article.category}</p>
            <h1>{article.title}</h1>
            <p className="journal-detail__meta">{article.year}</p>
            <p className="journal-detail__intro">{article.excerpt}</p>
          </header>
          <div className="journal-detail__hero">
            {article.image ? (
              <img src={article.image} alt={article.alt} />
            ) : (
              <div className="journal-detail__placeholder">{article.category} / IMAGE TO BE ADDED</div>
            )}
          </div>
          <div className="journal-detail__body">
            {article.sections.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                <p>{section.text}</p>
                {section.image && <img src={section.image} alt={section.alt} loading="lazy" />}
              </section>
            ))}
          </div>
        </article>
        <nav className="journal-detail__navigation" aria-label="Article navigation">
          <Link to="/journal">← BACK TO JOURNAL</Link>
          <Link to={`/journal/${nextArticle.slug}`}><span>NEXT STORY</span><strong>{nextArticle.title} →</strong></Link>
        </nav>
      </main>
    </div>
  );
}
