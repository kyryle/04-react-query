import css from './App.module.css'
import SearchBar from '../SearchBar/SearchBar'
import { fetchMovies } from "../../services/movieService";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import type { Movie } from "../../types/movie";
import { keepPreviousData, useQuery } from '@tanstack/react-query';
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
  // const [totalPages, setTotalPages] = useState<number>(1)
  // const [movies, setMovies] = useState<Movie[]>([])
  const [movie, setMovie] = useState<Movie | null>(null)

  const { data, isError, isLoading } = useQuery({
    queryKey: ['movie', query, currentPage],
    queryFn: () => fetchMovies(query, currentPage),
    enabled: query !== '',
    placeholderData: keepPreviousData
  })
  console.log(data);

  useEffect(() => {
    if (data?.results && data.results.length < 1) {
          toast.error('No movies found for your request.')
      }
  },)

  const handleSearch = async (query: string) => {
    setQuery(query)
    setCurrentPage(1)
    // console.log(query);
    // const data = await fetchMovies(query, currentPage)
    // setTotalPages(data.total_pages)
    // console.log(data);
    // setMovies(data.results ?? [])
    
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
      {data?.results && data.total_pages > 1 && <ReactPaginate
      pageCount={data.total_pages}
      pageRangeDisplayed={5}
      marginPagesDisplayed={1}
      onPageChange={({ selected }) => setCurrentPage(selected + 1)}
      forcePage={currentPage - 1}
      containerClassName={css.pagination}
      activeClassName={css.active}
      nextLabel="→"
      previousLabel="←"
      />}
      {data?.results && data.results.length > 0 && <MovieGrid movies={data.results} onSelect={handleImageClick} />}
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {movie && <><MovieModal movie={movie} onClose={handleClose}/></>}
      <Toaster/>
    </div>
)}