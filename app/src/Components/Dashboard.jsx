import {
  AppBar,
  Box,
  Grid,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from "@mui/material";
import { useState } from "react";
import Home from "./Home";
import Diariex from "./Diariex";
import Add from "./Add";
import Profile from "./Profile";

function Dashboard() {
  const [value, setValue] = useState(0);
  const tabs = ["Home", "Diaries", "Add", "Profile"];
  const tabComponnts = [
    {
      key: 0,
      value: <Home/>
    },
    {
      key: 1,
      value: <Diariex/>
    },
    {
      key: 2,
      value: <Add/>
    },
    {
      key: 3,
      value: <Profile/>
    }
  ]

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box marginTop={8}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  const handelTabChange = (e, newValue) => {
    setValue(newValue);
  };
  return (
<>
<AppBar sx={{ backgroundColor: "#fff" }}>
      <Toolbar>
        <Grid container display="flex" alignItems="center">
          <Grid item>
            <Typography color="secondary">Icon</Typography>
          </Grid>
          <Grid marginLeft="auto">
            <Tabs
              indicatorColor="secondary"
              textColor="secondary"
              value={value}
              onChange={handelTabChange}
            >
              {tabs?.map((item, index) => (
                <Tab key={index} label={item} {...a11yProps(index)} />
              ))}
            </Tabs>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
    <Grid>
    {tabComponnts?.map((item, index) => (
      <TabPanel key={item.key} value={value} index={index}>{item.value}</TabPanel>
    ))}
    </Grid>
</>
  );
}

export default Dashboard;
