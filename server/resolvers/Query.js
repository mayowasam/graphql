const { ApolloError, AuthenticationError } = require('apollo-server-core')
const path = require('path')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")




const Query = {
    login: async (_, { content }, { User }) => {
        let { email, password } = content
        try {

            let user = await User.findOne({ email })
            if (!user) throw new Error("incorrect credentials")

            const validPassword = await bcrypt.compare(password, user.password)
            if (!validPassword) throw new Error("incorrect credentials")

            let payload = {
                user: {
                    id: user._id,
                    email,
                    name: user.name,
                    role: user.role
                }
            }

            let accessToken =  jwt.sign(payload, process.env.ACCESS_TOKEN, { expiresIn: "10m" })
            const refreshToken =  jwt.sign(payload, process.env.REFRESH_TOKEN, { expiresIn: "2h" })

            accessToken = `Bearer ${accessToken}`
            user = await User.findOne({ email }).select('-password')


            return {
                success: true,
                message: "user logged In",
                user,
                accessToken,
                refreshToken
            }
        } catch (error) {
            throw new ApolloError(error.message, 500)
        }


    },
    getUser: async (_, __, { User, user: userData }) => {
        try {

            if (!userData) throw new AuthenticationError("User is not authenticated")
            let user = await User.findById(userData.id).select('-password')

            return user
        } catch (error) {
            throw new ApolloError(error.message, 500)
        }


    },

    // books: async (_, args, { dataSources }) => {
    books: async (_, args, { books, starwars, user }) => {

        // console.log(ctx);
        //  console.log(user);

        try {
            // let { books, starwars } = dataSources
            // let response = await starwars.getAllPeople()
            // let response = await starwars.getOne("2")
            // let response = await starwars.getMovies()
            // console.log(response);
            // return starwars.getAllPeople()
            return {
                success: true,
                message: "successfully gotten",
                books
            }
        } catch (error) {
            throw new ApolloError(error.message)
        }

    },
    recognized(_, args, { books, starwars }) {
        return books.filter(book => book.recognized)
    },
    unrecognized(_, args, { books, starwars }) {
        return books.filter(book => !book.recognized)
    },
    authors(_, args, { authors }) {
        return authors
    },
    author(_, args, { authors }) {
        let { name } = args
        // console.log(name);
        return authors.find(author => author.name.toLowerCase().trim() === name.toLowerCase().trim())
    },
    important(_, args, { books }) {
        // let { books } = dataSources
        return books
    },
    search(_, args, { books }) {
        // let { books } = dataSources
        return books
    },
    image: async () => {
        try {
            // console.log(path.resolve(__dirname, '../Upload/local-file-output.txt'));
            // const image = require("fs").createReadStream(path.resolve(__dirname, '../Upload/local-file-output.txt'))
            // image.on("data", (data) => console.log(data))

            // let serverFile = `${process.env.URL}${serverFile.split("Upload")[1]}`
            // console.log(serverFile);

        } catch (error) {
            console.log(error);

        }

    },
    async getAllPosts(_, __, { Post, user }) {
        try {
            // console.log(dataSources);
            if (!user) throw new AuthenticationError("User is not authenticated")
            let posts = await Post.find()
            if (!posts) throw new Error("posts is empty")
            return posts

        } catch (error) {

            throw new ApolloError(error.message, 500)

        }



    },
    async getPosts(_, __, { Post, user }) {
        try {
            // console.log(dataSources);
            if (!user) throw new AuthenticationError("User is not authenticated")
            let posts = await Post.find({ user: user.id })
            if (!posts) throw new Error("posts is empty")
            return posts

        } catch (error) {
            throw new ApolloError(error.message, 500)

        }


    },
    async getPostById(_, { id }, { Post, user }) {
        try {
            // console.log(dataSources);
            if (!user) throw new AuthenticationError("you are not authenticated")
            let post = await Post.findById(id)
            if (!post) throw new Error("posts is empty")
            return post

        } catch (error) {
            throw new ApolloError(error.message, 500)

        }


    },
    deletePost: async (_, { id }, { Post, user }) => {
        try {
            if (!user) throw new AuthenticationError("User is not authenticated")
            let post = await Post.findById(id)
            if (!post) throw new Error("posts is empty")
            await Post.findByIdAndRemove(id, { new: true })
            post = await Post.find({ user: user.id })

            return post

        } catch (error) {
            throw new ApolloError(error.message, 500)

        }
    },
    deleteAllPost: async (_, __, { Post, user }) => {
        try {
            if (!user) throw new AuthenticationError("User is not authenticated")
            let post = await Post.find({ user: user.id })

            if (!post) throw new Error("posts is empty")
            await Post.DeleteMany()
            return true

        } catch (error) {
            throw new ApolloError(error.message, 500)

        }
    },
    refreshToken: async(_, __, {req}) => {
        try {
            // console.log(req.headers);
            const token = req.headers["x-auth-header"] ? req.headers["x-auth-header"] : ""
            // console.log(token);
            if(!token) throw new Error("no refreshToken sent")
            const verifyToken = jwt.verify(token, process.env.REFRESH_TOKEN)
            // console.log(verifyToken);
            let accessToken = jwt.sign(verifyToken.user, process.env.ACCESS_TOKEN,{expiresIn: "10m"})
            accessToken = `Bearer ${accessToken}`
            return accessToken
        } catch (error) {
            throw new ApolloError(error.message, 500)

        }
    }

}


module.exports = Query