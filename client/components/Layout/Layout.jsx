import Navigation from '../Navigation';
import Footer from '../Footer';
import css from './Layout.css';

export default ({ children }) => (
  <div className={css.container}>
    <Navigation />
    {children}
    <Footer />
  </div>
);
