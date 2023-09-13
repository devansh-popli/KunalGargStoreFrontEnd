import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { UserContext } from '../context/UserContext';
import { Grid, Hidden, useMediaQuery } from '@mui/material';
import Footer from './Footer';
import { Link, NavLink } from 'react-router-dom';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import InventoryIcon from '@mui/icons-material/Inventory';
import TableViewIcon from '@mui/icons-material/TableView';
const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function PersistentDrawerLeft({children}) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const isMobile = useMediaQuery('(max-width:600px)');
  // const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 600);
const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };
const userContext=React.useContext(UserContext)
React.useEffect(()=>{
if(userContext.isLogin && !isMobile)
setOpen(true)
  else{
    setOpen(false)
  }
},[userContext])
  return (
    <div>

     
    <Box sx={{ display: 'flex' }}>
      <Hidden smDown>
       <CssBaseline />
      <AppBar position="fixed" open={open}>
       <Toolbar >
        <Grid container justifyContent="space-between" alignItems="center">
      <Grid item display={'flex'} alignItems={'center'} justifyContent={'center'}>
      { userContext.isLogin &&  <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{ mr: 2, ...(open && { display: 'none' }) }}
        >
          <MenuIcon />
        </IconButton>}
        <Typography variant="h6" noWrap component="div">
          ShopEase
        </Typography>
      </Grid>
      <Grid item display={'flex'} justifyContent={'center'} alignItems={'center'}>
        {userContext.isLogin && (
          <Typography style={{ whiteSpace: 'nowrap' ,cursor:"pointer",marginRight:"20px"}}>{userContext.userData.name}
          </Typography>
        )}
        {userContext.isLogin && (
          <Typography style={{ whiteSpace: 'nowrap' ,cursor:"pointer",marginRight:"10px"}}  onClick={() => userContext.doLogout()}>Logout
          </Typography>
        )}
      </Grid>
    </Grid>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
          {/* {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => ( */}
          {userContext.isLogin &&
              <List>
            <ListItem disablePadding  as={NavLink} to={"/new-ledger-account-form"} >
              <ListItemButton>
                <ListItemIcon >
                  { <AccountBoxIcon  />}
                </ListItemIcon>
                <ListItemText  primary={'New Ledger Account Form'}  primaryTypographyProps={{
                    color: 'black',
                    fontWeight: 'medium',
                    variant: 'body2',
                  }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding as={NavLink} to={"/stock-item-menu"}>
              <ListItemButton>
                <ListItemIcon>
                  { <InventoryIcon />}
                </ListItemIcon>
                <ListItemText  primary={'Stock Item Menu'}  primaryTypographyProps={{
                    color: 'black',
                    fontWeight: 'medium',
                    variant: 'body2',
                  }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding  as={Link} to={"/view-stock-item-menu"}>
              <ListItemButton>
                <ListItemIcon>
                  { <TableViewIcon />}
                </ListItemIcon>
                <ListItemText  primary={'View Stock Item Menu'}  primaryTypographyProps={{
                    color: 'black',
                    fontWeight: 'medium',
                    variant: 'body2',
                  }} />
              </ListItemButton>
            </ListItem>
          </List>
          }
            {/* { userContext.isLogin &&  <Nav.Link as={NavLink} to={"/new-ledger-account-form"}>New Ledger Account Form</Nav.Link>}
            { userContext.isLogin &&  <Nav.Link as={NavLink} to={"/stock-item-menu"}>Stock Item Menu</Nav.Link>}
            { userContext.isLogin &&  <Nav.Link as={NavLink} to={"/view-stock-item-menu"}>View Stock Item Menu</Nav.Link>}
            { userContext.isLogin &&  <Nav.Link >{userContext.userData.email}</Nav.Link>}
          { userContext.isLogin &&  <Nav.Link onClick={()=>userContext.doLogout()}>Logout</Nav.Link>} */}
          {/* ))} */}
        <Divider />
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
    {children}
      </Main>
      </Hidden>
    
    </Box>
  <Hidden mdUp>
  <div>
  <AppBar position="fixed" open={open} >
       <Toolbar >
        <Grid container justifyContent="space-between" alignItems="center">
      <Grid item display={'flex'} alignItems={'center'} justifyContent={'center'}>
      { userContext.isLogin &&  <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={toggleDrawer}
          edge="start"
          sx={{ mr: 2, ...(open && { display: 'none' }) }}
        >
          <MenuIcon />
        </IconButton>}
        <Typography variant="h6" noWrap component="div">
          ShopEase
        </Typography>
      </Grid>
      <Grid item display={'flex'} justifyContent={'center'} alignItems={'center'}>
        {userContext.isLogin && (
          <Typography style={{ whiteSpace: 'nowrap' ,cursor:"pointer",marginRight:"20px"}}>{userContext.userData.name}
          </Typography>
        )}
        {userContext.isLogin && (
          <Typography style={{ whiteSpace: 'nowrap' ,cursor:"pointer",marginRight:"10px"}}  onClick={() => userContext.doLogout()}>Logout
          </Typography>
        )}
      </Grid>
    </Grid>
        </Toolbar>
      </AppBar>

  <Drawer open={isDrawerOpen} onClose={toggleDrawer}>
  <DrawerHeader>
          <IconButton onClick={toggleDrawer}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
  {userContext.isLogin &&
          <List>
        <ListItem disablePadding  as={NavLink} to={"/new-ledger-account-form"} >
          <ListItemButton>
            <ListItemIcon >
              { <AccountBoxIcon  />}
            </ListItemIcon>
            <ListItemText  primary={'New Ledger Account Form'}  primaryTypographyProps={{
                color: 'black',
                fontWeight: 'medium',
                variant: 'body2',
              }} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding as={NavLink} to={"/stock-item-menu"}>
          <ListItemButton>
            <ListItemIcon>
              { <InventoryIcon />}
            </ListItemIcon>
            <ListItemText  primary={'Stock Item Menu'}  primaryTypographyProps={{
                color: 'black',
                fontWeight: 'medium',
                variant: 'body2',
              }} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding  as={Link} to={"/view-stock-item-menu"}>
          <ListItemButton>
            <ListItemIcon>
              { <TableViewIcon />}
            </ListItemIcon>
            <ListItemText  primary={'View Stock Item Menu'}  primaryTypographyProps={{
                color: 'black',
                fontWeight: 'medium',
                variant: 'body2',
              }} />
          </ListItemButton>
        </ListItem>
      </List>
      }
  </Drawer>

  <main style={{marginTop:"70px"}}>
    {children}
  </main>
</div>
</Hidden>
  </div>
  );
}