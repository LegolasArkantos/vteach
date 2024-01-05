import React, { useState, useEffect } from 'react';
import { Typography, List, ListItemButton, Avatar, TextField, Button } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Sidebar from './Sidebar';
import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import styled from 'styled-components';

const StudentChats = () => {
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [teachersData, setTeachersData] = useState([]);
  const [selectedPersonName, setSelectedPersonName] = useState('');
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosPrivate.get(`/students/getMyTeachers/${auth.studentId}`);
        setTeachersData(response.data.teachers);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [auth.studentId, axiosPrivate]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (selectedPerson && auth) {
          const response = await axiosPrivate.get(`/messages/getMessages/${auth.studentId}/${selectedPerson}`);
          setChatMessages(response.data.messages);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
    const intervalId = setInterval(fetchMessages, 10000);

    // Clean up the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, [selectedPerson, auth.studentId, axiosPrivate]);

  const handlePersonClick = (teacher) => {
    setSelectedPerson(teacher.teacherId);
    setSelectedPersonName(`${teacher.name}`);
  };

  const handleMessageSend = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
  
    if (selectedPerson && messageInput.trim() !== '') {
      const senderId = auth.studentId;
      const receiverId = selectedPerson;
      const content = messageInput;
  
      await sendMessage(senderId, receiverId, content);
  
      setMessageInput('');
    }
  };

  const sendMessage = async (senderId, receiverId, content) => {
    try {
      const response = await axiosPrivate.post('/messages/sendMessage', {
        senderId,
        receiverId,
        content,
      });

      const sentMessage = response.data.message;

      setChatMessages((prevMessages) => [...prevMessages, sentMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const PeopleNamesBox = styled.div`
    width: 200px;
    padding: 20px;
    border: 1px solid #ddd;
    margin-right: 20px;
    border-radius: 10px;
    max-height: 570px; 
  overflow-y: auto; 
  `;

  const MessageDisplayBox = styled.div`
    flex: 1;
    border: 1px solid #ddd;
    padding: 20px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-radius: 10px;
    max-height: 570px; 
  overflow-y: auto; 
  `;

  const MessageContainer = ({ sender, children }) => (
    <div
      style={{
        textAlign: sender === selectedPerson ? 'right' : 'left',
        backgroundColor: sender === selectedPerson ? '#e6f7ff' : '#ccffcc',
        padding: '8px',
        borderRadius: '8px',
        marginBottom: '8px',
        wordBreak: 'break-word',
        maxHeight:'500px'
      }}
    >
      {children}
    </div>
  );

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div style={{ marginLeft: '10px', display: 'flex', flexDirection: 'column', padding: '20px', flex: 1 }}>
        <Typography variant="h4" gutterBottom>
          Chats
        </Typography>

        <div style={{ display: 'flex' }}>
          {/* People Names Box */}
          <PeopleNamesBox>
            <Typography variant="h6">Teachers you are talking to:</Typography>
            <List>
              {teachersData.map((teacher) => (
                <ListItemButton key={teacher._id} onClick={() => handlePersonClick(teacher)}>
                  <Avatar>
                    <AccountCircleIcon />
                  </Avatar>
                  <Typography variant="subtitle1">{teacher.name}</Typography>
                </ListItemButton>
              ))}
            </List>
          </PeopleNamesBox>

          {/* Message Display Box */}
          {selectedPerson && (
            <MessageDisplayBox>
              <Typography variant="h6">Chat with {selectedPersonName}</Typography>
              {chatMessages.map((msg, index) => (
                <MessageContainer key={index} sender={msg.sender}>
                  {msg.content}
                </MessageContainer>
              ))}
              {/* Message input and send button container */}
              <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '100px', marginTop: 'auto' }}>
                {/* Message input */}
                <form onSubmit={handleMessageSend}>
                  <TextField
                    label="Type your message"
                    variant="outlined"
                    fullWidth
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                  />
                  {/* Send button */}
                  <Button type="submit" variant="contained" color="primary" style={{ marginTop: '10px' }}>
                    Send
                  </Button>
                </form>
              </div>
            </MessageDisplayBox>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentChats;
