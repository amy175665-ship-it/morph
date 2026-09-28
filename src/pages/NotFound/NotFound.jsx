import { Link } from 'react-router-dom';
import Header from '../../components/common/Header';
import './NotFound.scss';

export default function NotFound() {
  return (
    <div className="not-found-page">
      <Header />
      <main className="not-found">
        <p>404 / PAGE NOT FOUND</p>
        <h1>A different direction.</h1>
        <p>We couldn't find this page. Explore the collection or return home.</p>
        <nav aria-label="Return links">
          <Link to="/">BACK TO HOME ↗</Link>
          <Link to="/shop">EXPLORE SHOP ↗</Link>
        </nav>
      </main>
    </div>
  );
}
