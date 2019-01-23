const client = require("cheerio-httpcli");
const http = require("http");
const fs = require("fs");
const url = require("url");
const ejs = require("ejs");
const qs = require("querystring");

const index_page = fs.readFileSync("./index.ejs", "utf8");
const style_css = fs.readFileSync("./style.css", "utf8");

var server = http.createServer(getFormClient);
const port = process.env.PORT || 3000;
server.listen(port);

console.log("Server Start!");

///////////////////////////ここまでがメインプログラム

// Googleで「data.msg」について検索する。

var lat = "34.397667";
var lng = "132.475379";

function getLatLng(request, response, word) {
  client.fetch("https://www.geocoding.jp/", { q: word }, function(
    err,
    $,
    res,
    body
  ) {
    //HTML緯度経度を表示ここで文字を抽出
    lat = $("span[class=latlng]")
      .text()
      .split(" ", 2)[1];
    lng = $("span[class=latlng] b:nth-child(2)").text();

    write_index(request, response);
  });
}

function getFormClient(request, response) {
  var url_parts = url.parse(request.url, true);
  switch (url_parts.pathname) {
    case "/":
      response_index(request, response);
      break;
    case "/style.css":
      response.writeHead(200, { "Content-Type": "text/css" });
      response.write(style_css);
      response.end();
      break;
    case "/images/back.png":
      response.writeHead(200, { "Content-type": "text/png" });
      response.end(fs.readFileSync("./images/back.png"));
      break;
    default:
      response.writeHead(200, { "Content-Type": "text/plian" });
      response.end("no  page...");
      break;
  }
}

var data = { msg: "広島駅" };

function response_index(request, response) {
  var body = "";
  if (request.method == "POST") {
    request.on("data", data => {
      body += data;
    });

    request.on("end", () => {
      data = qs.parse(body);
      getLatLng(request, response, data.msg);
    });
  } else {
    write_index(request, response);
  }
}

function write_index(request, response) {
  var content = ejs.render(index_page, {
    content: data.msg,
    content1: lat,
    content2: lng,
    content3:
      "https://www.google.com/maps/d/embed?mid=1nfJ4qICIxHyiVMtdFl2Un8iSBXtCVT2I&ll=" +
      lat +
      "," +
      lng +
      "&z=18"
  });
  response.writeHead(200, { "Content-Type": "text/html" });
  response.write(content);
  response.end();
}
