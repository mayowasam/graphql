const { gql } = require('apollo-server-express');


const postTypeDef = gql`
extend type Query{
    post: [Important]
}

`
module.exports = postTypeDef