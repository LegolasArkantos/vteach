import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import StudentHomePage from './components/StudentHomePage';
import StudentSessionPage from './components/StudentSessionPage';
import Unauthorized from './components/Unauthorized';
import RequireAuth from './components/RequireAuth';
import TeacherHomePage from './components/TeacherHomePage';
import SessionPage from './components/SessionPage';
import PersistLogin from './components/PersistLogin';
import LandingPage from './components/LandingPage';
import Chat from './components/Chats';


const App = () => {
  return (
    
      <Routes>
         <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth allowedRoles={['teacher']}/>}>
            <Route path="/teacherHomePage" element={<TeacherHomePage />} />
            <Route path="/session" element={<SessionPage />} />
            <Route path="/message" element={<Chat />} />
          </Route>
        

          <Route element={<RequireAuth allowedRoles={['student']}/>}>
            <Route path="/studenthomepage" element={<StudentHomePage />} />
            <Route path="/studentsessionpage" element={<StudentSessionPage />} />
          </Route>
        </Route>
    
        <Route path="/unauthorized" element={<Unauthorized />} />

      </Routes>
    
  );
};

export default App;