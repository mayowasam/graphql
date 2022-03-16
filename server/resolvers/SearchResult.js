const SearchResult = {
    __resolveType(obj,context,info){
        // console.log(context);
        console.log(obj);
        if(obj.name){
            return 'Author'
        }
        if(obj.version){
            return 'Book'
        }


        return null
    }
}

module.exports = SearchResult