import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from "react-router-dom";
import QuizBox from '../../Components/QuizBox/QuizBox';
import '../../App.css';
import './Quiz.css';
import { CircularProgress, Button } from '@mui/material';
import ErrorMessage from '../../Components/ErrorMessage';
import WarningMessage from '../../Components/WarningMessage';
import Categories from '../../Data/Categories';
//import { theme } from "../../Components/MaterialUIColors";

const Quiz = ({name, category, completedQuestions, questions, setQuestions, candidates, setCandidates, setResultID, setResultMessage, setResultTitle, setResultNote }) => {
  const [ initialized, setInitialized ] = useState(false);
  const [ emptyVar, setEmptyVar ] = useState(false); //I need to toggle this to get the buttons to re-render
  const [ currQues, setCurrQues ] = useState(0);
  let [ selections, setSelections ] = useState([]);
  const [ error, setError ] = useState(false);
  const [ warning, setWarning ] = useState(false);
  const navigate = useNavigate();
  let nextQuestion = 0;
  let horrorOptIn = false; //track whether the user is okay with horror
  let iconAlt = 'media icon';
  

  useEffect(()=>{
  // on initial load, updateOptions
  if (!initialized) {
    if ( candidates && currQues === 0 ){
      let traitsData = {};
      for (let i = 0; i < candidates.length; i++) { 
        traitsData = buildTraitsData(traitsData, candidates, i);
      }
      //console.log("initializing options");
      updateOptions(0, traitsData);
      setInitialized(true);
    }
  }

  return () => {
    // Cleanup code executed when component unmounts
    setInitialized(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [candidates]) // <-- use effect runs when dependency variable changes, or once if empty
//end use effect

  function getIcon(categoryNum) {
    let catArray = Categories.filter(cat => cat.value === categoryNum);
    let icon = "images/film-icon.png"; //default icon
    if ( catArray.length > 0 ) {
      iconAlt = catArray[0].name + ' icon';
      icon = catArray[0].icon
    }
    return icon;
  }

  const addUnique = (item, array) => {
    let tempArray = array;
    //add item to array only if it's not already there
    if (!tempArray || tempArray.length < 1) {
      tempArray[0] = item;
      //console.log("initializing array with: " + array)
    } else if (tempArray.indexOf(item) === -1) {
      //console.log("adding " + item + " to " + array)
      tempArray.push(item); 
    } 
    return tempArray;
  }

  const optOutQuestion = (selectedOption) => {
    //did the user select to opt out of the question?
    if (questions && questions[currQues].optional && selectedOption === questions[currQues].options.at(-1)) {
      return true
    } else { return false }
  }

  const numQuestion = (selectedOption) => {
    //if this option relates to a number, record the index value instead of the string description
    //where in the options array is this selection? 
    if (questions && questions[currQues].options.indexOf(selectedOption) !== -1) {
      return questions[currQues].options.indexOf(selectedOption)
    } else { 
      console.log("Could not find number value for selected option")
      //default to last item in options, often "no preference"
      return questions[currQues].options.at(-1) 
    }
  }

  const checkOptionStrings = (questionObj) => {
    if ("optionStrings" in questionObj) {
      //if the question has the key optionStrings, those should substite number values
      return true;
    } else { return false; }
  }

  const boolQuestion = (selectedOption) => {
    //if this question relates to a boolean, option 0 should == false, option 1 should == true
    if (questions && selectedOption === questions[currQues].options[1]) {
      return true
    } else { return false }
  }

  const isRemoval = (option) => {
    //check to see if a button should have the "removal" className
    if (questions[currQues].questionStyle.substring(0,6) === "remove") {
      //make sure this isn't the opt out button
      if (questions[currQues].optional && questions[currQues].options.at(-1) === option) {
        return false;
      } else { return true; }
    } else {return false;}
  }

  const updateOptions = (questionNum, traitsData) => {
    let traitsOptions = traitsData[questions[questionNum].questionType];
    let useOptionStrings = false;

    if ( questions[questionNum].options[0].substring(0,7) === "dynamic" ) {
      let lastQuestion = "";
      let tempOptions = [];
    
      if ( questions[questionNum].optional ) {
        // adds "No preference" option to optional, dynamic questions unless already provided
        if ( questions[questionNum].options.length > 1 ) {
          lastQuestion = questions[questionNum].options.pop();
        } else { lastQuestion = "No preference"; }
      }
      
      if ( "optionStrings" in questions[questionNum] ) {
        //if the question has the key optionStrings, those should substite number values
        useOptionStrings = true;
      }

      let pastResponse = [];
      // is there another argument after dynamic?
      if ( questions[questionNum].options[0].split("-")[1] === "unique" ){
        //find matching completed question and get user's past response
        completedQuestions.current.forEach(quest => {
          if ( quest['questionType'] === questions[questionNum].questionType ){
            if ( pastResponse !== "No preference" ) {
              pastResponse = quest['response'];
            }
          }
        });
      }
     
      //for each value in traits data array, make it an option in the question
      for ( let i = 0; i < traitsOptions.length; i++ ) { 
        if (horrorOptIn && traitsOptions[i] === "horror") {
          //if they opted in to watching horror already, skip adding horror to future options to avoid confusion 
          console.log("skipped adding 'horror' to options because user already selected horror")
        } else if ( pastResponse.includes(traitsOptions[i]) ) {
          //have they given this option before?
          console.log('skipped adding option ' + traitsOptions[i] + ' to list because user picked it before');
        } else if ( useOptionStrings ) {
          //question option should equal the optionString at the index of the traitsOptions value
          if ( traitsOptions[i] < questions[questionNum].optionStrings.length ) {
            tempOptions.push(questions[questionNum].optionStrings[traitsOptions[i]]);
          } else {
            console.log("ERROR: there is not an optionStrings provided for number value " + traitsOptions[i]);
          }
        } else { 
          tempOptions.push(traitsOptions[i]); 
        }
      }

      //update the options
      setQuestions( (prevQuests) => prevQuests.map( (quest, index) => { 
        if (index === questionNum) {
          return { ...quest, options: tempOptions }
        } else return quest
      })); 

      if (lastQuestion !== ""){
        tempOptions.push(lastQuestion);
      }
    } //end traitsOptions loop
  }

  const prepNextQuestion = (nextQuestion, traitsData) => {
    updateOptions(nextQuestion, traitsData);
    setCurrQues(nextQuestion);
  }

   // runs when button option is clicked
  const handleCheck = (i) => {
    // if they're opting out of the question, deselect everything else regardless
    if ( optOutQuestion(i) ) {
      selections = [i]
    } else {

      if ( questions[currQues].optional && selections.includes(questions[currQues].options.at(-1)) ) {
        //remove opt out button from current selections
        selections.splice(selections.indexOf(questions[currQues].options.at(-1)), 1);
      }

      //does this question take multiple inputs?
      if (questions[currQues].questionStyle.includes("addMultiString") || questions[currQues].questionStyle.includes("removeMultiString")) {
        let max = questions[currQues].questionStyle.indexOf('-');
        if (max > -1) { max = parseInt(questions[currQues].questionStyle.slice(-1)); } else { max = 99; }
        //console.log("max selections is " + max);
        let index = selections.indexOf(i);
        if (index > -1) { // has the button already been selected?
          setWarning(false)
          selections.splice(index, 1); // if so, remove this selection
        } else { 
          // if it wasn't selected before, add it now
          if (max >-1 && selections.length +1 > max) {
            setWarning("Max of " + max + " options reached");
          }
          else {
            setWarning(false);
            selections.push(i);
          }
        }

      } else {
        // if question is single choice style, make it the only selection
        selections = [i]
      }
    }
    //console.log(selections.includes(i));
    setEmptyVar(!emptyVar);
    setSelections(selections);
    setError(false);
  }

  const buildTraitsData = (traitsData, currCandidates, i) => {
    //traitsData is an object consisting of each movie key items such as mood, themes, etc.   The values are arrays of unique traits from all remaining candidates. This function should be used within a loop of existing candidates where i is index of current candidate

    let tempTraitsData = traitsData;
    for (let key in currCandidates[i]) {
      //loop through the object keys of each candidate 
      //and add all relevant maps to tracking traitsData
      if (key!=="id" && key!=="name") {  // && maps !== currentMap, i.e. not the current question type
        //while we're looping, if this maps data isn't relevant to the current question,
        //track the data in this candidate for future comparisons
        if (!(key in tempTraitsData)) {
          // has key been recorded yet? if not, make an empty array:
          tempTraitsData[key] = [];
          //console.log("initialized " + key + " key for traitsData")
        }

        if (Array.isArray(currCandidates[i][key])) {
          // if the key points to an array value already, like "moods"...
          for (const a of currCandidates[i][key]) { 
            //console.log("adding " + a + " from array to " +  traitsData[key])
             tempTraitsData[key] = addUnique(a, tempTraitsData[key]) 
          }
        } else {
          // console.log("adding " + candidates[i][key] + " to " + traitsData[key])
           tempTraitsData[key] = addUnique(currCandidates[i][key], tempTraitsData[key]) 
        }
      }
    } // end adding unique traits data

    return tempTraitsData;

  }

  const goToResult = () => {
    navigate("/result");
  }

  const pruneCandidates = () => {
  
    completedQuestions.current = [
      ...completedQuestions.current,
      {
          id: currQues,
          questionType: questions[currQues].questionType,
          response: selections.join (', ')
      }
    ];
    let prunedList = [];
    let traitsData = {};
    let mostPoints = [0,0]; //index 0 is candidate index, 1 is points
    let calcSelections = selections;

    //for questions with optionStrings, turn the selections back into number values 
    if ("optionStrings" in questions[currQues]) {
      let lowercaseOpts = questions[currQues].optionStrings.map(opt => opt.toLowerCase());

      for (let s = 0; s < selections.length; s++) {
        if (typeof selections[s] === 'string' ){
          //find the matching string in questions[questionNum].optionStrings, then get its index
          let lowCaseIndex = lowercaseOpts.indexOf(selections[s].toLowerCase());
          if (lowCaseIndex > -1) {
            calcSelections[s] = lowCaseIndex;
          } 
        } else {
          console.log("ERROR: got something other than a string while looking for optionStrings in " + questions[currQues]);
        }
      }
      
    }
    //console.log("selected " + selections + " regarding " + questions[currQues].questionType);
  

    for (let i = 0; i < candidates.length; i++) { 
      //loop through each candidate (candidates is an array I think?)
      let candidateMatch = false;
      
      if ( optOutQuestion(calcSelections[0])) {
        //if they opted out, this is automatically a match
        candidateMatch = true;
      } else {
        //shorter than writing candidates[i][questions[currQues].questionType] over and over
        let currentMap = questions[currQues].questionType;        
        //if the value of "questionType", such as "moods", is a valid key in candidates:
        if (currentMap in candidates[i]) {
          //loop through each selection
          for (let x = 0; x < calcSelections.length; x++) { 
            //check if the map value is an array, which are typically going to be questionStyle add or remove strings
            if (Array.isArray(candidates[i][currentMap])) {  
              let candMapString =  candidates[i][currentMap].map(m => m.toLowerCase());
              let currentSelection = calcSelections[x].toLowerCase();
              if (candMapString.includes(currentSelection)) {
                if ( questions[currQues].questionStyle.substring(0,3) === "add" ) {
                  // starts with "add", such as "addMultiString" || "add1String" || "addMultiString"
                  candidateMatch = true;
                  if (currentSelection === "horror" ){
                    horrorOptIn = true; 
                  }
                  // in case there are multiple add qualities here, start racking points! 
                  if (candidates[i].points) { candidates[i].points+=1;} 
                  else { candidates[i].points = 1;}

                }  else if ( questions[currQues].questionStyle.substring(0,6) === "remove" ) {
                  candidateMatch = false;
                  console.log("Removing " + candidates[i].name + " because it contains " + currentSelection);
                  break;
                }

              } else if ( questions[currQues].questionStyle.substring(0,6) === "remove" ) {
                //if we are looking to remove candidates for having certain values, then they should be 
                //added to candidate list only because they do NOT have that value
                //console.log("marking " + candidates[i].name + " for inclusion because it does not have " + currentSelection)
                candidateMatch = true;
              }
            } // end array loop 
            else if (questions[currQues].questionStyle === "boolean") {
              if (candidates[i][currentMap] === boolQuestion(calcSelections[x])){
                candidateMatch = true;
              }
            } else if (Number.isInteger(candidates[i][currentMap])) {
              //console.log(candidates[i].name + " candidate map for " + questions[currQues].questionType + " is " + candidates[i][currentMap])
              if (questions[currQues].questionStyle === "maxNum") {
                //are lesser values acceptable?
                if (checkOptionStrings) {
                  if (candidates[i][currentMap] <= calcSelections[x] ) {
                    candidateMatch = true;
                  }
                } else if (candidates[i][currentMap] <= numQuestion(calcSelections[x])) {
                  //console.log(candidates[i][currentMap] + " less than " + selections[x] + " placement" )
                  candidateMatch = true;
                }
              } else {
                //otherwise, just check for matching number
                if (candidates[i][currentMap] === calcSelections[x]) {
                  candidateMatch = true;
                }
              }
            }
            
          }  // end selections loop
        } else {console.log("ERROR: could not find matching key for this question type in " + candidates[i] + " details")}
      }

      //if this is a candidate, record its unique traits
      if (candidateMatch) {
        //console.log("keeping " + candidates[i].name);
        prunedList.push(candidates[i]);
        
        // now check if the latest item has the most points yet
        let pIndex = prunedList.length-1; // index of item just added to pruned list
        if (prunedList[pIndex].points > mostPoints[1] ) {
          //console.log(prunedList[pIndex].name + " currently has the most points at " + prunedList[pIndex].points);
          mostPoints = [pIndex, prunedList[pIndex].points]
        } else if (prunedList[pIndex].points === mostPoints[1] ){
          //if we have found a candidate that has TIED for the most points, reset index so we know it's unusable
          mostPoints = [-1, mostPoints[1]]
          //console.log(prunedList[pIndex].name + " ties the points again");
        }

        traitsData = buildTraitsData(traitsData, candidates, i);
      
      } // else { //console.log(candidates[i].name + " is not a match");   }
    
      setCandidates(prunedList); //candidate's updated variable will NOT be available til next frame
      //console.log("printing Traits Data...");
      //console.log(traitsData);
    } //end looping through candidates

    //console.log("Pruned list length is " + prunedList.length);

    if (mostPoints[1] > 0 && mostPoints[0] > -1 ){
      //we have a winner for the most points!
      prunedList = [prunedList[mostPoints[0]]];
      //console.log("Winner of most points is " + prunedList[0].name);
    }

    if (prunedList.length > 1) {
      nextQuestion = currQues;
      
      for (let i = currQues+1; i < questions.length; i++) { 
        //advance through questions from current question
       // console.log("checking question " + (currQues+1));
        
       // make sure this question hasn't already been asked (somehow)
       if ( completedQuestions.current.filter((quest) => quest.id === i).length === 0 ) {
          //check if the questionType key is in traitsData
          if (questions[i].questionType in traitsData ) {
            //console.log("checking traits data: " + key + " = " + value)
            if (traitsData[questions[i].questionType].length > 1) { //are there at least two different types?
              nextQuestion = i;
            }
          }
        } else { console.log("Error: repeat question!"); }
        if (nextQuestion!==currQues) {
          break;
        }
      }
      
      // did we not update the nextQuestion?
      if (nextQuestion===currQues || nextQuestion === 0) {
        //If not, pick random candidate from the remaining results, and set it as the only one!
        let randomIndex = Math.floor(Math.random() * prunedList.length)
        //console.log("picked random int " + randomIndex)
        prunedList[0] = prunedList[randomIndex];
        prunedList.length = 1;
        //console.log(prunedList);
      }      
    } else if (prunedList.length < 1) {
      // did we get no results? 
      setResultMessage("Alas, I couldn't find something that fit all your criteria. But here's my recommendation, because who couldn't like this??")
      if (category===9) {
        setResultID("tt1821474") //Journey default game!
        setResultTitle("Journey")
        goToResult();
      } else if (category===10) {
        setResultID("tt0093779") //Princess Bride default movie!
        setResultTitle("The Princess Bride")
        goToResult();
      } 
      else if (category===11) {
        setResultID("tt11691774") //Only Murders default show!
        setResultTitle("Only Murders in the Building")
        goToResult();
      }
    }

    //We found our match!
    if (prunedList.length === 1) {
      //console.log("We narrowed it down to 1!")
      if (prunedList[0].note) {
        setResultNote(prunedList[0].note)
      } else {
        setResultNote("")
      }
      setResultTitle(prunedList[0].name);
      setResultID(prunedList[0].id);
      setResultMessage("🌟 Congrats, I found something I think you'll like! 🌟");
      goToResult();
    } else if (nextQuestion !== 0) {
      //did we find our next question?
        prepNextQuestion(nextQuestion, traitsData);
        nextQuestion = 0; 
      } else {
        //ideally this shouldn't happen, but if we can't dynamically find the next question, just go to the next
        if (questions.length > currQues+1) {
          console.log("Couldn't find appropriate question!")
          prepNextQuestion(currQues+1, traitsData);
        } else {
          setError("CAN'T FIND NEXT QUESTION")
        }
      }
  }


  const handleNext=() => {
    if (selections.length > 0) {
      setWarning(false);
      pruneCandidates(selections)
      setSelections([]); //change selections back to empty
    } else {
      setError("Please select an option first")
    }
  }

  const handleQuit=() => {
    //if(currQues > 0) { navigate("/result")}
    console.log("quitting...")
  }

// RENDER THE COMPONENT ------------------------
  return (
    <QuizBox>
      <div className="qboxHeader">
        <img src={getIcon(category)} alt={iconAlt}></img>
        {(name!=="") ? <span>{name}'s Quiz</span> :  <Link to="/">Restart Quiz</Link>}
        <img src={getIcon(category)} alt={iconAlt}></img>
      </div>

      {questions ? <>  {/* only render if questions is valid, otherwise CircularProgress loader */}
        <div className = "questionBox">
          <div className='singleQuestion'> 
            <h2>{questions[currQues].question}</h2>
            <div className='options'>
              {error && <ErrorMessage>{error}</ErrorMessage>}
              {warning && <WarningMessage>{warning}</WarningMessage>}
              {
                questions[currQues].options &&
                questions[currQues].options.map(i => (
                  <button
                    onClick={()=> handleCheck(i)}
                    className={"singleOption " + (selections.includes(i) ? "selected" : "") + (isRemoval(i) ? "removal" : "")}
                    key={i}
                  >{i}
                  </button>  
                ))
              }
            </div>
            <div className='controls'>
              <Button
                variant='contained'
                color='secondary'
                size='large'
                style={{width:185}}
                href='/'
                onClick={handleQuit}
              >
                Quit
              </Button>
              <Button
                variant='contained'
                sx={{ color: 'primary' }}
                size='large'
                style={{width:185}}
                onClick={handleNext}
              >
                Next Question
              </Button>
            </div>
          </div>
        </div> {/* end div question box */}
      

      </>: 
      <div className = "loader">
      <CircularProgress
        color='inherit'
        size={150}
        thickness={1}
      /></div>
      }  {/* conditional render */}
    </QuizBox>
  )
}

export default Quiz