import React from 'react';
import { Link } from "react-router-dom";
import "./About.css";
import QuizBox from '../../Components/QuizBox/QuizBox';

const About = () => {
  return (
    <QuizBox>
    <div className="aboutWrapper">
        <div className="centerText">
            <h2>About This Quiz</h2>
        </div>
        <div className='aboutDesc'>
            <span>This web app was created by Jenny using the React JavaScript library. It connects to an IMDB API to get media result details.
            <br/><br/>
            The questions in the quiz appear dynamically based on your previous responses and the remaining list of possible candidates. The "candidates" come from Jenny's personal list of favorite movies, TV shows, and video games. </span>
        </div>
        <div className="textCenter"><Link to="/">
        Return to Home page
        </Link></div>
    </div>
    </QuizBox>
  )
}

export default About