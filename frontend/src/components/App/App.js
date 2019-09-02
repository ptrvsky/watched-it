import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import Index from '../Index/Index';
import NotFound from '../NotFound/NotFound';
import './App.scss';


function App() {
  return (
    <Router>
      <div className="App">
        <div className="bg">
          <div className="wrapper">
            <Navbar />
            <Route path="/" exact component={Index} />
            <Route path="/movies/" component={NotFound} />
            <Route path="/tvseries/" component={NotFound} />
            <Route path="/people/" component={NotFound} />
            <Route path="/rankings/" component={NotFound} />
            <Route path="/watchlist" component={NotFound} />
            <Route path="/ratings" component={NotFound} />
            <Route path="/settings" component={NotFound} />
            <Route path="/login" component={NotFound} />
            <Route path="/logout" component={NotFound} />
            <Route path="/about" component={NotFound} />
            <Route path="/tos" component={NotFound} />
            <Route path="/contact" component={NotFound} />
            <Route path="/faq" component={NotFound} />
            <Route path="/notfound" component={NotFound} />
          </div>
        </div>
        <Footer />
      </div>
    </Router>

  );
}

export default App;
