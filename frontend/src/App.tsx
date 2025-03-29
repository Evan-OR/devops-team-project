import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DefaultLayout from './components/DefaultLayout';
import LoginRegister from './components/LoginRegister';
import TweetsWrapper from './components/TweetsWrapper';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DefaultLayout mainComponent={<TweetsWrapper />} />} />
        <Route path="/auth" element={<DefaultLayout mainComponent={<LoginRegister />} />} />
        <Route path="*" element={<>PAGE NOT FOUND!</>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
