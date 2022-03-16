import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client';
import { createUploadLink} from 'apollo-upload-client';
import {BrowserRouter as Router,Routes, Route} from 'react-router-dom'

import { setContext } from '@apollo/client/link/context';
import Home from './components/Home';
import Important from './components/Important';

// const link = createHttpLink({
//   // uri: '/graphql',
//   uri: 'http://localhost:4000',
//   // credentials: 'same-origin'
// });

const link = createUploadLink({
  // uri: '/graphql',
  uri: 'http://localhost:4000',
  // credentials: 'same-origin'
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }

});
const client = new ApolloClient({
  cache: new InMemoryCache(),
  // link,
  link: authLink.concat(link),
});



function App() {
  return (
    <div className="App">
      <ApolloProvider client={client}>
        <Router>
        <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="about" element={<Important/>} />
        </Routes>
        </Router>
       
        
      </ApolloProvider>
    </div>
  );
}

export default App;
