var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

function templeteHtml(title, list, body, control) {
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${control}
    ${body}
  </body>
  </html>
  `;
}

function templeteList(fileList) {
  var list = `<ul>`;
  for (var i = 0; i < fileList.length; i++) {
    list += `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`;
  }
  list += '</ul>';
  return list;
}

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryDate = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if (pathname === '/') {
      if (queryDate.id === undefined) {
         fs.readdir('data',function (error, fileList) {
           var title = 'Welcome!';
           var description = 'Hello, Node.JS!';
           var list = templeteList(fileList);
           var templete = templeteHtml(title, list, `
             <h2>${title}</h2>${description}`,
             `<a href="/create">Create</a>`
           );
           response.writeHead(200);
           response.end(templete);
         })
      } else {
        fs.readdir('data',function (error, fileList) {
        fs.readFile(`data/${queryDate.id}`,'utf8',function (err, description) {
          var list = templeteList(fileList);
          var title = queryDate.id;
          var templete = templeteHtml(title, list,
          `<h2>${title}</h2>${description}`,
          `<a href="/create">Create</a>
           <a href="/update?id=${title}">Update</a>
           <form action="delete_process" method="post">
              <input type="hidden" name="id" value="${title}">
              <input type="submit" value="Delete">
           </form>
           `);
          response.writeHead(200);
          response.end(templete);
        });
       });
      }
    } else if(pathname === '/create'){
      fs.readdir('data',function (error, fileList) {
        var title = 'Welcome!';
        var list = templeteList(fileList);
        var templete = templeteHtml(title, list, `
          <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="Title"></p>
            <p>
              <textarea name="description" placeholder="Description"></textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>`
        ,'');
        response.writeHead(200);
        response.end(templete);
      });
    }else if (pathname === '/create_process') {
      var body = '';
      request.on('data',function (data) {
        body += data;
      });
      request.on('end',function () {
        var post = qs.parse(body);
        var title = post.title;
        var description = post.description;
        fs.writeFile(`data/${title}`, description, 'utf8',function (err) {
          // 글 생성
          response.writeHead(302,{Location: `/?id=${title}`});
          response.end();
        })
      });
    } else if (pathname === '/update') {
      fs.readdir('data',function (error, fileList) {
      fs.readFile(`data/${queryDate.id}`,'utf8',function (err, description) {
        var list = templeteList(fileList);
        var title = queryDate.id;
        var templete = templeteHtml(title, list,
          `  <form action="/update_process" method="post">
              <input type="hidden" name="id" value="${title}">
              <p><input type="text" name="title" placeholder="Title" value="${title}"></p>
              <p>
                <textarea name="description" placeholder="Description">${description}</textarea>
              </p>
              <p>
                <input type="submit">
              </p>
            </form>`,
        `<a href="/create">Create</a> <a href="/update?id=${title}">Update</a>`);
        response.writeHead(200);
        response.end(templete);
      });
     });
   }else if (pathname === '/update_process') {
     var body = '';
     request.on('data',function (data) {
       body += data;
     });
     request.on('end',function () {
       var post = qs.parse(body);
       var id = post.id;
       var title = post.title;
       var description = post.description;
       // 글 수정
       fs.rename(`data/${id}`,`data/${title}`,function (error) {
         fs.writeFile(`data/${title}`, description, 'utf8',function (err) {
           response.writeHead(302,{Location: `/?id=${title}`});
           response.end();
         })
       })
     });
   }else if (pathname === '/delete_process') {
     // 글 삭제
     var body = '';
     request.on('data',function (data) {
       body += data;
     });
     request.on('end',function () {
       var post = qs.parse(body);
       var id = post.id;
       fs.unlink(`data/${id}`,function (error) {
         response.writeHead(302,{Location: `/`});
         response.end();
       })
     });
   } else {
      response.writeHead(404);
      response.end('Not Found');
    }
});
app.listen(3000);
