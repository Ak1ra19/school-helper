import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { HomeworkTracker } from './components/HomeworkTracker';
import { GradeCalculator } from './components/GradeCalculator';
import { Schedule } from './components/Schedule';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/homework" element={<HomeworkTracker />} />
          <Route path="/grades" element={<GradeCalculator />} />
          <Route path="/schedule" element={<Schedule />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
