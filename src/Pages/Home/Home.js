import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import '../../App.css';
import './Home.css';
import QuizBox from '../../Components/QuizBox/QuizBox';
import { MenuItem, TextField, Button } from "@mui/material"
//import { theme } from "../../Components/MaterialUIColors";
import Categories from '../../Data/Categories';
import ErrorMessage from '../../Components/ErrorMessage';
import axios from "axios";
import { Link } from "react-router-dom";

const Home = ({name, setName, setQuestions, completedQuestions, setCandidates, category, setCategory, fadeNewImages}) => {
  
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const fetchQuestions = (categoryNum) => {
    //set relevant json file
    let jsonFile = Categories.filter(cat => cat.value === categoryNum)[0].json
    
    try {
      axios.get(`${jsonFile}`).then((res) => {
      setQuestions(res.data.questions);
      setCandidates(res.data.results);
      });
    } catch(error) {
      console.error(error);
    }

  };  
  
  const handleSubmit = () => {
    if (!category||!name) { /*if any of the settings buttons are empty, set error*/
      setError(true);
    } else {
      setError(false);
      fadeNewImages(0.1);
      setCandidates();
      completedQuestions.current = [];
      fetchQuestions(category);
      navigate('/quiz'); /*push to quiz route*/
    }

  };

  return (
    <QuizBox>
      <div className='settingsHeader'>
        <div className="settings">
          <div><span style={{fontSize: 30 }}>Quiz Settings</span>
          
          </div>
          <div className="iconBanner">
            <img src='images/game-icon.png' alt='video games icon' />
            <img src='images/film-icon.png' alt='film icon' />
            <img src='images/tv-icon.png' alt='tv icon' />
          </div>
          
        </div>

      </div>
      <div className="textCenter"><Link to="/about">
        About Jenny's Recs
        </Link></div>
      <div>
            <div className='selections'>
              {error && <ErrorMessage>Please complete every field</ErrorMessage>}
              <TextField  
                label='Enter Your Name' 
                onChange={(e) => setName(e.target.value)}
                variant='outlined' 
                value={name}
              />
              <TextField
                select
                label="Select Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                variant="outlined"
              >
                {Categories.map((cat) => (
                  <MenuItem id={cat.category} key={cat.category} value={cat.value} disabled={cat.disabled}>
                    {cat.category}
                  </MenuItem>
                ))}
              </TextField>
              <Button id="submit" variant='contained' color='primary' size='large'
                onClick={handleSubmit}
              >
                Start Quiz 
              </Button>
            </div>
          </div>
    </QuizBox>
    
  )
}

export default Home