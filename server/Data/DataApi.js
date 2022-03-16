const { RESTDataSource } = require('apollo-datasource-rest');


class StarwarsAPI extends RESTDataSource {
  constructor() {
    // Always call super()
    super();
    // Sets the base URL for the REST API
    this.baseURL = 'https://swapi.dev/api/';
    // this.baseURL = 'https://jsonplaceholder.typicode.com/';
  }

  //
  // willSendRequest(request) {
  //   request.headers.set('Authorization', this.context.token);
  // }

  async getAllPeople(){
    return this.get('people')
  }
  
  async getOne(id) {
    // Send a GET request to the specified endpoint
    return this.get(`people/${id}`);
  }

  async getMovies(limit = 2) {
    const data = await this.get('films', {
      // Query parameters
      per_page: limit,
      order_by: 'release_date',
    });
    console.log(data);;
    // return data;
  }
}

module.exports = StarwarsAPI