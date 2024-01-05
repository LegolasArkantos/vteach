import { Typography, Drawer, List, ListItemIcon, ListItemText, Avatar, ListItemButton, Divider } from '@mui/material';
import { styled } from '@mui/system';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import EventNoteIcon from '@mui/icons-material/EventNote';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PersonIcon from '@mui/icons-material/Person'; 
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useLogout from '../hooks/useLogout';
import IconButton from '@mui/material/IconButton';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const Sidebar = () => {
    const { auth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const logout = useLogout();
    
    const signOut = async () => {
        await logout();
        navigate('/login')
    }


    const handleHomepageClick = () => {
        navigate(auth.role === 'teacher' ? '/teacherHomePage' : '/studentHomePage');
    };

    const handleSessionClick = () => {
        navigate('/session');
    };

    const handleMessageClick = () => {
        navigate(auth.role === 'teacher' ? '/message' : '/studentchats');    };

    const handleProfileClick = () => {
        navigate('/profile');
    };

    const drawerWidth = 240;

    const DrawerContainer = styled(Drawer)({
        width: drawerWidth,
        flexShrink: 0,
        height: '100vh', 
    });

    const DrawerPaper = styled('div')({
        width: drawerWidth,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '20px',
        backgroundColor: '#F0F7FF', 
        height: '100%', 
    });

    const listItemStyle = {
        borderLeft: '3px solid transparent', 
    };

    const activeListItemStyle = {
        borderLeft: '3px solid darkblue', 
    };

    const boldText = {
        fontWeight: 'bold',
    };

    const LogoutButton = styled(IconButton)({
        position: 'absolute',
        bottom: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
    });

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
                            ...(location.pathname === (auth.role === 'teacher' ? '/teacherHomePage' : '/studentHomePage')
                                ? activeListItemStyle
                                : listItemStyle),
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
                    {auth.role === 'student' && (
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
                    )}
                </List>
                <LogoutButton onClick={signOut} color="primary">
                    <ExitToAppIcon />
                </LogoutButton>
            </DrawerPaper>
        </DrawerContainer>
    );
};

export default Sidebar;
