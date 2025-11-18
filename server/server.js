import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import userRouter from './routes/userRoutes.js';
import chatRouter from './routes/chatRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import creditRouter from './routes/creditRoutes.js';
import { stripeWebhooks } from './controllers/webhooks.js';

const app = express();
await connectDB();


// stripe
app.post('/api/stripe', express.raw({type: 'application/json'}), stripeWebhooks)
// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send("Hello from QuickGPT server");
});
app.use('api/user', userRouter);
app.use('/api/chat', chatRouter);
app.use('/api/message', messageRouter)
app.use('/api/credit' , creditRouter);
// Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
