import { useQuery } from '@apollo/client'
import { GET_BOOKS } from '../endpoints/query'
import FileForm from '../components/FileForm';
import { useLocation } from 'react-router-dom';


function Home() {
    const { data, loading, error } = useQuery(GET_BOOKS,{
        // skip:  do not run if a params  is this
    })

    // let { books } = data.books
    let location =useLocation()
    console.log(location);

    return <div>

        {error && <p>Error due to ${error.message}....</p>}
        <FileForm />
        {loading ? <p>Loading...</p> : (
           data && data.books.books.map((book, index) => {
                const { recognized, star, title, version, year, author: { name, books } } = book
                return <div key={index + 1}>
                    <h1>Title : {title}</h1>
                    <p>recognized: {recognized}</p>
                    <p>star : {star}</p>
                    <p>version : {version}</p>
                    <p>year : {year}</p>
                    <p>Author : <strong>{name}</strong></p>
                    <ul >
                        {books && books.map((book, index) => (
                            <li key={index + 1}>{book.title}</li>
                        ))}
                    </ul>
                    {/* {name} */}
                    <br />
                </div>

            })
        )}




    </div>


}

export default Home