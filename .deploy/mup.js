module.exports = {
  servers: {
    one: {
      host: '139.59.2.104',
      username: 'root',
      password: 'Abh!$hek1'
    }
  },

  app: {
    name: 'hungertruck',
    path: '../../hungertruck',
    volumes: {
      // passed as '-v /host/path:/container/path' to the docker run command
      '/root/uploads': '/Users/abhishekmaurya/uploads',
    //  '/second/host/path': '/second/container/path'
    },

    servers: {
      one: {},
    },

    buildOptions: {
      serverOnly: true,
      debug: false
    },

    env: {
      ROOT_URL: 'https://hungertruck.in',
      MONGO_URL: 'mongodb://localhost/meteor',
    },

    docker: {
      image: 'abernix/meteord:node-8.9.4-base', //required for meteor 1.6
      buildInstructions: [
        'RUN apt-get update && apt-get install -y imagemagick'
      ],
    },
    deployCheckWaitTime: 120,
    enableUploadProgressBar: true
  },
  proxy: {
    domains: 'hungertruck.in,www.hungertruck.in',
    ssl: {
      forceSSL: true,
      letsEncryptEmail: 'akmnitt@gmail.com'
    }
  },

  mongo: {
    port: 27017,
    version: '3.6.4',
    servers: {
      one: {}
    }
  }
};
