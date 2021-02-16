import React from 'react';
import { Layout } from 'antd';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import AddPlant from 'components/AddPlant';
import MyList from 'components/MyList';

import './App.css';

const { Content } = Layout;

function App() {
  return (
    <Router>
      <Layout className="layout">
        <Content className="content">
          <Switch>
            <Route exact path="/">
              <MyList />
            </Route>
            <Route exact path="/add-plant">
              <AddPlant />
            </Route>
          </Switch>
        </Content>
      </Layout>
    </Router>
  );
}

export default App;
