const { finished } = require('stream/promises');
const { join, parse } = require("path");
const { ApolloError } = require('apollo-server-core');
const jwt = require("jsonwebtoken")


const Mutation = {
    register: async (_, { content }, {User}) => {
        let { email } = content
        try {

            let user = await User.findOne({ email })
            if (user) throw new Error("user already exist")

            user = await User.create(content)
            let payload = {
                user: {
                    id: user._id,
                    email
                }
            }

            let accessToken = await jwt.sign(payload, process.env.ACCESS_TOKEN,{expiresIn :"2m"})
            const refreshToken = await jwt.sign(payload, process.env.REFRESH_TOKEN,{expiresIn :"30m"})

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
        console.log(file);
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
    }
}

module.exports = Mutation