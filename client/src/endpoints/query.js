import { gql} from '@apollo/client'

export const GET_BOOKS = gql`
query Query {
  books {
    success
    message
    books {
      author {
          name
        books {
          title
        }
      }
      recognized
      star
      title
      version
      year
    }
  }
 }
`
export const GET_RECOGNZED=gql `
query Recognized {
    recognized {
      title
      year
    }
  }
`
  
export const GET_UNRECOGNZED=gql `

  query Unrecognized {
    unrecognized {
      title
      year
      version
    }
  }
`
export const FRAGMENT_FIELDS = gql`
  fragment FragmentName on Important{
     title
      year 
      version
  }
`;

export const IMPORTANT= gql`  
${FRAGMENT_FIELDS}

  query Important{
    important {
    ...FragmentName
    title
      year 
      version
      ... on Recognized {
        recognized
  
      }
      ... on UnRecognized {
        star
      }
    }
  }
`
