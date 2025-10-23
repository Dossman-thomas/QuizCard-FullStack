import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import CardForm from "../components/CardForm";
import {
  getCards,
  createCard,
  updateCard,
  deleteCard,
  toggleStarred,
} from "../services/cardService";

export default function ManageCardsPage() {
  const navigate = useNavigate();

  // State to add new cards to the page
  const [cards, setCards] = useState([
    { id: Date.now(), question: "", answer: "" }, // start with an empty card
  ]);

  // Load existing cards from local storage
  useEffect(() => {
    const loadCards = async () => {
      const cards = await getCards();
      // if no flashcards saved yet, start with one blank card
      if (cards.length > 0) {
        setCards(cards);
      } else {
        // start with blank card
        setCards([{ id: Date.now(), question: "", answer: "" }]);
      }
    };
    loadCards();
  }, []);

  // Add a new blank card form
  const handleAddNewCardForm = () => {
    const newCard = { id: Date.now(), question: "", answer: "" };
    setCards([...cards, newCard]);
  };

  // Handle saving a card
  const handleSaveCard = async (id, fields) => {
    const existingCard = cards.find((c) => c.id === id);

    let savedCard;
    if (
      existingCard &&
      existingCard.question !== "" &&
      existingCard.answer !== ""
    ) {
      // card already exists, so update it
      savedCard = await updateCard(id, fields);
    } else {
      // brand new card, so create it
      savedCard = await createCard({ id, ...fields });
    }

    setCards((prev) => prev.map((c) => (c.id === id ? savedCard : c)));
  };

  // Update a card
  const handleUpdateCard = async (id, fields) => {
    const updated = await updateCard(id, fields);
    setCards((prev) => prev.map((c) => (c.id === id ? updated : c)));
  };

  // Delete a card
  const handleDeleteCard = async (id) => {
    await deleteCard(id);
    setCards((prev) => prev.filter((card) => card.id !== id));
  };

  // Toggle star status
  const handleToggleStarCard = async (id) => {
    const updated = await toggleStarred(id);
    setCards((prev) => prev.map((c) => (c.id === id ? updated : c)));
  };

  return (
    <div className="mt-5">
      {/* <h1 className="mb-4">Manage Cards</h1> */}
      <p>
        <em>Use the forms below to edit your flashcards!</em>
      </p>

      {cards.map((card) => (
        <CardForm
          key={card.id}
          id={card.id}
          question={card.question}
          answer={card.answer}
          isStarred={card.isStarred}
          onSave={handleSaveCard}
          onUpdate={handleUpdateCard}
          onDelete={handleDeleteCard}
          onToggleStar={handleToggleStarCard}
        />
      ))}

      <div className="d-flex justify-content-center gap-3 mt-4">
        <Button className="action-btn btn" onClick={handleAddNewCardForm}>
          Add New Card
        </Button>
        <Button className="primary-btn btn" onClick={() => navigate("/study")}>
          Want to Study?
        </Button>
      </div>
    </div>
  );
}
