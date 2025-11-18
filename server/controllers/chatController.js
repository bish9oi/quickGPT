// import Chat from "../models/Chat.js";


// // API controller for creating a new chat
// export const createChat = async(req , res) => {
//     try {
//         const userId = req.user._id;

//         const chatData = {
//             userId,
//             messages:[],
//             name: "New Chat",
//             userName: req.user.name,
//         }
//         await Chat.create(chatData);
//         res.json({success: true, message: 'Chat created successfully'});
//     } catch (error) {
//         res.json({success: false, message: error.message});
//     }
// }


// // API controller for fetching all chats of a user

// export const getChats = async(req , res) => {
//     try {
//         const userId = req.user._id;

//         const chats = await Chat.find({userId}).sort({updatedAt: -1});
//         res.json({success: true, chats});
//     } catch (error) {
//         res.json({success: false, message: error.message});
//     }
// }


// // API controller for deleting a chat
// export const deleteChat = async(req , res) => {
//     try {
//         const userId = req.user._id;

//         const {chatId} = req.body;
//         await Chat.deleteOne({_id: chatId, userId})
//         res.json({success: true, message: 'Chat deleted successfully'});
//     } catch (error) {
//         res.json({success: false, message: error.message});
//     }
// }




// server/controllers/chatController.js
import Chat from '../models/Chat.js';

// API controller for creating a new chat
export const createChat = async (req, res) => {
  try {
    const userId = req.user._id;

    const chatData = {
      userId,
      messages: [],
      name: 'New Chat',
      userName: req.user.name,
    };

    await Chat.create(chatData);
    res.json({ success: true, message: 'Chat created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// API controller for fetching all chats of a user
export const getChats = async (req, res) => {
  try {
    const userId = req.user._id;

    const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });
    res.json({ success: true, chats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// API controller for deleting a chat
export const deleteChat = async (req, res) => {
  try {
    const userId = req.user._id;
    const { chatId } = req.body;
    if (!chatId) {
      return res.status(400).json({ success: false, message: 'chatId is required' });
    }

    const result = await Chat.deleteOne({ _id: chatId, userId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'Chat not found or not owned by user' });
    }

    res.json({ success: true, message: 'Chat deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
