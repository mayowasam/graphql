const { gql } = require('apollo-server-express');


const postTypeDef = gql`
    



interface Necessary{
    user:ID!
    text:String
    name:String 
    comments:[Comment]

}

input PostInput{
    text:String
}

type Comment{
    id:ID!
    user:ID!
    text:String
    name:String 
    date:Date
}

type Like {
    user:ID
    id:ID
}

type Post implements  Necessary @auth{
    # type Post @auth{
    id:ID!
    user:ID!
    text:String
    name:String 
    likes:[Like]
    createdAt:Date
    updatedAt:Date
    comments:[Comment]
}
extend type Query @auth{
    getAllPosts: [Post] @permit(requires: ADMIN)
    getPosts: [Post] 
    getPostById(id:ID!): Post
    deletePost(id:ID!): [Post] 
    deleteAllPost: Boolean 

}

extend type Mutation  @auth{ 
    createPost(content:PostInput!): [Post]
    addComment(id: ID!, content:PostInput!): [Post] 
    likePost(id: ID!): [Post] 
    deleteComment(post_id:ID!, comment_id:ID!): [Post] 
}

type Subscription{
    postCreated: Post
}

`
module.exports = postTypeDef