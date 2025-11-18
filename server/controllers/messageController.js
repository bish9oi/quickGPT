

// // text based AI chat msg controller
import axios from 'axios';
 import Chat from "../models/Chat.js";
 import User from "../models/User.js"
 import imageKit from "../configs/imageKit.js"
 import openai from '../configs/openai.js';
 export const textMessageController = async (req, res) => {
     try {
         const userId = req.user._id;

         if(req.user.credits<1){
            return res.json({success: false, message: 'You dont have enough credits to use this feature '})
         }
         const {chatId, prompt} = req.body
         const chat = await Chat.findOne({userId, _id: chatId});
         chat.messages.push({role: 'user', content: prompt, timestamp: Date.now(), isImage: false})


         const {choices} = await openai.chat.completions.create({
     model: "gemini-2.0-flash",
     messages: [      
         {
             role: "user",
             content: prompt,
         },
     ],
 });


 const reply = {...choices[0].content, timestamp: Date.now(), isImage: false};
 res.json({success: true, reply});
 chat.messages.push(reply);
 await chat.save();
 await User.updateOne({_id: userId}, {$inc: {credits: -1}});
 // res.json({success: true, reply});
     } catch (error) {
         res.json({success: false, message: error.message});
     }
 }

// // Image genenration mesage controller
export const imageMessageController =  async(req , res) => {
    try{
        const userId = req.user._id;
        // check credits
        if(req.user.credits<2){
            return res.json({success: false, message:"You Don't have to enough credit to use this feature"})
        }
        const {prompt , chatId, isPublished} = req.body;
//         // find chat
       const chat = await Chat.findOne({userId, _id: chatId});

//         // push user messages
       chat.messages.push({role: 'user', content: prompt, timestamp: Date.now(), isImage: false})


// encode the prompt

const encodedPrompt = encodeURIComponent(prompt);
// construct imageKit AI generation URI
const genereatedImageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ ik-genimg-prompt-${encodedPrompt}/QuickGPT/${Date.now()}.png?tr=w-800,
h-800`;
const aiImageResponse = await axios.get(genereatedImageUrl, {responseTYpe: "arrayBuffer"})

// convert to based
const base64Image = `data:image/png;base64,${Buffer.from(aiImageResponse.data, "binary").toString('base64')}`;

// upload to imageKit media library
const uploadResponse = await imageKit.upload({
    file: base64Image,
    fileName: `${Date.now()}.png`,
    folder: 'quickGPT',
})
          const reply = {
           role: 'assistant' , 
           content: uploadResponse.url,
            timestamp: Date.now(),
             isImage: true,
               isPublished};
        res.json({success: true, reply});

        chat.messages.push(reply);
        await chat.save();

         await User.updateOne({_id: userId}, {$inc: {credits: -2}});


    }catch(error){
        res.json({success: false, message:error.message})
   }
 }
















// // server/controllers/messageController.js
// import Chat from '../models/Chat.js';
// import User from '../models/User.js';
// import openai from '../configs/openai.js'; // <-- ensure this file exists and exports your configured OpenAI client

// // Text-based AI chat message controller
// export const textMessageController = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { chatId, prompt } = req.body;
//     if (!chatId || !prompt) {
//       return res.status(400).json({ success: false, message: 'chatId and prompt are required' });
//     }

//     const chat = await Chat.findOne({ userId, _id: chatId });
//     if (!chat) {
//       return res.status(404).json({ success: false, message: 'Chat not found' });
//     }

//     // push user message
//     chat.messages.push({ role: 'user', content: prompt, timestamp: Date.now(), isImage: false });

//     // Call your OpenAI client - change this call to match your client lib.
//     // Example is left similar to what you had. If you're using the official OpenAI npm
//     // client, adjust to openai.createChatCompletion(...) or whichever call you use.
//     const response = await openai.chat.completions.create({
//       model: 'gemini-2.0-flash', // adjust to your model
//       messages: [
//         {
//           role: 'user',
//           content: prompt,
//         },
//       ],
//     });

//     const choices = response.choices || [];
//     const content = choices[0]?.content ?? { text: 'No reply from model' };

//     const reply = { role: 'assistant', content: content, timestamp: Date.now(), isImage: false };
//     chat.messages.push(reply);

//     await chat.save();

//     // deduct 1 credit
//     await User.updateOne({ _id: userId }, { $inc: { credits: -1 } });

//     res.json({ success: true, reply });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Image generation message controller
// export const imageMessageController = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { prompt, chatId, isPublished } = req.body;
//     if (!chatId || !prompt) {
//       return res.status(400).json({ success: false, message: 'chatId and prompt are required' });
//     }

//     // Check credits
//     if (req.user.credits < 2) {
//       return res.status(403).json({ success: false, message: "You don't have enough credits to use this feature" });
//     }

//     const chat = await Chat.findOne({ userId, _id: chatId });
//     if (!chat) {
//       return res.status(404).json({ success: false, message: 'Chat not found' });
//     }

//     // push user message
//     chat.messages.push({ role: 'user', content: prompt, timestamp: Date.now(), isImage: false });

//     // Call your image generation API (placeholder, adjust to your client)
//     // Example (pseudo):
//     // const imageResp = await openai.images.generate({ prompt, size: '1024x1024' });
//     // const imageUrl = imageResp.data[0].url;

//     // For now, we'll store a placeholder message (replace with real image URL)
//     const generatedImageMessage = {
//       role: 'assistant',
//       content: '[image_generated_url_placeholder]',
//       timestamp: Date.now(),
//       isImage: true,
//       isPublished: !!isPublished,
//     };

//     chat.messages.push(generatedImageMessage);
//     await chat.save();

//     // Deduct 2 credits
//     await User.updateOne({ _id: userId }, { $inc: { credits: -2 } });

//     res.json({ success: true, message: 'Image generated', imageMessage: generatedImageMessage });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
