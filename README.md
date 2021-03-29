# Simple Terminal Chat

A simple terminal chat built on JSExpertWeek 3.0 presented by Erick Wendel ([Original Project](https://github.com/ErickWendel/semana-js-expert30)).

 ## Run the server

Inside server folder run the following command to start the server on http://localhost:9898 :
~~~
npm start
~~~

To run in a custom port, set an environment variable PORT.

#### Deploy on Heroku

Create an account on [Heroku](https://www.heroku.com) and install the npm package :

~~~
npm i -g heroku
~~~

Log on your account from the terminal with :

~~~
heroku login
~~~

Create the application :

~~~
heroku apps:create simple-terminal-chat
~~~

In the server folder, start a new git repository and push to heroku generated repository :

~~~
git init
git add .
git commit -m "Initial commit"
git push heroku master
~~~

Use 'heroku open' to open the server on your browser with the url generated by Heroku. If the plain text 'Up and running' was printed on browser, the server was deployed successfully.

To remove the app from Heroku, use :

~~~
heroku apps:delete --confirm simple-terminal-chat
~~~

 #### Run the client

Inside client folder run the following command to start with default configuration ('userOne', 'roomOne', 'http://localhost:9898') :
~~~
npm start
~~~

Or in the root folder run using your custom configuration :
~~~
node /client/index.js --username userOne --room roomOne --host http://localhost:9898
~~~

Run 'npm link' on client folder to create the command 'simple-terminal-chat'.
Run 'npm unlink -g {package_name}' to remove the command.

### Publish on npm

Set the package name, version and description on packages.json file in the client folder.

Create an account on [NPM](https://www.npmjs.com/) and to publish the package use the following commands :

~~~
npm login
npm publish --access public
~~~

To install the published package use :

~~~
npm i -g {package_name}
~~~

To unpublish the package use :

~~~
npm unpublish --force
~~~

## Built with

The following tools, languages, frameworks, etc were used to build this project :

 - [Node.js](https://nodejs.org/)
 - [Visual Studio Code](https://code.visualstudio.com/)
 - [npm](https://www.npmjs.com/)
 - [Blessed](https://www.npmjs.com/package/blessed)