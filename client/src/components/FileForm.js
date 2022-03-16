import {useEffect, useState} from 'react'
import {gql, useMutation} from '@apollo/client'


const UPLOAD_FILE= gql`
mutation UploadFile($file: Upload!) {
  uploadFile(file: $file){
    filename
    mimetype
    encoding
    link
  }
}`


function FileForm (){
    const  [val, setVal ] = useState("")
    const [upload, {error,data}] = useMutation(UPLOAD_FILE)

    if (data) console.log('data', data);
    if (error) console.log('error', error.message);

    useEffect(() => {
        if (data) setVal("")

    },[data])

    const handleSubmit = e => {
        e.preventDefault()
        upload({
            variables:{
                file: val
            }
        })

        setVal("")

    }
    console.log(val);

    return (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
            <input type="file" name="file" onChange={e => setVal(e.target.files[0])}/>
            <button>Submit</button>
        </form>

    )

}

export default FileForm