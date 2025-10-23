// Crud Service functions for Getting, Creating, Updating, and Deleting flashcards
const STORAGE_KEY = "flashcards";

// Get all flashcards
export const getCards = async () => {
  const cards = localStorage.getItem(STORAGE_KEY);
  return cards ? JSON.parse(cards) : [];
};

// Create a new flashcard   
export const createCard = async (cardData) => {
  const cards = await getCards();
  const newCard = { id: Date.now(), ...cardData };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...cards, newCard]));
  return newCard;
};

// Update an existing flashcard
export const updateCard = async (cardId, updatedData) => {
  const cards = await getCards();
  const updatedCards = cards.map((card) =>
    card.id === cardId ? { ...card, ...updatedData } : card
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCards));
  return updatedCards.find((card) => card.id === cardId);
};

// Delete a flashcard
export const deleteCard = async (cardId) => {
  const cards = await getCards();
  const updatedCards = cards.filter((card) => card.id !== cardId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCards));
  return cardId;
};

// Toggle "starred" status
export const toggleStarred = async (cardId) => {
    const cards = await getCards();
    const updatedCards = cards.map(card =>
        card.id === cardId ? { ...card, isStarred: !card.isStarred } : card
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCards));
    return updatedCards.find((card) => card.id === cardId);
}