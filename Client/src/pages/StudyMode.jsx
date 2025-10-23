import Button from "react-bootstrap/Button";
import FlashCard from "../components/FlashCard";
import { getCards, toggleStarred } from "../services/cardService";
import { useEffect, useState } from "react";
import "../styles/studyMode.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBackwardStep,
  faForwardStep,
  faShuffle,
  faStar as faSolidStar,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as faRegularStar } from "@fortawesome/free-regular-svg-icons";

export default function StudyPage() {
  // State management
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [studyStarred, setStudyStarred] = useState(false);

  // Fetch flashcards to display
  useEffect(() => {
    const fetchCards = async () => {
      const storedCards = await getCards();
      setCards(storedCards);
    };
    fetchCards();
  }, []);

  // Filter cards based on isStarred boolean
  const filteredCards = studyStarred
    ? cards.filter((card) => card.isStarred)
    : cards;

  // Event handlers
  const handleNext = () => {
    if (filteredCards.length > 0) {
      // ensures we don't divide by 0 and break things
      setCurrentIndex((prev) => (prev + 1) % filteredCards.length); // prev = previous state, and % filteredCards.length wraps around when we reach the end thus creating an endless loop of cards
    }
  };

  const handlePrevious = () => {
    if (filteredCards.length > 0) {
      // ensures we don't divide by 0 and break things
      setCurrentIndex(
        (prev) => (prev - 1 + filteredCards.length) % filteredCards.length
      ); // prev = previous state, and % filteredCards.length wraps around when we reach the end thus creating an endless loop of cards
    }
  };

  const handleShuffle = () => {
    // Shuffle the cards, guaranteeing every permutation is equally likely
    if (filteredCards.length > 1) {
      // no need to shuffle if 0 or 1 card
      // Fisher-Yates shuffle algorithm
      const shuffled = [...filteredCards]; // create shallow copy of array so we don't mutate the state directly
      for (let i = shuffled.length - 1; i > 0; i--) {
        // start from end of the array
        const j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // swap elements at i and j
      }
      setCards(shuffled); // update cards state in new random order
      setCurrentIndex(0); // restart at first card in new order
    }
  };

  const handleToggleStar = async (id) => {
    await toggleStarred(id);
    const updatedCards = await getCards();
    setCards(updatedCards);
  };

  return (
    <div className="centered flex-column gap-4">
      {filteredCards.length > 0 ? (
        <>
          <h4 className="m-0">Click to flip your cards!</h4>
          <FlashCard
            key={filteredCards[currentIndex].id}
            id={filteredCards[currentIndex].id}
            question={filteredCards[currentIndex].question}
            answer={filteredCards[currentIndex].answer}
            isStarred={filteredCards[currentIndex].isStarred}
            onToggleStar={handleToggleStar}
          />

          <div
            className="d-flex justify-content-center gap-4"
            style={{ width: "clamp(290px, 60%, 450px)" }}
          >
            <Button onClick={handlePrevious} className="study-btns study-nav">
              <FontAwesomeIcon icon={faBackwardStep} size="lg" className="icons btns" />
            </Button>
            <Button
              onClick={handleShuffle}
              className="study-btns"
              id="shuffle-btn"
            >
              <FontAwesomeIcon icon={faShuffle} size="lg" className="icons" />
            </Button>
            <Button onClick={handleNext} className="study-btns study-nav">
              <FontAwesomeIcon icon={faForwardStep} size="lg" className="icons" />
            </Button>
          </div>
          <div className="mt-1">
            <Button
              className="study-btns"
              onClick={() => {
                setStudyStarred((prev) => !prev);
                setCurrentIndex(0); // reset index when toggling
              }}
            >
              <FontAwesomeIcon
                icon={studyStarred ? faSolidStar : faRegularStar}
                size="lg"
                style={{ color: "var(--pop)" }}
                className="icons"
              />
            </Button>
          </div>
        </>
      ) : (
        <p>No flashcards found. Add some to start studying!</p>
      )}
    </div>
  );
}
