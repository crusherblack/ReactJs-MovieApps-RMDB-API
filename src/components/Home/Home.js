import React, { Component } from 'react';

import { API_URL, API_KEY, IMAGE_BASE_URL, POSTER_SIZE, BACKDROP_SIZE } from '../../config';

import HeroImage from '../elements/HeroImage/HeroImage';
import SearchBar from '../elements/SearchBar/SarchBar';
import FourColGrid from '../elements/FourColGrid/FourColGrid';
import MovieThumb from '../elements/MovieThumb/MovieThumb';
import LoadMoreBtn from '../elements/LoadMoreBtn/LoadMoreBtn';
import Spinner from '../elements/Spinner/Spinner';

import './Home.css';

class Home extends Component {
    state = {
        movies: [],
        heroesImage: null,
        loading: false,
        currentPage: 0,
        totalPages: 0,
        searchTerm: ''
    }

    componentDidMount() {
        this.setState({ loading: true });
        const endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
        this.fetchitems(endpoint);
    }

    searchItems = (searchTerm) => {
        console.log(searchTerm)
        let endpoint = '';
        this.setState({
            movies: [],
            loading: true,
            searchTerm: searchTerm
        })

        if (searchTerm === '') {
            endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
        } else {
            endpoint = `${API_URL}search/movie?api_key=${API_KEY}&language=en-US&query=${searchTerm}`;
        }

        this.fetchitems(endpoint);
    }

    loadMoreitems = () => {
        let endpoint = '';
        this.setState({
            loading: true
        })

        if (this.state.searchTerm === '') {
            endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=${this.state.currentPage + 1}`;
        } else {
            endpoint = `${API_URL}search/movie?api_key=${API_KEY}&language=en-US&query=${this.state.searchTerm}&page=${this.state.currentPage + 1}`;
        }

        this.fetchitems(endpoint);
    }

    fetchitems = (endpoint) => {
        fetch(endpoint).then(result => result.json()).then(result => {
            this.setState({
                movies: [...this.state.movies, ...result.results],
                heroesImage: this.state.heroesImage || result.results[0],
                loading: false,
                currentPage: result.page,
                totalPages: result.total_pages
            })
        })
    }

    render() {
        return (
            <div className="rmdb-home">
                {this.state.heroesImage ?
                    <div>
                        <HeroImage
                            image={`${IMAGE_BASE_URL}${BACKDROP_SIZE}${this.state.heroesImage.backdrop_path}`}
                            title={this.state.heroesImage.original_title}
                            text={this.state.heroesImage.overview}
                        />
                    </div> : null}
                <SearchBar
                    callback={this.searchItems}
                />
                <div className="rmdb-home-grid">
                    <FourColGrid
                        header={this.state.searchTerm ? 'Search Result' : 'Popular Movies'}
                        loading={this.state.loading}
                    >
                        {this.state.movies.map((element, i) => {
                            return <MovieThumb
                                key={i}
                                clickable={true}
                                image={element.poster_path ? `${IMAGE_BASE_URL}${POSTER_SIZE}${element.poster_path}` : './images/no_image.jpg'}
                                movieId={element.id}
                                movieName={element.original_title}
                            />
                        })}
                    </FourColGrid>
                    {this.state.loading ? <Spinner /> : null}
                    {(this.state.currentPage <= this.state.totalPages && !this.state.loading) ?
                        <LoadMoreBtn text="Load More" onClick={this.loadMoreitems} />
                        : null}
                </div>


            </div>
        )
    }
}

export default Home;