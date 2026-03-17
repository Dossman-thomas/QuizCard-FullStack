import Button from 'react-bootstrap/Button';

export default function LandingPage() {
  return (
    <div className="container-fluid centered flex-column gap-2">
      <h1 className="m-0">Welcome to QuizCard!</h1>
      <h4 className="secondary-text mb-1">Ready to study, buddy?</h4>
      <Button className="primary-btn btn" size="md" href="/login">
        Login
      </Button>
      <Button className="primary-btn btn" size="md" href="signup">
        Sign up
      </Button>
      <Button className="primary-btn btn" size="md" href="/manage-cards">
        Continue as a guest
      </Button>
    </div>
  );
}
