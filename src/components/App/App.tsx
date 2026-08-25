import css from './App.module.css'
import SearchBar from '../SearchBar/SearchBar'
import { fetchMovies } from "../../services/movieService";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import type { Movie } from "../../types/movie";
import { useQuery } from '@tanstack/react-query';
import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import type { ComponentType } from "react";

type ModuleWithDefault<T> = { default: T };

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<ComponentType<ReactPaginateProps>>
).default;


export default function App() {
  const [query, setQuery] = useState<string>('')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [movies, setMovies] = useState<Movie[]>([])
  const [movie, setMovie] = useState<Movie | null>(null)

  const {data, isError, isLoading} = useQuery({
    queryKey: ['movie', query, currentPage],
    queryFn: () => fetchMovies(query, currentPage),
    enabled: movie === undefined
  })
    console.log(data);


  const handleSearch = async (query: string) => {
    setQuery(query)
    // console.log(query);
    const data = await fetchMovies(query, currentPage)
    setTotalPages(data.total_page)
    // console.log(data);
    setMovies(data.results ?? [])
    if (data.results.length < 1) {
          toast.error('No movies found for your request.')
      }
    
  }
  const handleImageClick = (movie: Movie) => {
    setMovie(movie)
  }

  const handleClose = () => {
    setMovie(null)
  
  }

  
  return (
    <div className={css.App}>
      <SearchBar onSubmit={handleSearch} />
      {movies.length > 0 && <ReactPaginate
      pageCount={totalPages}
      pageRangeDisplayed={5}
      marginPagesDisplayed={1}
      onPageChange={({ selected }) => setCurrentPage(selected + 1)}
      forcePage={currentPage - 1}
      containerClassName={css.pagination}
      activeClassName={css.active}
      nextLabel="→"
      previousLabel="←"
      />}
      {movies.length > 0 && <MovieGrid movies={movies} onSelect={handleImageClick} />}
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {movie && <><MovieModal movie={movie} onClose={handleClose}/></>}
      <Toaster/>
    </div>
)}