import {atom, selector} from "recoil";
import { getMovieVideo } from "./api";

interface ITypesProps {
    mTypes: number;
}

export const movieTypes = atom({
    key: 'mTypes',
    default: 0, 
});

export enum Categories {
    "playing" = "playing",
    "rated" = "rated",
    "upcoming" = "upcoming"
  }

interface IMovie {
    id: number;
    backdrop_path: string;
    poster_path: string;
    title: string;
    overview: string;
}

export interface IGetMoviesResult {
    dates: {
        maximum: string;
        minimum: string;
    };
    page: number;
    results : IMovie[];
    total_pages: number;
    total_results: number;
}

interface IMovieTypes {
    [key: string]: IGetMoviesResult[];
}

export const allMovies = atom<IGetMoviesResult[]>({
    key: 'allMovieTypes',
    default: []
});

export const categoryState = atom<Categories>({
    key: "category",
    default: Categories.playing
  });