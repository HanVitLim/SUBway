import React from 'react';
import { Link } from 'react-router-dom';
import bbb from './img/bbb.png'; // 이미지 파일 1
import ch1 from './img/ch1.png'; // 이미지 파일 2

const Home = () => {
  return (
    <div className="home-container">
      <Link to="/upload">
        <div className="image-container" style={{ position: 'relative', textAlign: 'center' }}>
          {/* 전체 이미지 */}
          <img src={bbb} alt="Image 1" className="animated-image" style={{ width: '100vw', height: '100vh', objectFit: 'cover' }} />

          {/* 중앙 정렬 이미지 */}
          <img src={ch1} alt="Image 2" className="animated-image" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '50%', height: 'auto' }} />
        </div>
      </Link>
    </div>
  );
};

export default Home;