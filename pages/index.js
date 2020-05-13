import { Row, Col, BackTop, Drawer } from 'antd'
import { useState } from 'react'
import Profile from '../component/Profile'
import Menu from '../component/Menu'
import Detail from '../pages/detail'
import List from '../pages/list'

import '../static/style/pages/index.css'
import Footer from '../component/Footer'

// xs: <576
// sm：≥576
// md: ≥768
// lg: ≥992
// xl: ≥1200
// xxl: ≥1600


export default () => {

  const [visible, setVisible] = useState(false)
  const showDrawer = () => {
    setVisible(!visible)
  }

  const onClose = () => {
    setVisible(false)
  }

  const handler = (
    <Row>
      <Col sm={4} md={0}>
        <div onClick={showDrawer} className={`drawer-handle ${visible}`}>
          <i className="drawer-handle-icon"></i>
        </div></Col>
    </Row>
  )

  // ant-col ant-col-xs-24 ant-col-sm-24 ant-col-md-18 ant-col-lg-18 ant-col-xl-19 ant-col-xxl-20
  return (
    <>
      <div id="react-content" style={visible ? { transform: `translateX(200px)` } : {}}>
        <Row >
          <Col xs={24} sm={24} md={18} lg={19} xl={20} xxl={21} className="zmain" >
            <List />
            <Footer />
            <BackTop />
          </Col>
        </Row>
      </div>


      <Drawer
        placement="left"
        width={200}
        closable={false}
        onClose={onClose}
        visible={visible}
        handler={handler}
      >
        <Profile />
        <Menu />
      </Drawer>
    </>
  )
}