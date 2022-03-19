const { finished } = require('stream/promises');
const { join, parse } = require("path");
const { ApolloError, UserInputError, ForbiddenError, AuthenticationError } = require('apollo-server-core');
const jwt = require("jsonwebtoken")


const Mutation = {
    async register(_, { content }, { User }) {
        let { email, name } = content
        try {

            let user = await User.findOne({ email })
            if (user) throw new Error("user already exist")

            user = await User.create(content)
            let payload = {
                user: {
                    id: user._id,
                    email,
                    name,
                    role: user.role
                }
            }

            let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN, { expiresIn: "10m" })
            const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN, { expiresIn: "2h" })

            accessToken = `Bearer ${accessToken}`
            user = await User.findOne({ email }).select('-password')


            return {
                success: true,
                message: "user created",
                user,
                accessToken,
                refreshToken
            }
        } catch (error) {
            throw new ApolloError(error.message, 500)
        }


    },
    addBook(_, args, ctx) {
        // console.log(args);
        let { books } = ctx
        let { title, year, version, author } = args.content
        let newBook = {
            title,
            year,
            version,
            author
        }
        books.push(newBook)
        return {
            success: true,
            message: "successfully added",
            books
        }

    },
    uploadFile: async (_, { file }) => {
        try {
            console.log(file);
            if (!file) throw new UserInputError("file not sent", 400)
            const { createReadStream, filename, mimetype, encoding } = await file
            // console.log(filename);
            // console.log("mimetype", mimetype);
            // console.log("encoding",encoding);

            // const { ext, name } = parse(filename)
            // console.log("ext", ext);
            // console.log("name", name);

            // let fullName = filename.split(" ").join("") 
            // console.log(fullName);


            const stream = createReadStream();

            //default  this stores it as a text with binary 
            // const out = require('fs').createWriteStream('local-file-output.txt');


            //where i want to store the picture itself in a folder
            // let store  =  join(__dirname, `../Upload/${filename}`);
            // const out = require('fs').createWriteStream(store);


            //where i want to store the text itself in a folder
            // let store  =  join(__dirname, `../Upload/`);
            // const out = require('fs').createWriteStream(`${store}local-file-output.txt`);

            //file link
            let serverFile = join(__dirname, `../Upload/-${Date.now()}${filename.split(" ").join("")}`);
            const out = require('fs').createWriteStream(serverFile);


            stream.pipe(out);
            await finished(out);

            // console.log(serverFile);
            serverFile = `${process.env.URL}${serverFile.split("Upload")[1]}`
            console.log(serverFile);
            console.log(process.env.URL);

            return { filename, mimetype, encoding, link: serverFile };
        } catch (error) {
            throw new ApolloError(error.message, 500)

        }


    },
    updateBook(_, args, ctx) {
        let { books } = ctx
        // console.log(args);
        let { title, content: { title: booktitle, year, author: { name, books: allbooks } } } = args
        // console.log(title);
        let result = books.map(book => book.title).indexOf(title)
        // console.log(result); 
        if (result && result !== -1) {
            let updateBook = books[result]
            updateBook.title = booktitle
            updateBook.year = year
            updateBook.author.name = name
            updateBook.books = allbooks

            return books.splice(result, 1, updateBook)

        } else {
            return books

        }


    },
    deleteBook(_, args, ctx) {
        let { books } = ctx
        let result = books.filter(book => book.title.trim().toLowerCase() !== args.title.trim().toLowerCase())
        if (!result) return
        return {
            success: true,
            message: "successfully deleted",
            books: result
        }
    },
    async createPost(_, { content }, { Post, user}) {
        try {

            if (!user) throw new AuthenticationError("User is not authenticated")

            let { text } = content
            if (!text) throw new UserInputError("Text field is Invalid")
            let newPost = {
                name: user.name,
                user: user.id,
                text
            }

             await Post.create(newPost)

            // pubsub.publish('POST_CREATED', { postCreated: args }); 
            // pubsub.publish('POST_CREATED', {
            //     postCreated: post
            //   });

            let posts = await Post.find({ user: user.id })
            return posts
        } catch (error) {
            throw new ApolloError(error.message, 500)

        }


    },
    async addComment(_, { id, content }, { Post, user }) {
        try {

            if (!user) throw new AuthenticationError("User is not authenticated")

            let post = await Post.findById(id)
            if (!post) throw new Error("post does not exist")

            // adding comment
            let { text } = content
            let comment = {
                user: user.id,
                text,
                name: user.name,

            }
            post.comments.unshift(comment)

            await post.save()

            let posts = await Post.find({ user: user.id })
            return posts

        } catch (error) {
            throw new ApolloError(error.message, 500)

        }

    },
    async likePost(_, { id }, { Post, user }) {
        try {
            if (!user) throw new AuthenticationError("User is not authenticated")

            let post = await Post.findById(id)
            if (!post) throw new Error("post does not exist")

            //liking and unliking
            const like = post.likes.find(likes => likes.user.toString() === user.id)
            if (!like) {
                post.likes.unshift({ user: user.id })
                await post.save()
                // console.log(post.likes)
            } else {
                const findIndex = post.likes.findIndex(likes => likes.user.toString() === user.id)
                // console.log(findIndex)
                post.likes.splice(findIndex, 1)
                await post.save()

            }

            let posts = await Post.find({ user: user.id })
            return posts

        } catch (error) {
            throw new ApolloError(error.message, 500)

        }

    },
    async deleteComment(_, { post_id, comment_id }, { Post, user, User }) {

        try {
            if (!user) throw new AuthenticationError("User is not authenticated")

            let post = await Post.findById(post_id)
            // console.log('post', post)

            const comment = post.comments.find(comment => comment.id === comment_id)
            // console.log('comment', comment) 

            if (!comment) throw new Error("comment does not exist")

            // check if comment is owned by the user
            let role = await User.findById(user.id)

            if (comment.user.toString() !== user.id || role.role !== 'ADMIN') throw new ForbiddenError("User is not authorized to delete")

            const findIndex = post.comments.findIndex(comment => comment.id === comment_id)
            // console.log('findIndex', findIndex)
            post.comments.splice(findIndex, 1)
            await post.save()
            let posts = await Post.find({ user: user.id })
            return posts



        } catch (error) {
            throw new ApolloError(error.message, 500)

        }
    }
}

module.exports = Mutation