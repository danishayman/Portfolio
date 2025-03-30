import "./App.css";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from "./component/Navigation/Navigation";
import Hero from "./component/Hero/Hero";
import Education from "./component/Education/Education";
import Skills from "./component/Skills/Skills";
import Projects from "./component/Projects/Projects";
import Work from "./component/Work/Work";
import Contact from "./component/Contact/Contact";
import Footer from "./component/Footer/Footer";
import SelamatHariRaya from "./component/SelamatHariRaya/SelamatHariRaya";

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          <Route path="/" element={
            <>
              <Navigation />
              <Hero />
              <Education />
              <Skills />
              <Projects />
              <Work />
              <Contact />
              <Footer />
            </>
          } />
          <Route path="/selamathariraya" element={<SelamatHariRaya />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;
