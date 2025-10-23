import Button from "react-bootstrap/Button";

export default function LandingPage() {
  return (
    <div className="container-fluid centered flex-column gap-2">
      <h1 className="m-0">Welcome to QuizCard!</h1>
      <h4 className="secondary-text mb-1">Ready to study, buddy?</h4>
      <Button className="primary-btn btn" size="md" href="/manage-cards">
        Let's Go!
      </Button>
    </div>
  );
}
