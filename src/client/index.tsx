import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Routes, BrowserRouter, Link } from 'react-router-dom'
import Home from '@/client/pages/Home'
import Detail from '@/client/pages/Detail'
import { createBrowserHistory } from 'history'

const App = () => {
  return (
    <BrowserRouter>
      <div>
        <h1>Home</h1>
        <nav>
          <Link to="/">Home</Link> | {" "}
          <Link to="detail">Detail</Link>
        </nav>
      </div>
      <Routes>
        <Route index element={<Home />}></Route>
        <Route path="/detail" element={<Detail />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

const renderClient = () => {
  ReactDOM.hydrate(<App />, document.getElementById('root'))
}

const renderServer = () => <App />
// ReactDom.render(<App />, document.getElementById('root'))

export default (__IS_SERVER__ ? renderServer : renderClient()) as React.FC<any>