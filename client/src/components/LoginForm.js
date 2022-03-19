import { gql, useLazyQuery } from "@apollo/client"
import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"


const LOGIN = gql`
query Login($content: LoginInput) {
    login(content:$content){
    success
    message
    accessToken
    refreshToken
    successWithMessage @client
    user {
      id
      name
      email
      age
    }
  }
    

}
`

function LoginForm() {
    const [formData, setFormData] = useState()
    const [Login, { loading, error, data }] = useLazyQuery(LOGIN)

    const handleSubmit = e => {
        e.preventDefault()
        Login({
            variables: {
                content: formData
            }
        })
    }

    useEffect(()=>{
       if (data && data.login.success) {
           localStorage.setItem("accessToken", data.login.accessToken)
       }

    },[data])
    console.log(data );
    console.log(data && data.login.successWithMessage );
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" name="email" placeholder="email" onChange={e => setFormData({ ...formData, [e.target.name]: e.target.value })} />
                <br />
                <input type="text" name="password" placeholder="password" onChange={e => setFormData({ ...formData, [e.target.name]: e.target.value })} />
                <br />
                <button>Submit</button>
            </form>



            {error && <p>Error due to ${error.message}....</p>}
            {loading && <p>Loading...</p> }
            {/* {data && data.login.success &&   <Navigate to="/home" replace={true} state={data.login.user}/> } */}

            
                {/* {data && data.login.success  && data.books.books.map((book, index) => {
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
                        <br />
                    </div>

                })} */}
            
        </div>
    )
}

export default LoginForm