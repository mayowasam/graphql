const { gql } = require('apollo-server-express');

const userTypeDefs = gql`

enum Role {
  ADMIN
  REVIEWER
  USER
  UNKNOWN
}


interface Params {
    email: String
}


# type User @permit(requires: USER) {
#   name: String
#   banned: Boolean @permit(requires: ADMIN)
#   canPost: Boolean @permit(requires: REVIEWER)
# }

type User implements Params {
    id:ID
    name: String 
    age: String
    email: String
    role: Role
    # role: Role 
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
    getUser: User @auth 
    refreshToken: String
  }

 
 extend type Mutation{
    register(content: RegisterInput): UserResponse

  }
`
module.exports = userTypeDefs