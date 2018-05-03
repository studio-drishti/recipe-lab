import Link from 'next/link'
import css from './Navigation.css'

export default () => (
  <nav className={css.nav}>
    <Link href="/">
      <a className={css.logo}>Schooled Lunch</a>
    </Link>
    <Link href="/recipes">Recipes</Link>
    <Link href="/about">About</Link>
    <Link href="/submit">Submit</Link>
    <input type="search" placeholder="Search..." />
  </nav>
)
