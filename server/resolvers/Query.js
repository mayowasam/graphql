const { ApolloError } = require('apollo-server-core')
const path = require('path')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")




const Query = {
    login: async(_ , {content}, {User}) => {
        let {email, password} = content
        try {

            let user = await User.findOne({ email })
            if (!user) throw new Error("incorrect credentials")

        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) throw new Error("incorrect credentials")

            let payload = {
                user: {
                    id: user._id,
                    email
                }
            }

            let accessToken = await jwt.sign(payload, process.env.ACCESS_TOKEN,{expiresIn :"1m"})
            const refreshToken = await jwt.sign(payload, process.env.REFRESH_TOKEN,{expiresIn :"30m"})

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

    // books: async (_, args, { dataSources }) => {
        books: async (_, args, {books, starwars, user}) => {

        // console.log(ctx);
         console.log(user);

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
    recognized(_, args, {books, starwars }) {
        return books.filter(book => book.recognized)
    },
    unrecognized(_, args, {books, starwars }) {
        return books.filter(book => !book.recognized)
    },
    authors(_, args, {authors }) {
        return authors
    },
    author(_, args, { authors}) {
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
    post(_, __,{books}){
        // console.log(dataSources);
        return books
    }

}


module.exports = Query