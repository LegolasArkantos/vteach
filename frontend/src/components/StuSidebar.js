import { Typography, Drawer, List, ListItemIcon, ListItemText, Avatar, ListItemButton, Divider } from '@mui/material';
import { styled } from '@mui/system';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import EventNoteIcon from '@mui/icons-material/EventNote';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PersonIcon from '@mui/icons-material/Person'; // Import the Person icon
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const StuSidebar = () => {
    const { auth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleHomepageClick = () => {
        navigate('/studentHomePage');
    };

    const handleSessionClick = () => {
        navigate('/Stusession');
    };

    const handleMessageClick = () => {
        navigate('/Stumessage');
    };

    const handleProfileClick = () => {
        navigate('/profile');
    };

    const drawerWidth = 240;

    const DrawerContainer = styled(Drawer)({
        width: drawerWidth,
        flexShrink: 0,
        height: '100vh', // Extend the sidebar to the bottom of the page
    });

    const DrawerPaper = styled('div')({
        width: drawerWidth,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '20px',
        backgroundColor: '#F0F7FF', // Set background color
        height: '100%', // Extend the sidebar to the bottom of the page
    });

    const listItemStyle = {
        borderLeft: '3px solid transparent', // Default border color
    };

    const activeListItemStyle = {
        borderLeft: '3px solid darkblue', // Dark blue border for the active page
    };

    const boldText = {
        fontWeight: 'bold',
    };

    return (
        <DrawerContainer variant="permanent" anchor="left">
            <DrawerPaper>
                <Avatar sx={{ width: 80, height: 80, marginBottom: '10px' }}>
                    <AccountCircleIcon sx={{ width: 80, height: 80 }} />
                </Avatar>
                <Typography variant="h6" gutterBottom>
                    {auth && `${auth.firstName} ${auth.lastName}`}
                </Typography>
                <Divider sx={{ width: '100%', backgroundColor: 'black', marginY: '10px' }} />
                <List>
                    <ListItemButton
                        onClick={handleHomepageClick}
                        sx={{
                            ...(location.pathname === '/teacherHomePage' ? activeListItemStyle : listItemStyle),
                            ...boldText,
                        }}
                    >
                        <ListItemIcon>
                            <HomeIcon />
                        </ListItemIcon>
                        <ListItemText primary="Homepage" />
                    </ListItemButton>
                    <ListItemButton
                        onClick={handleSessionClick}
                        sx={{
                            ...(location.pathname === '/session' ? activeListItemStyle : listItemStyle),
                            ...boldText,
                        }}
                    >
                        <ListItemIcon>
                            <EventNoteIcon />
                        </ListItemIcon>
                        <ListItemText primary="Sessions" />
                    </ListItemButton>
                    <ListItemButton
                        onClick={handleMessageClick}
                        sx={{
                            ...(location.pathname === '/message' ? activeListItemStyle : listItemStyle),
                            ...boldText,
                        }}
                    >
                        <ListItemIcon>
                            <MailOutlineIcon />
                        </ListItemIcon>
                        <ListItemText primary="Messaging" />
                    </ListItemButton>
                    <ListItemButton
                        onClick={handleProfileClick}
                        sx={{
                            ...(location.pathname === '/profile' ? activeListItemStyle : listItemStyle),
                            ...boldText,
                        }}
                    >
                        <ListItemIcon>
                            <PersonIcon />
                        </ListItemIcon>
                        <ListItemText primary="Profile" />
                    </ListItemButton>
                </List>
            </DrawerPaper>
        </DrawerContainer>
    );
};

export default StuSidebar;
