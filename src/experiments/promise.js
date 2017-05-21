var http = require("http");

http.ClientRequest.prototype.then = function (executor) {
  return new Promise((resolve, reject) => {
    this.on("response", function (response) {
      response.setEncoding("utf8");

      var body = "";

      response.on("data", (data) => {
        body += data;
      });

      response.on("end", () => {
        resolve(executor(body));
      });
    });

    this.on("error", (error) => reject(error));
  });
};

http.get("http://mike-austin.com", (data) => {
  console.log(data);
});

http.get("http://mike-austin.com").then((data) => {
  console.log(data);
}).then(() => console.log("Done."));

/*

Promises are asynchronous
Continuations are lazy
Add-hoc chaining
Push vs pull

http.get("http://mike-austin.com") | data => console.log(data);

"a,b,c" | .split(",") | .toUpperCase();

*/

