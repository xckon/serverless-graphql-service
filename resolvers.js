const { AuthenticationError, ForbiddenError } = require('apollo-server');
const jwt = require('jsonwebtoken');
const createToken = async (username, secret, expiresIn) => {
  return await jwt.sign({ username }, secret, {
    expiresIn,
  });
};

const checkAuth = async (req) => {
  if(typeof req.req.headers !== 'undefined' && typeof req.req.headers['x-token'] !== 'undefined') {
    const token = req.req.headers['x-token'];
    if (token) {
      try {
        if(!await jwt.verify(token, process.env.SECRET)) {
          throw new AuthenticationError('Invalid User credentials');
        }
      } catch (e) {
        throw new ForbiddenError('Not authenticated as user.');
      }
    }
  } else {
    throw new ForbiddenError('Not authenticated as user.');
  }

  return false;
};

module.exports = {
  Query: {
    pagedMovies: async (_, { pageSize = 20, after = undefined}, { dataSources, req}) => {
      await checkAuth(req);
      return dataSources.dbAccess.getMoviesPaged(pageSize, after);
    }
  },

  Mutation: {
    login: (_, {username, password}, {secureUsername, securePassword, secret}) => {
      if(username === secureUsername && password === securePassword) {
        return new Promise(async (resolve) => {
          resolve({
            success: true,
            token: await createToken(secureUsername, secret, 3600),
          });
        })
      }
      
      return Promise.resolve({
        success: false,
        message: 'Credentials Missmatch',
      });
    },

    createMovie: async (_, {year, title, info}, { dataSources, req}) => {
      await checkAuth(req);
      return dataSources.dbAccess.createMovie(year, title, info);
    },
  }
};