// App.js

import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState, useRef } from 'react';
import "./App.css";
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";
import Home from "./Pages/Home/Home";
import Quiz from "./Pages/Quiz/Quiz";
import Result from "./Pages/Result/Result";
import BackgroundSlider from 'react-background-slider';
import {myImages, updateImages} from "./Data/Images";
import About from "./Pages/About/About";

function App(){

    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    let [questions, setQuestions] = useState();
    let [candidates, setCandidates] = useState();
    let [resultID, setResultID] = useState("");
    let [resultMessage, setResultMessage] = useState("");
    let [resultTitle, setResultTitle] = useState("");
    let [resultNote, setResultNote] = useState("");
    let [fadeOpacity, setFadeOpacity] = useState(0);
    let completedQuestions = useRef([]) ;
      

    function fadeNewImages(increment) {
        let i = 0;
        increment = increment/7;
        if (increment < 0) { i=0.99 } // if fading out, start at almost opaque
        else {i=0}
        var k = window.setInterval(function() {
            if (i >= 1) {
                updateImages(category);
                fadeNewImages(-0.1); //time to fade out
                clearInterval(k);
            } else {
                setFadeOpacity(i);
                i+=increment;
                //if fading out
                if (i < 0.1 && increment < 0) {
                    setFadeOpacity(0);
                    clearInterval(k);
                }
            }
        }, 10);
       
    };


    return (
        <BrowserRouter>
        <div className="bgFadeCover" style={{ opacity: fadeOpacity }}></div>
        <div className="app" id="mainDiv">
        <BackgroundSlider images={myImages} duration={10} transition={2} />
            <Header />
            <Routes> {/* used to be "Switch" in older versions */}
                <Route path="/" element={<Home 
                    name={name} setName={setName} 
                    completedQuestions={completedQuestions}
                    category={category} setCategory={setCategory} 
                    setQuestions={setQuestions}
                    setCandidates={setCandidates}
                    fadeNewImages={fadeNewImages}
                    /*send variables to Home.js component */
                />} />
                <Route path="/quiz" element={<Quiz 
                    name={name}
                    category={category}
                    completedQuestions={completedQuestions}
                    questions={questions}
                    setQuestions={setQuestions}
                    candidates={candidates}
                    setCandidates={setCandidates}
                    setResultID = {setResultID}
                    setResultMessage = {setResultMessage}
                    setResultTitle = {setResultTitle}
                    setResultNote={setResultNote}
                />} />
                <Route path="/result" element={<Result 
                    resultTitle={resultTitle}
                    completedQuestions={completedQuestions.current}
                    setResultTitle={setResultTitle}
                    resultID={resultID}
                    resultMessage={resultMessage}
                    resultNote={resultNote}
                />} />
                <Route path="/about" element={
                    <About />
                } />
            </Routes>
        </div>
        <Footer />
        </BrowserRouter>
    )
}
    

export default App;
