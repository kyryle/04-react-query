import axios from "axios";
import type {Movie} from "../types/movie";

const myKey = import.meta.env.VITE_API_KEY;

interface Response {
    results: Movie[]
    total_page: number
}

export const fetchMovies = async (query: string, page: number): Promise<Response> => {
    try {
    const  result  = await axios.get<Response>("https://api.themoviedb.org/3/search/movie", {
        params: {
            query: query,
            page: 1,
        },
        headers: {
            Authorization: `Bearer ${myKey}`
        }
    })
        
        console.log(result.data.results);
        console.log(page);
        
            
            return result.data
    } catch (err) {
        console.log(err);
        return (
            {
                results: [],
                total_page: 0
            }
        )
            }
        
}