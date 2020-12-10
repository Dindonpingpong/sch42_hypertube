const axios = require("axios");
const API_KEY = 'd022dfadcf20dc66d480566359546d3c';
const { getRate } = require('./rate');
const { insertMovies } = require('../models/movies');

const getPopcornMovies = async () => {
    let raw = [];

    console.log('*Load popcorn movies*');
    for (let i = 1; i <= 10; i++) {
        try {
            const res = await axios(`https://cors-anywhere.herokuapp.com/movies-v2.api-fetch.sh/movies/${i}`, { headers: { 'X-Requested-With': true } });
            raw.push(...res.data);
        } catch (e) {
            continue
        }
    }

    let movies = [];
    movies = raw.map((movie, item) => {
        let formatMovie = new Object;
        const { imdb_id, title, synopsis, genres, torrents } = movie;

        if (!imdb_id || !title || !synopsis || !genres || !torrents)
            return null

        formatMovie.imdb = imdb_id;
        formatMovie.enTitle = title;
        formatMovie.rate = 0;
        formatMovie.enDescription = synopsis;
        formatMovie.enGenres = genres;
        formatMovie.torrents = [];

        if (torrents && torrents.en) {
            for (key in torrents.en)
                formatMovie.torrents.push([key, torrents.en[key].url]);
        }

        return (formatMovie.torrents.length > 0) ? formatMovie : null;
    })

    console.log('*Got popcorn movies*');
    return movies;
}

const getYtsMovies = async () => {
    let raw = [];

    console.log('*Load YTS movies*');
    for (let i = 1; i <= 10; i++) {
        try {
            const res = await axios(`https://yts.lt/api/v2/list_movies.json?limit=50&page=${i}`)
            raw.push(...res.data.data.movies);
        } catch (e) {
            continue
        }
    }

    let movies = [];
    movies = raw.map((movie, item) => {
        let formatMovie = new Object;
        const { imdb_code, title, synopsis, genres, torrents } = movie;

        if (!imdb_code || !title || !synopsis || !genres || !torrents)
            return null

        formatMovie.imdb = imdb_code;
        formatMovie.enTitle = title;
        formatMovie.rate = 0;
        formatMovie.enDescription = synopsis;
        formatMovie.enGenres = genres;
        formatMovie.torrents = [];

        if (torrents) {
            for (item in torrents) {
                const { quality, hash } = torrents[item];
                const url = `magnet:?xt=urn:btih:${hash}`;
                formatMovie.torrents.push([quality, url]);
            }
        }

        return (formatMovie.torrents.length > 0) ? formatMovie : null;
    })

    console.log('*Got YTS movies*');
    return movies;
}

const filterMovies = async () => {
    let pops = await getPopcornMovies();
    let yts = await getYtsMovies();
    let raw = pops.concat(yts);

    raw = raw.filter((el) => {
        return el != null;
    });

    for (i = 0; i < raw.length; i++) {
        for (j = 0; j < raw.length; j++) {
            if (raw[i].imdb === raw[j].imdb) {
                raw.splice(j, 1);
            }
        }
    }

    let movies = [];
    movies = await Promise.all(raw.map(async (movie) => {
        try {
            if (!movie.imdb)
                return null;
                
            const res = await axios(`https://api.themoviedb.org/3/movie/${movie.imdb}?api_key=${API_KEY}&language=ru`);
            const enRes = await axios(`https://api.themoviedb.org/3/movie/${movie.imdb}?api_key=${API_KEY}&language=en`);
            const en_poster_path = enRes.data.poster_path;
            const { title, genres, overview, release_date, runtime, poster_path } = res.data;

            if (!title || !genres || !overview || !release_date || !runtime || !poster_path)
                return null;

            movie.ruTitle = title;
            movie.ruDescription = overview;
            movie.year = release_date;
            movie.runtime = runtime;
            movie.enPoster = en_poster_path;
            movie.ruPoster = poster_path;
            movie.ruGenres = [];

            if (genres) {
                for (let i = 0; i < genres.length; i++)
                    movie.ruGenres.push(genres[i].name);
            }

            return movie;
        } catch (e) {
            return null;
        }
    }))

    const filtered = movies.filter((el) => {
        return el != null;
    });

    console.log('*Movies filtered*');
    return filtered;
}

const scrap = async () => {
    let filtered = await filterMovies();

    const moviesWithRate = filtered.map((item) => {
        const newRate = getRate(item.imdb);

        if (!newRate)
            return null;

        item.rate = newRate;
        return item;
    })

    const final = moviesWithRate.filter((el) => {
        return el != null;
    });

    console.log('*Film finally scrapped and cleared*');
    return final;
}

const addToDB = async () => {
    try {
        const final = await scrap();

        insertMovies(final)
            .then(() => console.log('Film added to db'))
            .catch(e => console.log(e.message))
    } catch (e) {
        console.log(e.message);
    }
}

addToDB();