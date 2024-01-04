import React, { useState ,useEffect} from 'react';
import { Typography, Drawer, List, ListItemButton, Avatar, TextField, Button } from '@mui/material';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import useAuth from '../hooks/useAuth';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import styled from 'styled-components';

const Chats = () => {
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [studentsData, setStudentsData] = useState([]);
  const [selectedPersonName, setSelectedPersonName] = useState('');
  const navigate = useNavigate();
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosPrivate.get(`/teachers/myStudents/${auth.teacherId}`);
        setStudentsData(response.data.studentsData);
        console.log(response.data.studentsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [auth.teacherId, axiosPrivate]);

  const handlePersonClick = (person) => {
    setSelectedPerson(person.studentId);
    setSelectedPersonName(`${person.firstName} ${person.lastName}`);
  };

  const handleMessageSend = async (e) => {
    e.preventDefault();
    if (selectedPerson && messageInput.trim() !== '') {
      const senderId = auth.teacherId;
      const receiverId = selectedPerson;
      const content = messageInput;

      await sendMessage(senderId, receiverId, content);

      setMessageInput('');
    }
  };

  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (selectedPerson && auth) {
          const response = await axiosPrivate.get(`/messages/getMessages/${auth.teacherId}/${selectedPerson}`);
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
  
  }, [selectedPerson, auth.teacherId, axiosPrivate]);

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

  const ChatContainer = styled.div`
    display: flex;
  `;

  const PeopleNamesBox = styled.div`
    width: 200px;
    padding: 20px;
    border: 1px solid #ddd;
    margin-right: 20px;
    border-radius: 10px;
    min-height: 600px;
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
          <div
            style={{
              width: '200px',
              padding: '20px',
              border: '1px solid #ccc',
              marginRight: '20px',
              borderRadius: '10px',
              minHeight: '550px',
            }}
          >
            <Typography variant="h6">People you are talking to:</Typography>
            <List>
              {studentsData.map((session) => (
                session.students.map((student) => (
                  <ListItemButton key={student.studentId} onClick={() => handlePersonClick(student)}>
                    <Avatar>
                      <AccountCircleIcon />
                    </Avatar>
                    <Typography variant="subtitle1">{`${student.firstName} ${student.lastName}`}</Typography>
                  </ListItemButton>
                ))
              ))}
            </List>
          </div>

          {/* Message Display Box */}
          {selectedPerson && (
            <div
              style={{
                flex: 1,
                border: '1px solid #ccc',
                padding: '20px',
                maxHeight: '550px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRadius: '10px',
              }}
            >
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chats;