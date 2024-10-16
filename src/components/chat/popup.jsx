import React, { useEffect, useRef, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import "./conversationDetails.css";
import axiosInstance from "../../axios";
import "../../pages/landlord/landlord.css";
import notificationSound from "../../assets/sound/chatnotification.wav";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ConversationDetail({ conversationId, landlordId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socketUrl, setSocketUrl] = useState(null);
  const [socket, setSocket] = useState(null);
  const [userName, setUserName] = useState("Anonymous");
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Create a ref for the message container
  const messageContainerRef = useRef(null);

  useEffect(() => {
    if (conversationId) {
      // const wsUrl = `ws://localhost:8000/ws/${conversationId}/`;
      const wsUrl = `wss://worker-production-09be.up.railway.app/ws/${conversationId}/`;
      setSocketUrl(wsUrl);
      console.log(wsUrl);
    }
  }, [conversationId]);
  useEffect(() => {
    const storedUserName = localStorage.getItem("username");
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const response = await axiosInstance.get(`api/chat/${conversationId}`);
        const updatedMessages = response.data.messages.map((message) => ({
          ...message,
          isSender: message.created_by?.username === userName,
          name: message.created_by?.username || "unknown",
          time: new Date(message.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          timestamp: new Date(message.created_at).getTime(),
        }));
        const sortedMessages = [...updatedMessages, ...messages].sort(
          (a, b) => a.timestamp - b.timestamp
        );
        setMessages(sortedMessages);
      } catch (error) {
        console.error("Error fetching conversation:", error);
      }
    };

    // Re-fetch the conversation when navigating to the page
    if (conversationId) {
      fetchConversation();
    }
  }, [conversationId, userName]);
  const { sendMessage, readyState } = useWebSocket(socketUrl, {
    onOpen: () => console.log("Connected to WebSocket"),
    onClose: () => console.log("Disconnected from WebSocket"),
    onMessage: (event) => {
      try {
        const newMessageData = JSON.parse(event.data);

        // Handle regular message
        if (newMessageData.type === "message") {
          const newMessage = {
            body: newMessageData.body,
            name: newMessageData.name,
            isSender: newMessageData.name === userName,
            time: new Date(newMessageData.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            timestamp: new Date(newMessageData.created_at).getTime(),
          };
          const formattedTime = new Date(newMessage.time).toLocaleTimeString();
          // Update the message list
          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages, newMessage];
            return updatedMessages.sort((a, b) => a.timestamp - b.timestamp); // Sort messages by timestamp
          });

          // Play the notification sound if it's a new message from someone else
          if (newMessageData.name !== userName) {
            const audio = new Audio(notificationSound);
            audio
              .play()
              .catch((error) => console.error("Audio playback error:", error));
            toast.info(`${newMessageData.name}: ${newMessageData.body}`, {
              position: "top-right",
              autoClose: 5000,
            });
          }
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    },
    shouldReconnect: (closeEvent) => true,
  });

  const handleSendMessage = () => {
    if (!userName) {
      console.log("Username is not set.");
      return;
    }

    let sentToId = landlordId;
    if (!sentToId && messages.length > 0) {
      const lastMessageWithSentTo = messages.find(
        (message) => message.sent_to && message.sent_to.id
      );

      if (lastMessageWithSentTo) {
        sentToId = lastMessageWithSentTo.sent_to.id;
      }
    }

    if (sentToId) {
      if (readyState === ReadyState.OPEN) {
        const messageData = {
          event: "chat_message",
          data: {
            body: newMessage,
            name: userName || "Anonymous",
            sent_to_id: sentToId,
            conversation_id: conversationId,
          },
        };
        sendMessage(JSON.stringify(messageData)); // Send the message
        setNewMessage("");
      } else {
        console.log("WebSocket is not connected. Current state:", readyState);
      }
    } else {
      console.log(
        "No user selected or available in messages to send a message."
      );
    }
  };

  // New function to handle key down event
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    const container = messageContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="user-list">
        {users.map((user) => (
          <div
            key={user.id}
            onClick={() => setSelectedUserId(user.id)}
            style={{
              cursor: "pointer",
              padding: "5px",
              backgroundColor:
                selectedUserId === user.id ? "#d1e7dd" : "transparent",
            }}
          >
            {user.username}
          </div>
        ))}
      </div>

      <div
        className="message-container"
        ref={messageContainerRef}
        style={{ overflowY: "auto", maxHeight: "400px" }}
      >
        {messages.map((message, index) => (
          <div key={index} className={message.isSender ? "sender" : "receiver"}>
            <h4>{message.name}</h4>
            <p>{message.body}</p>
            <div className="message-content">
              <span className="message-time">{message.time}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="chat-input-container">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here..."
          className="chat-input"
        />
        <button className="send-button" onClick={handleSendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

export default ConversationDetail;
