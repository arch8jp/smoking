
const client = require('cheerio-httpcli');
const http = require('http');
const fs = require('fs');
const url = require('url');
const ejs = require('ejs');
const qs = require('querystring');

const index_page = fs.readFileSync("./index.ejs", "utf8");
const normalize_css = fs.readFileSync('./public/stylesheet/normalize.css', "utf8");
const style_css = fs.readFileSync('./public/stylesheet/style.css', "utf8");

var server = http.createServer(getFormClient);
server.listen(3000);

console.log("Server Start!");

///////////////////////////ここまでがメインプログラム

// Googleで「data.msg」について検索する。




function getLatLng(request, response, word) {
    var lat = "34.397667";
    var lng = "132.475379";
    client.fetch('https://www.geocoding.jp/', { q: word }, function (err, $, res, body) {

        //HTML緯度経度を表示ここで文字を抽出
        lat = $("span[class=latlng]").text().split(" ", 2)[1];
        lng = $("span[class=latlng] b:nth-child(2)").text();

        write_index(request, response, lat, lng, word);
    });

}

function getFormClient(request, response) {
    var url_parts = url.parse(request.url, true);
    switch (url_parts.pathname) {
        case "/":
            response_index(request, response);
            break;
        case "/normalize.css":
            response.writeHead(200, { "Content-Type": "text/css" });
            response.write(normalize_css);
            response.end();
            break;
        case "/style.css":
            response.writeHead(200, { "Content-Type": "text/css" });
            response.write(style_css);
            response.end();
            break;
        case "/images/back.png":
            response.writeHead(200, { "Content-type": "text/png" });
            response.end(fs.readFileSync("./public/images/back.png"));
            break;

        case "/images/back_mob.png":
            response.writeHead(200, { "Content-type": "text/png" });
            response.end(fs.readFileSync("./public/images/back_mob.png"));
            break;
        case "/images/smoking.png":

            response.writeHead(200, { "Content-Type": "text/png" });
            response.end(fs.readFileSync("./public/images/smoking.png"));

        default:
            response.writeHead(200, { "Content-Type": "text/plian" });
            response.end("no  page...");
            break;
    }
}



function response_index(request, response) {
    var data = { msg: "広島駅" };
    var body = "";
    if (request.method == "POST") {
        request.on("data", (data) => {
            body += data;
        });

        request.on("end", () => {
            data = qs.parse(body);
            getLatLng(request, response, data.msg);

        });
    } else {
        write_index(request, response, "34.397667", "132.475379", data.msg);
    }
}

function write_index(request, response, lat, lng, word) {
    var content = ejs.render(index_page, {
        content: word,
        content1: lat,
        content2: lng,
        content3: 'https://www.google.com/maps/d/embed?mid=1nfJ4qICIxHyiVMtdFl2Un8iSBXtCVT2I&ll=' + lat + ',' + lng + '&z=18',
    });
    response.writeHead(200, { "Content-Type": "text/html" });
    response.write(content);
    response.end();
}

