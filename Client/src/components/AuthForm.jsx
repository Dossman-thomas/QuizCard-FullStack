import { useState } from 'react';
import { Form, Button, Card, InputGroup } from 'react-bootstrap';
import { loginUser, registerUser } from '../services/auth/auth.service';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AuthForm({ mode = 'login' }) {
  const navigate = useNavigate();
  const { login } = useAuth();

  const isLogin = mode === 'login';

  const [form, setForm] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  const isEmailValid = emailRegex.test(form.email);
  const isPasswordValid = passwordRegex.test(form.password);
  const isFormValid = isEmailValid && isPasswordValid;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let res;

      if (isLogin) {
        res = await loginUser({
          email: form.email,
          password: form.password,
        });
      } else {
        res = await registerUser({
          email: form.email,
          password: form.password,
        });
      }

      if (res.status >= 400) {
        throw new Error(res.message || 'Auth failed');
      }

      console.log(res.data.token, res.data.userId);
      // 🔥 works for BOTH login + signup
      login(res.data.token, res.data.userId);

      navigate('/manage-cards');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-25 mx-auto buffer-margin p-4 shadow">
      <h2 className="my-3 text-center">{isLogin ? 'Login' : 'Sign Up'}</h2>

      <Form onSubmit={handleSubmit}>
        {/* EMAIL */}
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            onBlur={() => handleBlur('email')}
            required
          />
          {!isEmailValid && touched.email && (
            <div className="text-danger mt-2">
              Please enter a valid email address.
            </div>
          )}
        </Form.Group>

        {/* PASSWORD */}
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>

          <InputGroup>
            <Form.Control
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
              onBlur={() => handleBlur('password')}
              required
            />

            <Button
              variant="outline-secondary"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </Button>
          </InputGroup>

          {!isPasswordValid && touched.password && (
            <div className="text-danger mt-2">
              Password must be at least 8 characters long and include letters,
              numbers, and special character.
            </div>
          )}
        </Form.Group>

        {/* REMEMBER ME (login only) */}
        {isLogin && (
          <Form.Group className="mb-3 d-flex align-items-center gap-2">
            <Form.Check
              type="checkbox"
              name="rememberMe"
              checked={form.rememberMe}
              onChange={handleChange}
              label="Remember Me"
            />
          </Form.Group>
        )}

        {/* ERROR */}
        {error && <div className="text-danger mb-3">{error}</div>}

        {/* SUBMIT */}
        <Button
          type="submit"
          className="w-100"
          disabled={!isFormValid || loading}
        >
          {loading
            ? isLogin
              ? 'Logging in...'
              : 'Signing up...'
            : isLogin
              ? 'Login'
              : 'Sign Up'}
        </Button>
      </Form>
    </Card>
  );
}
