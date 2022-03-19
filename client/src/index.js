import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { setContext } from '@apollo/client/link/context';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

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
  const token = localStorage.getItem('accessToken');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      // authorization: token ? `Bearer ${token}` : "",
      authorization: token ? token : "",
    }
  }

});
// const client = new ApolloClient({
//   cache: new InMemoryCache(),
//   // link,
//   link: authLink.concat(link),
// });


const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          login: {
            read(existingData, { toReference, args }) {
              const loginRef = toReference({
                __typename: "UserResponse",
                content: args.content

              })

              return existingData ?? loginRef
            }

          }

        }
      },
      UserResponse: {
        //  keyFields:["success", "message", "accessToken", "user"],
        fields: {
          successWithMessage: {
            read(existingData, { readField }) {
              const success = readField("success")
              const message = readField("message")
              return `${success} ${message}`
            }

          }
        }
      }

    }
  }),
  // link,
  link: authLink.concat(link),
});



ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>

  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
