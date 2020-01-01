const { gql } = require('apollo-server');

const typeDefs = gql`
  scalar Date

  type MovieInfo {
    directors: [String],
    release_date: Date!,
    rating: Float!,
    genres: [String],
    image_url: String!
    plot: String!
    rank: Int!
    running_time_secs: Int!
    actors: [String]
  }

  input MovieInfoInput {
    directors: [String],
    release_date: Date!,
    rating: Float!,
    genres: [String],
    image_url: String!
    plot: String!
    rank: Int!
    running_time_secs: Int!
    actors: [String]
  }

  type Movie {
    year: Int
    title: String
    info: MovieInfo
  }

  type Query {
    pagedMovies(
      pageSize: Int
      after: String
    ): PagedMovies!
  }

  type Mutation {
    login(
      username: String!
      password: String!
    ): UserToken!

    createMovie(
      year: Int!
      title: String!
      info: MovieInfoInput!
    ): CreateUpdateMovie!
  }

  type PagedMovies { # add this below the Query type as an additional type.
    cursor: String!
    hasMore: Boolean!
    movies: [Movie]!
  }

  type CreateUpdateMovie {
    movie: Movie
    success: Boolean!
    message: String!
  }

  type UserToken {
    success: Boolean!,
    message: String,
    token: String
  }
`;

module.exports = typeDefs;