const Author = require('./Author')
const Query = require('./Query')
const Book = require('./Books')
const Mutation = require('./Mutation')
const Important = require('./Important')
const SearchResult = require('./SearchResult')
const {
    GraphQLUpload,
  } = require('graphql-upload');

const resolvers = {
    Query,
    Author,
    Book,
    Mutation,
    Important,
    SearchResult,
    Upload: GraphQLUpload,
}

module.exports= resolvers