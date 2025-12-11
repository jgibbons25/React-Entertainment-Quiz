import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import QuizBox from '../../Components/QuizBox/QuizBox';
import '../../App.css';
import './Result.css';
import testImage from '../../assets/Princess-Bride-movie-poster.jpg';
import { Link } from "react-router-dom";
import { CircularProgress } from '@mui/material';

const Result = ({ resultTitle, completedQuestions, setResultTitle, resultID, resultMessage, resultNote }) => {

  const location = useLocation(); // Get current route information
  const navigate = useNavigate();
  const [resultDesc, setResultDesc] = useState("");
  const [resultIMG, setResultIMG] = useState('');
  let testing = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development');
  const [dataFetched, setDataFetched] = useState(testing); 
  const [rating, setRating] = useState(""); 

  const initPage = async () => {
    await fetchResults(); 
  }

  const fetchResults = async () => {

    if (resultTitle !== "") {
      const url = 'api-url-goes-here';
      const options = {
        method: 'GET',
        headers: {
          'x-rapidapi-key': 'api-key-goes-here',
          'x-rapidapi-host': 'api-host-goes-here'
        }
      };

      try {
        if (!dataFetched) {
          setDataFetched(true);
          const response = await fetch(url, options);
          let result = await response.text();
          
          // if trailing comma present, remove last character by slicing it off
          // -1 in slice is the same as text.length - 1
          if (result.endsWith(",")) result = result.slice(0, -1);
          result = JSON.parse(result).data;
          setResultTitle(result.title.titleText.text);
          setRating(result.title.certificate.rating);
          setResultIMG(result.title.primaryImage.url); 
          setResultDesc(result.title.plot.plotText.plainText);
        } 
      } 
      catch (error) {
        console.error(error);
      }
    }
    
    if (testing) {
      //set test data
      setResultIMG(testImage);
      setResultDesc("A bedridden boy's grandfather reads him the story of a farmboy-turned-pirate who encounters numerous obstacles, enemies and allies in his quest to be reunited with his true love.");
    }
  }


   useEffect(()=>{
    // code to run after render goes here
    initPage();

    // HANDLE BACK BUTTON
    const handlePopState = () => {
      if (location.pathname === '/result') {
        // Redirect to homepage and replace the history entry
        navigate('/', { replace: true });
      }
    };
 
    // Add event listener for popstate (back/forward button clicks)
    window.addEventListener('popstate', handlePopState);
    

    return () => {
      // Cleanup code executed when component unmounts
      completedQuestions.current = [];
      // timeout needed so handlePopState has time to execute
      setTimeout(() => {
        window.removeEventListener('popstate', handlePopState);
      }, 0);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, location])  // Re-run effect if navigate or location changes
  

  return (
    <div>
      <QuizBox>
      {dataFetched && resultTitle !== "" ?  <>  
        <div className="resultWrapper">
          <div className="resultHeader"> 
            <span>{resultMessage}</span>
            {resultNote !== "" && <>
              <hr></hr>
              <div className="resultNote"><span className="noteMark">*NOTE:* </span><span>{resultNote}</span></div></>
            }
            <div className="hideLarge resultTitle">{resultTitle}</div>
          </div>
          <div className='flexItemsWrapper'>

            { resultIMG ? <>
              <div className='flex1 resultImg'> <a rel="noreferrer" href={`https://www.imdb.com/title/${resultID}`} target="_blank">
                <img src={resultIMG} alt='result poster' />
                </a>
                </div> 
                </>:
              <div className = "loader">
                <CircularProgress
                  color='inherit'
                  size={150}
                  thickness={1}
              /></div>

            }
            
            <div className='flex2 resultDesc'>
              <div className="hideSmall resultTitle">{resultTitle}</div>
              <div className='textCenter'><a href={`https://www.imdb.com/title/${resultID}`} target="_blank" rel="noreferrer">Go to IMDB page</a></div>
              <div><span style={{textAlign: 'left' }}>{resultDesc}</span></div>
              <div className='textCenter'><br />Rated: <b>{rating}</b></div>
            </div>
          </div>
        </div>
        </>: 
        <><div className="textCenter">Please restart your quiz to get a fresh result!
        <br /><br />
        <Link to="/">Return to Home page</Link></div>
        </>}
        <div className="textCenter">
         {completedQuestions && 
          <> { completedQuestions.map((quest) => (
            <p key={quest.id} >You answered <b>{quest.response}</b> to the question regarding <b>{quest.questionType}</b>.</p>
            ))}
          </>}
        </div>
      </QuizBox>
    </div>
  )
}

export default Result