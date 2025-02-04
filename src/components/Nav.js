import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import "./Nav.css";
import axios from "../axios";
import requests from "../Request";
import { BiSearchAlt } from "react-icons/bi";
import OffCanvas from "./OffCanvas";

function Nav({ isProfile }) {
  const [show, setShow] = useState(false)
  const [genereMovie, setGenereMovie] = useState([])
  const [genereSerie, setGenereSerie] = useState([])
  const [movil, setMovil] = useState(false);

  const movilBanner = () => {
    const w = window.innerWidth;

    if (w < 768) {
      setMovil(true);
    } else {
      setMovil(false);
    }
  };

  const navigate = useNavigate()
  const transitionNavBar = () => {
    if(window.scrollY > 100) {
      setShow(true)
    } else {
      setShow(false)
    }
  }
  
  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(requests.fetchGenereMovies);
      setGenereMovie(request.data.genres);
      return request;
    }   

    async function fetchSerie() {
      const request = await axios.get(requests.fetchGenereSerie)
      setGenereSerie(request.data.genres)
      return request
    }
    
    window.addEventListener('scroll', transitionNavBar)

    movilBanner()    
    fetchSerie()
    fetchData()
  }, [])

  return (
    <div className={`navbar ${show && 'nav__black'}`}>
      <div className="nav__contents">
        <div className="nav__details">
          <img
            className="nav__logo"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/799px-Netflix_2015_logo.svg.png?20190206123158"
            alt="Netflix Logo"
            onClick={() => {
              window.scrollTo(0,0)
              navigate('/')
            }}
          />
          {isProfile || movil ? null : (<div className="nav__links">
            <Link onClick={() => window.scrollTo(0,0)}>Inicio</Link>
            <div className="nav__dropdown">
              <button className="nav__dropdownButton">Géneros <IoIosArrowForward /></button>
              <div className="nav__dropdownLinks">
                {genereMovie.map(type => (
                    <a href={`/movies/genere/${type.id}`} key={type.id}>{type.name}</a>
                  )
                )}
              </div>
            </div>
            <div className="nav__dropdown">
              <button className="nav__dropdownButton">Series <IoIosArrowForward /></button>
              <div className="nav__dropdownLinks">
                {genereSerie.map(type => (
                    <a href={`/tv/genere/${type.id}`} key={type.id}>{type.name}</a>
                  )
                )}
              </div>
            </div>
          </div>)}
        </div>
        {movil && !isProfile ? <OffCanvas movie={genereMovie} tv={genereSerie}/> : null}
        {isProfile ? null : (
        <Link to='/search' className="nav__search">
          <BiSearchAlt />
        </Link>
        )}
        <img
          className="nav__avatar"
          src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"
          alt="avatar"
          onClick={() => navigate('/profile')}
        />
      </div>
    </div>
  );
}

export default Nav;
