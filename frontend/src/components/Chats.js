import React, { useState, useRef ,useEffect} from 'react';
import { Typography, Drawer, List, ListItemButton, Avatar, TextField, Button } from '@mui/material';
import { styled } from '@mui/system';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

const Chats = () => {
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState({
    person1: ['Hi there!', 'How are you?'],
    person2: ['Hello!', 'Im good. How about you?'],
  });

  const navigate = useNavigate();
  
  
  const handlePersonClick = (person) => {
    setSelectedPerson(person);
  };

  const handleMessageSend = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    if (selectedPerson && messageInput.trim() !== '') {
      setMessages({
        ...messages,
        [selectedPerson]: [...messages[selectedPerson], messageInput],
      });
      setMessageInput('');
      
    }
  };

  const drawerWidth = 240;

  const DrawerContainer = styled(Drawer)({
    width: drawerWidth,
    flexShrink: 0,
  });

  const DrawerPaper = styled('div')({
    width: drawerWidth,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '20px',
  });

  const MainContent = styled('div')({
    marginLeft: drawerWidth,
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    flex: 1,
  });

  const PeopleNamesBox = styled('div')({
    width: '200px',
    padding: '20px',
    border: '1px solid #ccc',
    marginRight: '20px',
    flex: 'none',
    minHeight: '600px',
  });

  const MessageDisplayBox = styled('div')({
    flex: 1,
    border: '1px solid #ccc',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '550px',
  });

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
            <Typography variant="h6">People you are talking to:</Typography>
            <List>
              <ListItemButton onClick={() => handlePersonClick('person1')}>
                <Avatar>
                  <AccountCircleIcon />
                </Avatar>
                <Typography variant="subtitle1">Person 1</Typography>
              </ListItemButton>
              <ListItemButton onClick={() => handlePersonClick('person2')}>
                <Avatar>
                  <AccountCircleIcon />
                </Avatar>
                <Typography variant="subtitle1">Person 2</Typography>
              </ListItemButton>
              {/* Add more people as needed */}
            </List>
          </PeopleNamesBox>

          {/* Message Display Box */}
          {selectedPerson && (
            <div style={{ flex: 1, border: '1px solid #ccc', padding: '20px', maxHeight: '600px', overflowY: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Typography variant="h6">Chat with {selectedPerson}</Typography>
              {messages[selectedPerson].map((msg, index) => (
                <div key={index}>{msg}</div>
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

