const { gql } = require('apollo-server-express');

const userTypeDefs = gql`


interface Params {
    email: String
}

type User implements Params {
    id:ID
    name: String 
    age: String
    email: String
}

input LoginInput {
    email: String
    password: String
}

input RegisterInput{
    name: String 
    age: String
    email: String
    password: String
}



type UserResponse {
  success: Boolean!
  message: String!
  user: User
  accessToken: String
  refreshToken: String
}

extend type Query {
    login(content: LoginInput): UserResponse
 
  }

 
 extend type Mutation{
    register(content: RegisterInput): UserResponse

  }
`
module.exports = userTypeDefs