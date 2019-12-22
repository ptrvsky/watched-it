import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import Index from '../Index/Index';
import ProductionsSubpage from '../ProductionsSubpage/ProductionsSubpage';
import ProductionDetailsSubpage from '../ProductionDetailsSubpage/ProductionDetailsSubpage';
import PeopleSubpage from '../PeopleSubpage/PeopleSubpage';
import PersonDetailsSubpage from '../PersonDetailsSubpage/PersonDetailsSubpage';
import RegisterSubpage from '../RegisterSubpage/RegisterSubpage';
import LoginSubpage from '../LoginSubpage/LoginSubpage';
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

            <Route path="/tvseries/" exact render={() => <ProductionsSubpage isSerie={true} />} />
            <Route path="/tvseries/:id" exact component={ProductionDetailsSubpage} />
            <Route path="/tvseries/:id/cast" component={NotFound} />
            <Route path="/tvseries/:id/crew" component={NotFound} />
            <Route path="/tvseries/:id/images" component={NotFound} />
            <Route path="/tvseries/:id/trailers" component={NotFound} />
            
            <Route path="/people/" exact component={PeopleSubpage} />
            <Route path="/people/:id" exact component={PersonDetailsSubpage} />
            <Route path="/rankings/" component={NotFound} />
            <Route path="/watchlist" render={() => <ProductionsSubpage type="watchlist" />} />
            <Route path="/ratings" render={() => <ProductionsSubpage type="ratings" />} />
            <Route path="/settings" component={NotFound} />
            <Route path="/register" component={RegisterSubpage} />
            <Route path="/login" component={LoginSubpage} />
            <Route path="/logout" component={NotFound} />
            <Route path="/about" component={NotFound} />
            <Route path="/tos" component={NotFound} />
            <Route path="/contact" component={NotFound} />
            <Route path="/faq" component={NotFound} />
            <Route path="/notfound" component={NotFound} />

            <Route path="/netflix" exact render={() => <ProductionsSubpage platform="Netflix" />} />
            <Route path="/hbogo" exact render={() => <ProductionsSubpage platform="HBO GO" />} />
            <Route path="/primevideo" exact render={() => <ProductionsSubpage platform="Prime Video" />} />
            <Route path="/platform/1" exact render={() => <ProductionsSubpage platform="Netflix" />}></Route>
            <Route path="/platform/2" exact render={() => <ProductionsSubpage platform="HBO GO" />}></Route>
            <Route path="/platform/3" exact render={() => <ProductionsSubpage platform="Prime Video" />}></Route>

          </div>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
