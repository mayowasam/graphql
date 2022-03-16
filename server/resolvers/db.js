const books = [
    {
      title: 'The Awakening',
      author: 'Kate Chopin',
      year: "2021", 
      version: "available",
      recognized: true
    },
    {
      title: 'City of Glass',
      author: 'Paul Auster',
      year: "2019", 
      version: "available",
      star: "1"
    },

    {
        title: 'The Legend of zorro',
        author: 'Kate Chopin',
        year: "2003", 
        version: "not_available",
        recognized: true

      },
      {
        title: 'Forget sarah',
        author: 'Paul Auster',
        year: "2000", 
        version: "not_available",
        star: "3"

      },
  ];

  const authors = [
    {name: "Paul Auster"},
    {name: "Kate Chopin"},
    {name: "Mayowa"},

  ]

  module.exports = {
    books,
    authors
  }