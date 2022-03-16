import { useQuery } from '@apollo/client'
import {IMPORTANT} from '../endpoints/query'


function Important() {
    const { data, loading, error } = useQuery(IMPORTANT)

    console.log(data);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error ....</p>;
    let {important} = data

return <div>
    {data && important.map((f, index) => {
        const  {recognized, star, title, version, year} = f
        return <div key={index +1}>
            <h1>Title : {title}</h1>
           {recognized && <p>recognized</p>} 
            { star && <p>star : {star}</p> }
            <p>version : {version}</p>
            <p>year : {year}</p>
            
            <br/>
        </div>

    })}
</div>
   

}

export default Important