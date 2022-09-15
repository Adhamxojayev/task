import protoLoader from '@grpc/proto-loader';
import swaggerDoc from './swagger/index.js';
import express from 'express';
import 'dotenv/config';
import grpc from 'grpc';
import path from "path";
const PORT = process.env.PORT ?? 5000;
const app = express();
app.use(express.json());
app.use(swaggerDoc);


const messageService = function () {
  const PROTO_PATH = path.resolve(process.cwd(), 'interface.proto');
  const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });
  const messageProto = grpc.loadPackageDefinition(packageDefinition).message_service;

  return new messageProto.messageService(
    process.env.MESSAGESERVICEHOST,
    grpc.credentials.createInsecure()
  );
};


const sendMessage = (message, priority) => {
    return new Promise((resolve) => {
        messageService().SendMessage({
            message,
            priority
        }, (err, res) => {
            resolve(res)
        })
    })
};


app.post("/send-message", async (req, res) => {
    const { message, priority } = req.body;
    const answer = await sendMessage(message, priority);
    res.send({message: "success"});
});


app.listen(PORT, () =>console.log(`server ready at http://localhost:${PORT}`));