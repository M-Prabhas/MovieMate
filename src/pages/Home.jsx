import React from 'react'
import {useNavigate} from "react-router-dom";
import { useCookies } from 'react-cookie';
import { useState } from 'react';
import "../styles/Home.css";
import Select from 'react-select';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

const genreOptions = [
  { value: 'action', label: 'Action' },
  { value: 'comedy', label: 'Comedy' },
  { value: 'drama', label: 'Drama' },
  {value:'romance',label:'romance'}
  // Add more genre options as needed
];

const languageOptions = [
  { value: 'english', label: 'English' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'french', label: 'French' },
  // Add more language options as needed
];

const categoryOptions = [
  { value: 'movie', label: 'Movie' },
  { value: 'series', label: 'Web Series' },
];

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    borderRadius: '8px',
    border: state.isFocused ? '2px solid blue' : '2px solid gray',
    boxShadow: state.isFocused ? '0 0 0 2px blue' : 'none',
    width:'12rem',
    cursor:'pointer',
    '&:hover': {
      border: '2px solid blue',
      width:'12rem',
    },
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? 'blue' : 'white',
    color: state.isSelected ? 'white' : 'black',
    width:'12rem',
    cursor:'pointer',
    '&:hover': {
      backgroundColor: 'lightblue',
      color: 'black',
      width:'12rem',
    },
  }),
  menu: (provided) => ({
    ...provided,
    cursor:'pointer',
    width: '13rem', // Modify the width as per your requirement
  }),
};



const Home = () => {
    const History = useNavigate();
    const [cookies,setCookies]=useCookies();
    const [menubar,setmenubar]=useState(false);
    const [lang,setlang]=useState(false);
    const [genre,setgenre]=useState(false);
    const [selectedGenre, setSelectedGenre] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [search,setsearch]=useState("");
    const [movies, setMovies] = useState([]);
    const [statement,setstatement]=useState(false);

    const handleCategoryChange = (selectedOption) => {
      setSelectedCategory(selectedOption.value);
      console.log(selectedOption.value);
    };

  const handleGenreChange = (selectedOption) => {
    setSelectedGenre(selectedOption.value);
    console.log(selectedOption.value);
  };

  const handleLanguageChange = (selectedOption) => {
    setSelectedLanguage(selectedOption.value);
    console.log(selectedOption.value);
  };

    const handleclick=()=>{
        History(`/Profile/${cookies.user.id}`);  
    }

    const handlesearch=async()=>{
        if(selectedCategory===""){
          console.log("i was clicked");
          try {
            const response = await axios.get(`http://www.omdbapi.com/?apikey=b76761d3&s=${search}`);
            const data = response.data;
            console.log(data.Search);
            if (data.Search) {
              setstatement(true);
              setTimeout(() => {
                setMovies(data.Search);
                setstatement(false);
              }, 3000);
            } else {
              setMovies([]);
            }
          } catch (error) {
            console.log(error);
          }
        }else{
          console.log("i was killed");
          try {
            const response = await axios.get(
              `http://www.omdbapi.com/?apikey=b76761d3&s=${search}&type=${selectedCategory}`
            );
            const data = response.data;
             console.log(data.Search);
            if (data.Search) {
              setMovies(data.Search);
            } else {
              setMovies([]);
            }
          } catch (error) {
            console.log(error);
          }
        }
    }

const handleit=async(event)=>{
  const movieTitle = event.target.dataset.movietitle;
  const moviePosterUrl = event.target.dataset.movieposterurl;
  const movieReleaseYear = event.target.dataset.moviereleaseyear;
  const movietype=event.target.dataset. movietype;

  axios.post('/addtowatchList',{ 
    userEmail: cookies.user.email,
    title: movieTitle,
    posterUrl: moviePosterUrl,
    releaseYear: movieReleaseYear,
    type: movietype
  })
  .then((res) => {
    console.log('Movie added to watchlist:', res.data);
    setCookies("user",{id:res._id,username: res.username,email: res.email,history:res.WatchHistory,password:res.password,image:res.image},{path: "/"})
  })
  .catch((error) => {
    // Handle any errors that occurred during the request
    console.error('Error adding movie to watchlist:', error);
  });
  

}

  return (
    <div className="HomeSection">
       {statement&&<div className="statements">
      Use the filters for more precise results.
    </div>}
      <div className="Navbar1">
        <strong>MovieMate</strong>
        <div className="menu1" onClick={()=>setmenubar(!menubar)}>
           {!menubar? <i className="fi fi-br-menu-burger" ></i>:<i className="fi fi-br-x"></i>}
        </div>
        <div className="profileroute" onClick={handleclick}>
        <i className="fi fi-ss-user"></i>
        </div>
        </div>
        { menubar&&
          <div className="menubar1">
    <span onClick={()=>setgenre(true)}>Genre<i class="fi fi-ts-angle-down"></i></span>
             <Select
        options={genreOptions}
        value={selectedGenre}
        onChange={handleGenreChange}
        styles={customStyles}
      />
      <br></br>
     <span onClick={()=>setlang(true)}>Language<i class="fi fi-ts-angle-down"></i></span>
             <Select
        options={languageOptions}
        value={selectedLanguage}
        onChange={handleLanguageChange}
        styles={customStyles}
      />
      <br></br>
      <span>Type<i class="fi fi-ts-angle-down"></i></span>
      <Select
        options={categoryOptions}
        value={selectedCategory}
        onChange={handleCategoryChange}
        styles={customStyles}
      />
          </div>
          
        }
      <div className="results">
      <div className="searchsection">
        <input required value={search} onChange={(e)=>setsearch(e.target.value)} placeholder='Enter Title .'></input>
        <i class="fi fi-bs-search" onClick={handlesearch}></i>
        </div>
        <div className="cardsresults">
        <Row xs={1} md={3} className="g-4">
      {movies.map((movie, idx) => (
        <Col key={idx}>
          <Card>
            <Card.Img variant="top" src={movie.Poster}
            style={{ height: '8rem', width: '8rem', objectFit: 'cover' }} />
            <Card.Body>
              <Card.Title>{movie.Title}</Card.Title>
              <Card.Text>
              {movie.Year}
              </Card.Text>
              <Card.Text>
                {movie.Type}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
      </div>
      </div>


    </div>
  )
}

export default Home