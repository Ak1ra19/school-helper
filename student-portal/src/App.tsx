import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { HomeworkTracker } from './components/HomeworkTracker';
import { GradeCalculator } from './components/GradeCalculator';
import { Schedule } from './components/Schedule';
import { Auth } from './components/Auth';
import { Loader2 } from 'lucide-react';
import './index.css';

function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/homework" element={<HomeworkTracker />} />
          <Route path="/grades" element={<GradeCalculator />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
