const { gql } = require('apollo-server-express');

const typeDefs = gql`
   directive @auth on FIELD_DEFINITION

scalar Upload

union SearchResult = Book | Author

interface Important {
  title: String 
    year: String
    version: Versions
    author: Author
}

type Book implements Important {
    title: String 
    year: String
    version: Versions
    author: Author
    star: String
    recognized: Boolean 
}

type Recognized implements Important {
  title: String 
  year: String
  version: Versions
  author: Author
  recognized: Boolean 
}

type UnRecognized implements Important {
  title: String 
  year: String
  version: Versions
  star: String
  author: Author
}

enum Versions {
  available
  not_available 
}

type Author {
    name: String
    books: [Book]
  }

  input BookInput {
    title: String!
    year: String!
    version: Versions
    author: String!
}

type File {
    filename: String!
    mimetype: String!
    encoding: String!
    link: String    # i added this
  }

type Response {
  success: Boolean!
  message: String
  books: [Book]
}

type Query {
  books: Response @auth
  recognized:[Recognized]
  unrecognized:[UnRecognized]
  authors: [Author]
  author(name:String!): Author
  important: [Important]
  search(contains: String!) : [SearchResult]
  image: File
  }

 
  type Mutation{
    addBook(content: BookInput!): Response
    uploadFile(file: Upload!): File!
    # uploadFile(file: Upload!): String!
    deleteBook(title:String!): Response
    updateBook(title:String!, content: BookInput): [Book]

  }
`
module.exports = typeDefs