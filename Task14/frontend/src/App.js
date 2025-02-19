import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import BlogList from './components/BlogList';
import BlogForm from './components/BlogForm';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={BlogList} />
        <Route path="/add" component={BlogForm} />
        <Route path="/edit/:id" component={BlogForm} />
      </Switch>
    </Router>
  );
}