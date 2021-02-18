import React from 'react';
import { Layout } from 'antd';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import AddPlant from 'components/AddPlant';
import MyList from 'components/MyList';

import logo from 'images/logo.svg';
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
          padding: '16px',
          borderRadius: '32px 32px 0 0',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <img src={logo} width={48} height={48} alt="logo" />
          <h3>Welcome back, Shannon!</h3>
        </div>
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
