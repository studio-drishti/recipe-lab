import Navigation from '../Navigation';
import css from "./Layout.css"

export default ({ children }) => (
  <div className={css.container}>
    <Navigation />
    {children}
  </div>
)
