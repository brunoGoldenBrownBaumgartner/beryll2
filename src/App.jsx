import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HeartCanvas from './heart/Heart';
import SwipeMenu from './menu/menu';
import MoonClock from './moon/moon';

const App = () => {
  return (
    <Router basename="/"> {/* Setzen Sie basename auf "/" */}
      <div>
        <SwipeMenu />
        <Routes>
          <Route path="/moon" element={<MoonClock />} />
          <Route path="/" element={<HeartCanvas />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
