import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Upload from './up/upload';
import Home from './Home';

const App = () => {
  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          {/* Home 페이지 */}
          <Route path='/' element={<Home />} />

          {/* Upload 페이지 */}
          <Route path='/upload' element={<Upload />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;