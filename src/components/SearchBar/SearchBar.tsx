import css from "./SearchBar.module.css";
import toast from 'react-hot-toast';

interface SearchBarProps {
  onSubmit: (query: string) => void
}

export default function SearchBar({onSubmit}: SearchBarProps) {

  const handleForm = (formData: FormData) => {
    const query = formData.get("query") as string
    const search = query.trim()
    if (search.length < 1) {
      toast.error('Please enter your search query.')
    } else
    onSubmit(search)
    
  }
  
  return (
    <header className={css.header}>
      <div className={css.container}>
              <a className={css.link} href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer">
                  Powered by TMDB
              </a>
        <form className={css.form} action={handleForm}>
          <input className={css.input} type="text" name="query" autoComplete="off" placeholder="Search movies..." autoFocus/>
          <button className={css.button} type="submit">Search</button>
        </form>
      </div>
    </header>
  );
}