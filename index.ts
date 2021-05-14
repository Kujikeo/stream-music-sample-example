import express from "express";
import fs from "fs";
import path from "path";

const app = express();
app.get("/", (req, res) => {
  return res.sendFile(__dirname + "/index.html");
});

app.get("/stream", (req, res) => {
  const range = req.headers.range;
  const songPath = path.resolve(
    __dirname,
    "musics",
    "Palmboi - DEAD HOMIES GO TO SPACE (Kuoga. Remix)_160k.mp3"
  );

  const songSize = fs.statSync(songPath).size;

  const start = Number(range?.replace(/\D/g, ""));
  const CHUNK_SIZE = 10000;
  const end = Math.min(start + CHUNK_SIZE, songSize - 1);
  const header = {
    "Content-Range": `bytes ${start}-${end} / ${songSize}`,
    "Accept-Ranges": "bytes",
    "Content-type": "audio/mpeg",
  };

  res.writeHead(206, header);
  const songStream = fs.createReadStream(songPath, { start: start, end: end });

  songStream.pipe(res);
});

app.listen(3334);
