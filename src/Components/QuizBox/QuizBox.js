import "./QuizBox.css";

export default function QuizBox({ children }) {
    return (
      <div className="quizWrapper">
        <div className="quizBox">
          {children}
        </div>
      </div>
    );
  }