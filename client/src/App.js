import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.scss';

// components
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Clubs from './structure/Clubs';
import Club from './structure/Club';
import Home from './structure/Home';
import AboutUs from './structure/About-Us';
import Forums from './structure/Forums';
import Button from './components/Button/Button';
import { CommonStateProvider } from './data/commonState';

import Modal from './components/Modal/Modal';
import ImageUpload from './components/Modal/ImageUpload';

function App() {

  return (
    <Router>
      <CommonStateProvider>
        <div className="app">
          <Header />
          <ImageUpload/>
          <div className={`content`}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/clubs" element={<Clubs />} />
              <Route path="/forums" element={<Forums />}/>
              <Route path="/item/:id" element={<Club />} />
            </Routes>
            <div className='content__background'></div>
          </div>
          <Footer />

          <Button/>
          <Modal/>
        </div>
      </CommonStateProvider>
    </Router>
  );
}

export default App;
