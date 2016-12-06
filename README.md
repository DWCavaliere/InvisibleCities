Drawing interface for [Invisible Cities](http://opendot.github.io/ml4a-invisible-cities/), using [pix2pix](https://github.com/phillipi/pix2pix), [p5.js](http://p5js.org), and [node](https://nodejs.org/en/). 

Watch it in action [here](https://vimeo.com/194531286).

First install node modules.

    npm install

Train a new model, referring to the instructions in the [readme in pix2pix](https://github.com/phillipi/pix2pix). Models for Seoul and Venice will be made available shortly.

Launch the server with node:

	node app.js
	
then go over to `localhost:5000`. If you want to run it over a different port, then:

    PORT=8090 node app.js

