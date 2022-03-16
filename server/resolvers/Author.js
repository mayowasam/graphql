const Author = {
    books(parent, args, { books }) {

        // console.log(dataSources);
        // let { books } = dataSources
        // console.log(parent);
        return books.filter(book => book.author === parent.name)

    }
}

module.exports = Author