const express = require("express");
const fileupload = require("express-fileupload");
const Caver = require("caver-js");
var caver;
const fs = require("fs");
const execSync = require("child_process").execSync;
require("dotenv").config();

const app = express();

app.use(fileupload());
app.use(express.static("files"));

const DLC = require(__dirname + "/../../contract/build/contracts/DLC.json");

if (process.env.GATSBY_MODE == "testnet") caver = new Caver("https://public-node-api.klaytnapi.com/v1/baobab");
else caver = new Caver("https://public-node-api.klaytnapi.com/v1/cypress")

const contract = new caver.contract(DLC.abi, DLC.networks[process.env.GATSBY_MODE == "testnet" ? "1001" : "8217"].address);

var result: any = {};
setInterval(async () => {
    try {
        result = await contract.methods.getInformation().call();
    } catch (e: any) {
        console.log(e);
    }
}, 1000);

app.listen(process.env.BACK_PORT, () => {
    console.log("start", process.env.BACK_PORT);
});

app.get("/price", function (req: any, res: any) {
    var tmp = req;
    res.send(result[1]);
});
app.get("/curCount", function (req: any, res: any) {
    var tmp = req;
    res.send(result[0]);
});
app.get("/maxCount", function (req: any, res: any) {
    var tmp = req;
    res.send(result[4]);
});
app.get("/time", function (req: any, res: any) {
    var tmp = req;
    res.send(result[2]);
});
app.get("/presenttime", async function (req: any, res: any) {
    var tmp = req;
    res.send(Math.floor(Date.now() / 1000).toString() + "000");
});
app.get("/maxAmount", function (req: any, res: any) {
    var tmp = req;
    res.send(result[3]);
});
app.get("/whiteList", function (req: any, res: any) {
    var tmp = req;
    res.send(result[5]);
});
app.get("/klay", function (req: any, res: any) {
    var tmp = req;
    res.send(result[6]);
});
app.get("/airdrop", function (req: any, res: any) {
    var tmp = req;
    res.send(result[7]);
});
app.get("/whiteAddress", function (req: any, res: any) {
    var tmp = req;
    res.send(result[8]);
});
app.get("/logo", function (req: any, res: any) {
    var tmp = req;
    res.send(fs.readFileSync(__dirname + "/../images/logo.png"));
});
app.get("/image", function (req: any, res: any) {
    var tmp = req;
    res.send(fs.readFileSync(__dirname + "/../images/image.png"));
});
app.get("/story", function (req: any, res: any) {
    var tmp = req;
    res.send(fs.readFileSync(__dirname + "/story.txt", "utf8"));
});
app.get("/csv", function (req: any, res: any) {
    var tmp = req;
    res.send(fs.readFileSync(__dirname + "/csvLength.txt", "utf8"));
});
app.get("/csvPresent", function (req: any, res: any) {
    var tmp = req;
    res.send((Number(fs.readFileSync(__dirname + "/csvLength.txt", "utf8")) - Number(execSync("wc -l < " + __dirname + "/list.csv"))).toString());
});
app.get("/minting", function (req: any, res: any) {
    var amount = req.query.amount;
    var pw = req.query.pw;

    if (pw == "0C3406863A4652D891868A7B920F67C433BB2B6CE06CE708D8FE903C03966526") {
        try {
            var list = execSync("sed -n '1," + Number(amount) + "p' " + __dirname + "/list.csv")
                .toString()
                .split("\n");

            var tokenId = [];
            var uri = [];
            for (var i = 0; i < list.length; i++) {
                if (list[i] != "") {
                    tokenId.push(list[i].split(",")[0]);
                    uri.push(list[i].split(",")[1]);
                }
            }
            res.send([tokenId, uri]);
        } catch (e) {
            res.send("failed");
        }
    } else {
        res.send("failed");
    }
});
app.get("/minting/success", function (req: any, res: any) {
    var amount = req.query.amount;
    var pw = req.query.pw;

    if (pw == "0C3406863A4652D891868A7B920F67C433BB2B6CE06CE708D8FE903C03966526") {
        execSync("sed -i '1," + amount + "d' " + __dirname + "/list.csv");
        res.send("success");
    } else {
        res.send("failed");
    }
});

app.post("/logo", function (req: any, res: any) {
    let file = req.files.file;

    file.mv(__dirname + "/../images/logo.png", (err: any) => {
        if (err) {
            return res.status(500).send({ message: "파일 전송 실패", code: 200 });
        }
        res.status(200).send({ message: "파일 전송 성공", code: 200 });
    });
});
app.post("/image", function (req: any, res: any) {
    let file = req.files.file;

    file.mv(__dirname + "/../images/image.png", (err: any) => {
        if (err) {
            return res.status(500).send({ message: "파일 전송 실패", code: 200 });
        }
        res.status(200).send({ message: "파일 전송 성공", code: 200 });
    });
});
app.post("/story", function (req: any, res: any) {
    let file = req.files.file;

    file.mv(__dirname + "/story.txt", (err: any) => {
        if (err) {
            return res.status(500).send({ message: "파일 전송 실패", code: 200 });
        }
        res.status(200).send({ message: "파일 전송 성공", code: 200 });
    });
});
app.post("/csv", function (req: any, res: any) {
    let file = req.files.file;

    file = file.data.toString().trim().replace(/\r/g, "");
    console.log(file);

    fs.writeFileSync(__dirname + "/list.csv", file);

    for (var i = 0; i < 5; i++) execSync("shuf " + __dirname + "/list.csv -o " + __dirname + "/list.csv");
    execSync("wc -l < " + __dirname + "/list.csv > " + __dirname + "/csvLength.txt");

    res.send("Success Uploading");
});

export {};
