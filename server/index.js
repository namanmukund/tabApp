const {ApolloServer, gql} = require('apollo-server-express')
const cors = require('cors')
const express = require('express')
const uuidv4 = require('uuid/v4')

const app = express()

app.use(cors())

const users = [
  {
    id: uuidv4(),
    name: 'Marc',
    email: 'marc@jacobs.com',
    phoneNumber: '9205903932',
  },
  {
    id: uuidv4(),
    name: 'Marc 2',
    email: 'marc2@jacobs.com',
    phoneNumber: '9205903932',
  },
  {
    id: uuidv4(),
    name: 'Marc 3',
    email: 'marc3@jacobs.com',
    phoneNumber: '9205903932',
  },
]

const typeDefs = gql`
  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  type User {
    id: ID
    name: String
    email: String
    phoneNumber: String
    images: [String]
  }

  type Query {
    users: [User]
  }
  type Mutation {
    createUser(
      name: String
      email: String
      phoneNumber: String
      images: [String]
    ): User
    uploadFile(file: Upload): File
  }
`

const resolvers = {
  Query: {
    users: () => {
      return users
    },
  },
  Mutation: {
    createUser: (parent, input) => {
      console.log('query received', input)
      return {
        id: uuidv4(),
        ...input,
      }
    },
    uploadFile: (parent, args) => {
      return args.file.then(file => {
        console.log('file recieved', file)
        return file
      })
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.applyMiddleware({app, path: '/graphql'})

app.listen({port: 8000}, () => {
  console.log('Apollo Server up')
})
