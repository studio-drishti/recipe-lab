import Link from 'next/link'
import css from './Submission.css'

export default () => (
  <form className={css.form}>
    <fieldset className={css.primaryFieldset}>
      <label>
        Title
        <input type="text" />
      </label>

      <label>
        Description
        <textarea></textarea>
      </label>

    </fieldset>
    <fieldset className={css.secondaryFieldset}>
      <label>
        Additional Details
        <textarea></textarea>
      </label>
    </fieldset>
  </form>
)
