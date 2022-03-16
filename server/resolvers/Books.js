const Book = {
    author(parent, arg, {authors}){
        // console.log(parent);
        // let {authors} = dataSources
       
        return authors.find(author => author.name ===parent.author)
    }
}

module.exports= Book