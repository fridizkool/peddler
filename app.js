var http = require("http");
var fs = require("fs");

const hostname = '127.0.0.1';
const port = 3000;

/* Create an HTTP server to handle responses */
/* Use a File System to render the html page (index.html) in the server window */

fs.readFile('./index.html', function(err, html) {
  if(err) {
    throw err;
  }
  http.createServer(function(request,response) {
    response.writeHeader(200, {"Content-Type": "text/html"});  
    response.write(html);  
    response.end();
  }).listen(port, () => {
    console.log(`Server running at localhost:${port}`);
  });
});