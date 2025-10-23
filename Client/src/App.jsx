import { Outlet } from 'react-router-dom';
import Header from './components/Header.jsx';
import './styles/App.css';


export default function App() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
