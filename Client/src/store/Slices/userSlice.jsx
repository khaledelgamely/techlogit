import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Tech_Logit from "../../API/config";

export const fetchUser = createAsyncThunk("user/fetchUser", async (userId) => {
  const { data } = await Tech_Logit.get(`user/${userId}`);
  return data.result;
});

export const fetchUserConversations = createAsyncThunk(
  "user/conversations",
  async (userId) => {
    const { data } = await Tech_Logit.get(`conversations/${userId}`);
    return data.data;
  }
);

const initialState = {
  user: {
    id: "",
    firstName: "",
    lastName: "",
    email: "",
  },
  unseen: [],
  socket: null,
  userConversations: [],
  loading: true,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addInfo: (state, action) => {
      state.loading = false;
      state.user = { ...action.payload };
    },
    ResetRedux: () => initialState,
    setUnseen: (state, action) => {
      state.unseen = action.payload;
    },
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    addUnseen: (state, action) => {
      if (!state.unseen.includes(action.payload)) {
        state.unseen = [...state.unseen, action.payload];
      }
    },
    removeUnseen: (state, action) => {
      state.unseen = state.unseen.filter((id) => id !== action.payload);
    },
    orderUserConv: (state, action) => {
      state.userConversations = action.payload;
    },
    updateUserConversation: (state, action) => {
      const { conversationId, lastMessageOn, lastMessage } = action.payload;
      const conversationIndex = state.userConversations.findIndex(
        (c) => c._id === conversationId
      );
      if (conversationIndex !== -1) {
        state.userConversations[conversationIndex].lastMessageOn =
          lastMessageOn;
        state.userConversations[conversationIndex].lastMessage = lastMessage;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = { ...action.payload };
    });
    builder.addCase(fetchUserConversations.fulfilled, (state, action) => {
      state.userConversations = [...action.payload];
    });
    // Additional cases for other async thunks can be added here
  },
});

export const {
  addInfo,
  ResetRedux,
  updateUserConversation,
  setSocket,
  setUnseen,
  addUnseen,
  removeUnseen,
} = userSlice.actions;
export default userSlice.reducer;
