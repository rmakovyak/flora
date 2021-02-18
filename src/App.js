import React from 'react';
import { Layout } from 'antd';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import AddPlant from 'components/AddPlant';
import MyList from 'components/MyList';

import logo from 'images/logo.png';
import ScrollToTop from 'components/ScrollToTop';

import './App.css';

const { Content } = Layout;

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Layout.Header
        style={{
          background: '#fff',
          padding: '0 16px',
          borderRadius: '32px 32px 0 0',
        }}
      >
        <img src={logo} width={96} alt="logo" />
      </Layout.Header>
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
