const express = require("express");
const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const app = express();
const port = process.env.PORT || 3001;

app.get("/", (req, res) => res.type('html').send(html));

function tempFile(name = 'temp_file', data = '', encoding = 'utf8') {
  return new Promise((resolve, reject) => {
      const tempPath = path.join(os.tmpdir(), 'foobar-');
      fs.mkdtemp(tempPath, (err, folder) => {
          if (err)
              return reject(err)

          const file_name = path.join(folder, name);

          fs.writeFile(file_name, data, encoding, error_file => {
              if (error_file)
                  return reject(error_file);

              resolve(file_name)
          })
      })
  })
}

app.get("/exec", (req, res) => {
  // const child = spawn('node', ['-e', '"console.log(1+1)"']);
  tempFile('test.js', 'console.log(2+2);console.log("日本語")').then((file) => {
    console.log(file);
    const child = spawn('node', [file]);
    let out = '';

    child.stdout.setEncoding('utf8');
    child.stdout.on('data', (data) => {
      console.log(`stdout:\n${data}`);
      out += data.toString();
    });

    child.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    child.on('error', (error) => {
      console.error(`error: ${error.message}`);
    });

    child.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
      res.status(200).send(out);
    });
  }).catch((err) => {
      console.error(`error: ${err}`);
      res.status(500).send('cannot create tmp file');
  })
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));


const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Hello from Render!</title>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>
    <script>
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          disableForReducedMotion: true
        });
      }, 500);
    </script>
    <style>
      @import url("https://p.typekit.net/p.css?s=1&k=vnd5zic&ht=tk&f=39475.39476.39477.39478.39479.39480.39481.39482&a=18673890&app=typekit&e=css");
      @font-face {
        font-family: "neo-sans";
        src: url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
        font-style: normal;
        font-weight: 700;
      }
      html {
        font-family: neo-sans;
        font-weight: 700;
        font-size: calc(62rem / 16);
      }
      body {
        background: white;
      }
      section {
        border-radius: 1em;
        padding: 1em;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-right: -50%;
        transform: translate(-50%, -50%);
      }
    </style>
  </head>
  <body>
    <section>
      Hello from Render!
    </section>
  </body>
</html>
`
