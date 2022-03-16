const Important = {
    __resolveType(important,context,info){
        // console.log(context);
        // console.log(important);
        let{recognized} = important
        // console.log('rec' ,recognized);
        
        // since the book type would have been splitted to recognized and UnRecognized

        if(recognized) return "Recognized" ;
        if(!recognized) return "UnRecognized" 
        return null;
    }
}

module.exports= Important