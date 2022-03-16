import { useQuery } from '@apollo/client'
import { GET_BOOKS } from '../endpoints/query'
import FileForm from './FileForm';


function Home() {
    const { data, loading, error } = useQuery(GET_BOOKS)

    console.log(data);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error ....</p>;
    let { books } = data.books

    return <div>

        <FileForm/>
        {data && books.map((book, index) => {
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

        })}
    </div>


}

export default Home