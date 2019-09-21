import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import Index from '../Index/Index';
import ProductionsSubpage from '../ProductionsSubpage/ProductionsSubpage';
import ProductionDetailsSubpage from '../ProductionDetailsSubpage/ProductionDetailsSubpage';
import RegisterSubpage from '../RegisterSubpage/RegisterSubpage';
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

            <Route path="/movies/" exact render={() => <ProductionsSubpage isSerie={false} />} />
            <Route path="/movies/:id" exact component={ProductionDetailsSubpage} />
            <Route path="/movies/:id/cast" component={NotFound} />
            <Route path="/movies/:id/crew" component={NotFound} />
            <Route path="/movies/:id/images" component={NotFound} />
            <Route path="/movies/:id/trailers" component={NotFound} />

            <Route path="/tvseries/" exact render={() => <ProductionsSubpage isSerie />} />
            <Route path="/tvseries/:id" exact component={ProductionDetailsSubpage} />
            <Route path="/tvseries/:id/cast" component={NotFound} />
            <Route path="/tvseries/:id/crew" component={NotFound} />
            <Route path="/tvseries/:id/images" component={NotFound} />
            <Route path="/tvseries/:id/trailers" component={NotFound} />
            
            <Route path="/people/" exact component={NotFound} />
            <Route path="/people/:id" component={NotFound} />
            <Route path="/rankings/" component={NotFound} />
            <Route path="/watchlist" component={NotFound} />
            <Route path="/ratings" component={NotFound} />
            <Route path="/settings" component={NotFound} />
            <Route path="/register" component={RegisterSubpage} />
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
