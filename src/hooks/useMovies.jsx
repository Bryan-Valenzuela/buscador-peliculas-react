import { useRef, useState, useMemo, useCallback } from 'react'
import { searchMovies } from '../services/movies.js'

export function useMovies ({ search, sort }) {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [, setError] = useState(null)
  const previousSearch = useRef(search)

  //hace lo mismo que el useMemo pero solo con funciones
  const getMovies = useCallback(async ({ search }) => {
    if (search === previousSearch.current) return

    try {
      setLoading(true)
      setError(null)
      previousSearch.current = search
      const newMovies = await searchMovies({ search })
      setMovies(newMovies)
    } catch (e) {
      setError(e.message)
    } finally {
      // tanto en el try como en el catch
      setLoading(false)
    }
  }, [])

  //memorisa un valor para no volverlo a calcular a menos que cambie la dependencia
  const sortedMovies = useMemo(() => {
        if (!movies) return;
    return sort
      ? [...movies].sort((a, b) => a.title.localeCompare(b.title))
      : movies
  }, [sort, movies])// valores de los que depende 

  return { movies: sortedMovies, getMovies, loading }
}