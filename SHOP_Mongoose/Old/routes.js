const file = require('fs');

const requesthandler = (req, res) => {
const url = req.url;
const method = req.method;
if(url === '/')
{
    res.write('<html>');
    res.write('<head><title>Enter Message</title></head>');
    res.write('<body><div><form action="/message" method="POST"><input type="text" name="messsage"><button type="submit">Send</button></form></div></body>');
    res.write('</html>');
    return res.end();
}

if(url === '/message' && method === 'POST')
{
    let body = [];
    req.on('data', (chunk) =>{
        console.log(chunk);
        body.push(chunk);
    });
    return req.on('end', () => {
        let parseBody = Buffer.concat(body).toString();
        console.log(parseBody);
        let message = parseBody.split('=')[1];
        let puremessage = message.replace(/[+]/g, " ");
        file.writeFileSync('newfile.txt', puremessage, (err) => {
            res.statusCode = 302;
            res.setHeader('Location', '/');
            return res.end();
        });

    });        
}
res.setHeader('Content-Type', 'text/html');
res.write('<html>')
res.write('<head><title>Trial NodeJs</title></head>')
res.write('<body><div><h1>This is the Trial text</h1></div></body>')
res.write('</html>')
res.end();
}

module.exports = requesthandler;