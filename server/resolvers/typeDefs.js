const { gql } = require('apollo-server-express');
const { GraphQLScalarType, Kind } = require('graphql')


const typeDefs = gql`
    directive @permit(requires: Role = ADMIN) on OBJECT | FIELD_DEFINITION
    directive @auth on OBJECT | FIELD_DEFINITION | ARGUMENT_DEFINITION | INPUT_FIELD_DEFINITION | ENUM_VALUE
    directive @deprecated(reason: String = "No longer supported") on FIELD_DEFINITION | ARGUMENT_DEFINITION | INPUT_FIELD_DEFINITION | ENUM_VALUE
    # directive @skip(if: Boolean) on FIELD_DEFINITION | ARGUMENT_DEFINITION | INPUT_FIELD_DEFINITION | ENUM_VALUE

  scalar Upload
  scalar Date

union SearchResult = Book | Author

interface Important {
  title: String 
    year: Date
    version: Versions
    author: Author
}

type Book implements Important {
    title: String 
    year: Date
    version: Versions
    author: Author
    star: String
    recognized: Boolean 
}

type Recognized implements Important {
  title: String 
  year: Date
  version: Versions
  author: Author
  recognized: Boolean 
}

type UnRecognized implements Important {
  title: String 
  year: Date
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
    year: Date!
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
  books: Response @auth @permit(requires:USER)
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

const dateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  serialize(value) {
    // console.log(value.getTime());
    return value.getTime(); // Convert outgoing Date to integer for JSON
  },
  parseValue(value) {
    return new Date(value); // Convert incoming integer to Date
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10)); // Convert hard-coded AST string to integer and then to Date
    }
    return null; // Invalid hard-coded value (not an integer)
  },
});


module.exports = {
  typeDefs,
  dateScalar
}