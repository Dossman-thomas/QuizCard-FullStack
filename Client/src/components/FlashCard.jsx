// FlashCard component for displaying individual flashcards
import { useState } from "react";
import Button from "react-bootstrap/Button";
import "../styles/flashCard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

export default function FlashCard({
  id,
  question,
  answer,
  isStarred,
  onToggleStar,
}) {
  const [isFlipped, setIsFlipped] = useState(false);

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleStarClick = (event) => {
    event.stopPropagation(); // Prevent flip when clicking the star
    if (onToggleStar) {
      onToggleStar(id);
    }
  };

  return (
    <div
      className={`flashcard ${isFlipped ? "is-flipped" : ""}`}
      onClick={toggleFlip}
    >
      <div className="flashcard-inner">
        {/* Star button overlay */}
        <div className="star-btn">
          <Button
            className="card-btn"
            id={isStarred ? "starred-btn" : ""}
            size="sm"
            onClick={handleStarClick}
          >
            <FontAwesomeIcon icon={faStar}  />
          </Button>
        </div>
        {/* Front of card */}
        <div className="flashcard-front">{question}</div>

        {/* Back of card */}
        <div className="flashcard-back">
          <div className="notebook-lines">
            <p className="p-4 mt-4">{answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
