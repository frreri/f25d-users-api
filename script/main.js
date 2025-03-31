'use strict';

import { UserApp } from './app.js';

// Running below code in a block to give it a private scope, app will not be reachable directly from console in browser
{
  const container = document.getElementById('user-container');
  const search = document.getElementById('search-input');

  // Instantiating and initializing the app
  const app = new UserApp(
    'https://jsonplaceholder.typicode.com/users',
    container,
    search,
  );
  app.initialize();
}
