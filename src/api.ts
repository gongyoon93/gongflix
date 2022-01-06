const API_KEY = "49d39e42b4468f4bc57ac7f7644f8fcf";
const BASE_PATH = "https://api.themoviedb.org/3";
const LANGUAGE = "ko-KR";
const REGION = "kr";

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

interface IMovieDetailGenres {
    id: number;
    name: string
}

export interface IMovieDetail {
    backdrop_path: string;
    genres: IMovieDetailGenres[];
    id: number;
    poster_path: string;
    release_date: string;
    title: string;
    overview: string;
    runtime: number;
    vote_average: number;
}

interface IMovieVideo {
    id: string;
    name: string;
    key: string;
    type: string;
}

export interface IGetMoviesVideoResult {
    id: number;
    results: IMovieVideo[];
}

export function getPlayingMovies(){
    return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=${LANGUAGE}`).then(
        response => response.json()
        );
}

export function getRatedMovies(){
    return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}&language=${LANGUAGE}&region=${REGION}`).then(
        response => response.json()
        );
}

export function getUpcomingMovies(){
    return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}&language=${LANGUAGE}&region=${REGION}`).then(
        response => response.json()
        );
}

export function getMovieVideo(movieId:string){
    return fetch(`${BASE_PATH}/movie/${movieId}/videos?api_key=${API_KEY}&language=${LANGUAGE}`).then(
        response => response.json()
        );
}

export function getMovieDetail(movieId:string){
    return fetch(`${BASE_PATH}/movie/${movieId}?api_key=${API_KEY}&language=${LANGUAGE}`).then(
        response => response.json()
        );
}

interface ISeries {
    id: number;
    backdrop_path: string;
    name: string;
    overview: string;
}

export interface IGetSeriesResult {
    page: number;
    results : ISeries[];
}

interface ISeriesDetailGenres {
    id: number;
    name: string
}

export interface ISeriesDetail {
    backdrop_path: string;
    genres: ISeriesDetailGenres[];
    id: number;
    poster_path: string;
    name: string;
    overview: string;
    vote_average: number;
    number_of_seasons: number;
    number_of_episodes: number;
}

interface ISeriesVideo {
    id: string;
    name: string;
    key: string;
    type: string;
}

export interface IGetSeriesVideoResult {
    id: number;
    results: ISeriesVideo[];
}

export function getPopularSeries(){
    return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}&language=${LANGUAGE}`).then(
        response => response.json()
        );
}


export function getRatedSeries(){
    return fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}&language=${LANGUAGE}&region=${REGION}`).then(
        response => response.json()
        );
}

export function getSeriesVideo(tvId:string){
    return fetch(`${BASE_PATH}/tv/${tvId}/videos?api_key=${API_KEY}&language=${LANGUAGE}`).then(
        response => response.json()
        );
}

export function getSeriesDetail(tvId:string){
    return fetch(`${BASE_PATH}/tv/${tvId}?api_key=${API_KEY}&language=${LANGUAGE}`).then(
        response => response.json()
        );
}

interface ISearchInfo {
    backdrop_path: string;
    media_type: string;
    name: string;
    title: string;
    id: number;
}

export interface ISearchInfoResult {
    results: ISearchInfo[];
}

export function getSearchInfo(keyword:string){
    return fetch(`${BASE_PATH}/search/multi?api_key=${API_KEY}&language=${LANGUAGE}&query=${keyword}`).then(
        response => response.json()
        );
}
