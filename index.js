import {AppRegistry} from 'react-native'
import React from 'react'
import App from './App'
import {name as appName} from './app.json'
import ApolloClient from 'apollo-client'
import {ApolloProvider} from '@apollo/react-hooks'
import {InMemoryCache} from 'apollo-cache-inmemory'
import {createUploadLink} from 'apollo-upload-client'

const client = new ApolloClient({
  link: createUploadLink({
    uri: 'https://tab-app-backend.herokuapp.com/graphql',
    credentials: 'include',
  }),
  cache: new InMemoryCache(),
})

const AppWithApollo = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)

AppRegistry.registerComponent(appName, () => AppWithApollo)
