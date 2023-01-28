import React, { useEffect, useState } from "react";
import "./MovieScreen.css";
import { Nav, Rating, Loader, Row } from "../components";
import axios from "../axios";
import requests from "../Request";
import { Link } from "react-router-dom";

function MovieScreen() {
  const [movie, setMovie] = useState([]);
  const [toggleCast, setToggleCast] = useState(true);
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const [date, setDate] = useState([]);
  const [loading, setLoading] = useState(true);

  const pathname = window.location.pathname;
  const pathnameArr = pathname.split("/");
  const movieId = pathnameArr[2];

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(
        "/movie/" + movieId + requests.fetchByID + "&language=es-MX"
      );
      setMovie(request.data);
      const dateMovie = request.data.release_date;
      const dateMovieArr = dateMovie.split("-");
      const date = dateMovieArr[0];
      setDate(date);
      setLoading(false);
      return request;
    }

    fetchData();
  }, [movieId, pathname]);

  useEffect(() => {
    async function fetchCast() {
      const request = await axios.get("/movie/" + movieId + requests.fetchCast);
      setCast(request.data.cast.filter((cast) => cast.profile_path));
      const crew = request.data.crew.filter((crew) => crew.profile_path);
      setCrew(
        crew.reduce((unique, item) => {
          return unique.find((i) => i.name === item.name)
            ? unique
            : [...unique, item];
        }, [])
      );   
      setLoading(false);
      return { request };
    }

    fetchCast();
  }, [movieId, pathname]);

  const img_url = "https://image.tmdb.org/t/p/original";

  const fetchUrl = `/movie/${movie.id}/${requests.fetchRecomended}`;

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Nav />
          <div
            className="movieScreen"
            style={{
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundImage: `url('https://image.tmdb.org/t/p/original${movie?.backdrop_path}')`,
              backgroundPosition: "center center",
            }}
          >
            <div className="movieScreen__overlay" />
            <div className="movieScreen__container">
              <img src={img_url + movie.poster_path} alt={movie.title} />
              <div className="movieScreen__details">
                <h1>
                  {movie.title} <span>({date})</span>
                </h1>
                <div className="movieScreen__genres">
                  {movie.genres?.map((type) => (
                    <Link key={type.name} to={`/movies/genere/${type.id}`}>
                      <span className="genre">{type.name}</span>
                    </Link>
                  ))}
                </div>
                <p>{movie.overview}</p>
                <div className="movieScreen__info">
                  <Rating ratingNum={movie.vote_average / 10} />
                  {crew.length > 0 ? (
                    <div className="btn--castCrew">
                      <button
                        className={toggleCast ? "btn--active" : ""}
                        onClick={() => setToggleCast(true)}
                      >
                        Cast
                      </button>
                      <button
                        className={!toggleCast ? "btn--active" : ""}
                        onClick={() => setToggleCast(false)}
                      >
                        Crew
                      </button>
                    </div>
                  ) : null}
                  {toggleCast ? (
                    <div className="cast__carousel">
                      {cast.map((cast) => (
                        <div className="castCard" key={cast.name}>
                          <Link to={`/people/${cast.id}`}>
                            <img
                              loading="lazy"
                              src={img_url + cast.profile_path}
                              alt={cast.name}
                            />
                            <h2>{cast.name}</h2>
                            <span>{cast.character}</span>
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="cast__carousel">
                      {crew.map((crew) => (
                        <div className="castCard" key={crew.name}>
                          <Link to={`/people/${crew.id}`}>
                            <img
                              loading="lazy"
                              src={img_url + crew.profile_path}
                              alt={crew.name}
                            />
                            <h2>{crew.name}</h2>
                            <span>{crew.job}</span>
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="banner--fadeBottom" />
          </div>
          <Row
            title="Recomendadas"
            id="recomendadas"
            idArrowR="arrowRecomendadasR"
            idArrowL="arrowRecomendadasL"
            fetchUrl={fetchUrl}
            isLargeRow
          />
        </>
      )}
    </>
  );
}

export default MovieScreen;
