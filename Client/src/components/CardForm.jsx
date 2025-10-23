import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import "../styles/cardForm.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faStar } from "@fortawesome/free-solid-svg-icons";

export default function CardForm({
  // card form props
  id,
  question: initialQuestion = "",
  answer: initialAnswer = "",
  onSave,
  onDelete,
  isStarred = false,
  onToggleStar,
}) {
  //   state management
  const [question, setQuestion] = useState(initialQuestion);
  const [answer, setAnswer] = useState(initialAnswer);
  const [showToast, setShowToast] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault(); // prevent page reload
    if (onSave) {
      onSave(id, { question, answer });
      setShowToast(true); // Show success toast on save
    }
  };

  return (
    <Card className="mb-4 p-1 mx-auto" id="card-form">
      <Card.Body>
        {/* Top-right action buttons */}
        <div className="d-flex justify-content-end mb-2">
          <Button
            size="md"
            className="me-2 card-btn"
            onClick={() => setShowDeleteModal(true)} // Open delete confirmation modal
          >
            <FontAwesomeIcon icon={faTrashCan} />
          </Button>
          <Button
            size="sm"
            className="card-btn"
            id={isStarred ? "starred-btn" : ""}
            onClick={() => onToggleStar && onToggleStar(id)}
          >
            <FontAwesomeIcon icon={faStar} />
          </Button>
        </div>

        {/* Delete Confirm Modal */}
        <Modal
          centered
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              This action cannot be undone! Are you sure you want to delete this
              card?
            </p>
            <div className="d-flex justify-content-end gap-2">
              <Button
                className="primary-btn"
                onClick={() => onDelete && onDelete(id)}
              >
                Delete
              </Button>
              <Button
                className="action-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </Button>
            </div>
          </Modal.Body>
        </Modal>

        {/* Card inputs */}
        <Form>
          <Form.Group controlId={`question-${id}`} className="mb-3">
            <Form.Label className="text-start w-100">Question: </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId={`answer-${id}`} className="mb-4">
            <div className="d-flex justify-content-between align-items-center">
              <Form.Label className="text-start w-100">Answer: </Form.Label>
              <small className="text-muted">
                {answer.length}/250
              </small>
            </div>

            <Form.Control
              type="textarea"
              as="textarea"
              aria-label="Enter answer text area"
              placeholder="Enter Answer (250 character max)"
              className="answer-input"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              maxLength={250}
            />
          </Form.Group>
          <Button
            type="submit"
            className="w-100"
            id="save-btn"
            onClick={handleSubmit}
          >
            Save
          </Button>

          {/* Success Toast */}
          <ToastContainer position="middle-center" className="p-3">
            <Toast
              bg="light"
              style={{ color: "var(--friendly-success)" }}
              onClose={() => setShowToast(false)}
              show={showToast}
              delay={1500}
              autohide
            >
              <Toast.Body>Card saved successfully!</Toast.Body>
            </Toast>
          </ToastContainer>
        </Form>
      </Card.Body>
    </Card>
  );
}
