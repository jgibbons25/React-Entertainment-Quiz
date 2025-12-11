### React Project: Entertainment Quiz

<h2>Jenny's Recs</h1>
This is select code from my project, "Jenny's Recs," which is a dynamic entertainment quiz built in React. Some code and files have been removed for simplicity and public viewing. The live version of the full project can be seen here: <a href="https://jennys-recs-f33e14.gitlab.io" target="_blank">Jenny's Recs</a>

<h3>Component Structure</h3>
<ul>
<li>App (App.js): Main Parent component for App</li>
<ul><li><strong>Home</strong> (src/Pages/Home.js): Landing page to enter username, choose category, and begin Quiz. Here you will also find code logic to fetch the json files with corresponding data for TV, Movies, or Video Games.</li>
<li>⚡<strong><a href="https://github.com/jgibbons25/React-Entertainment-Quiz/blob/main/src/Pages/Quiz/Quiz.js" target="_blank">Quiz</a></strong> (src/Pages/Quiz.js): Page with actual quiz, containing complex logic to create options based on the current question and remaining candidates. The next question is also dynamically selected based on the remaining candidates and their unique traits.</li>
<ul><li><strong>Quiz Box</strong> (src/Components/QuizBox.js): Simple wrapper for containing and styling contents of the quiz.</li></ul>
<li><strong>Result</strong> (src/Pages/Result.js): The result page connects to the imdb API database to display an image, description, and rating for the winning candidate.</li>
<li><strong>About</strong> (src/Pages/About.js): A page describing the purpose of the site.</li>
<li><strong>Header</strong> (src/Components/Header.js): Simple header.</li>
<li><strong>Footer</strong> (src/Components/Footer.js): Simple footer.</li>
<li><strong>ErrorMessage</strong> (/Components/ErrorMessage.js)</li>
<li><strong>ErrorMessage</strong> (/Components/ErrorMessage.js)</li>
<li><strong>WarningMessage</strong> (/Components/ErrorMessage.js)</li>
</ul>
</ul>

📕 &nbsp;**Other Important Files**

<p>The following json files contain my lists of questions and candidates (movies, video games, or TV shows) as data objects. I've created keywords that match "questionType" to traits found in each candidate.</p>

- 📃 &nbsp;(public/data/) <strong><a href="https://github.com/jgibbons25/React-Entertainment-Quiz/blob/main/public/data/MovieQuestions.json" target="_blank">MovieQuestions.json</a></strong>
- 📃 &nbsp;(public/data/) <strong><a href="https://github.com/jgibbons25/React-Entertainment-Quiz/blob/main/public/data/TVQuestions.json" target="_blank">TVQuestions.json</a></strong>
- 📃 &nbsp;(public/data/) <strong><a href="https://github.com/jgibbons25/React-Entertainment-Quiz/blob/main/public/data/VGQuestions.json" target="_blank">VGQuestions.json</a></strong>

<p>Keyword examples:</p>
<ul>
<li>"options": ["dynamic"] - This is a key value pair in each question object that tells the quiz whether to generate dynamic options. The options will be created based on the traits of the remaining candidates. Otherwise, specific options can be manually listed.</li>
<li>"optionStrings": ["..."" ] - In some cases, candidates have traits with number values (such as difficulty level in a game). For usability, I can enter words here to represent each number value on the corresponding option.</li>
</ul>

<h2>Other Library Usage</h2>
This project uses <a href="https://github.com/u2ix/react-background-slider" target="_blank">react-background-slider</a>

<a href="https://mui.com/material-ui/" target="_blank">Material UI</a> library used for styling

<h2>Deployment</h2>
The main project uses <strong>gitlab</strong> to build and deploy pushes to the main branch onto the live site.
