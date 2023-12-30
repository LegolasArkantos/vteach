import { Typography, Drawer, List, ListItemIcon, ListItemText, Avatar, ListItemButton  } from '@mui/material';
import { styled } from '@mui/system';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { useNavigate } from 'react-router-dom';


const Sidebar = ({ teacherData }) => {

    const navigate = useNavigate();
    const handleHomepageClick = () => {
        // Use the navigate function to redirect to the desired route
        navigate('/teacherHomePage');
    };
    const handleSessionClick = () => {
        // Use the navigate function to redirect to the desired route
        navigate('/session');
    };
    const handleMessageClick = () => {
        // Use the navigate function to redirect to the desired route
        navigate('/message');
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
    

    return (
        <DrawerContainer variant="permanent" anchor="left">
            <DrawerPaper>
                <Avatar sx={{ width: 80, height: 80, marginBottom: '10px' }}>
                    <AccountCircleIcon sx={{ width: 80, height: 80 }} />
                </Avatar>
                <Typography variant="h6" gutterBottom>
                    {teacherData && `${teacherData.user.firstName} ${teacherData.user.lastName}`}
                </Typography>
                <List>
                    <ListItemButton  onClick={handleHomepageClick}>
                        <ListItemIcon>
                            <MailOutlineIcon />
                        </ListItemIcon>
                        <ListItemText primary="Homepage" />
                    </ListItemButton >
                    <ListItemButton onClick={handleSessionClick}>
                        <ListItemIcon>
                            <MailOutlineIcon />
                        </ListItemIcon>
                        <ListItemText primary="Sessions" />
                    </ListItemButton >
                    <ListItemButton onClick={handleMessageClick}>
                        <ListItemIcon>
                            <MailOutlineIcon />
                        </ListItemIcon>
                        <ListItemText primary="Messaging" />
                    </ListItemButton >
                </List>
            </DrawerPaper>
        </DrawerContainer>
    );
};

export default Sidebar;