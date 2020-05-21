import axios from 'axios'

import moment from 'moment'
import Router from 'next/router'
import { useState } from 'react'
import { Typography, List, Spin, Skeleton, message } from 'antd'

import Banner from '../component/Banner'
import Layout from '../component/Layout'
import AutoList from '../component/AutoList'
import { ICON_LOAD, LIST_URL, SUCCESS_CODE, DATE_FORMAT } from '../config/common'

import '../static/style/pages/notes.css'

const { Title, Paragraph } = Typography

const
  rows = 3,
  type = 'notes',
  height = 150,
  preview = 2

// 获取数据
const getData = (page, cb) => {
  let form = new FormData()
  form.append('page', page++)
  form.append('type', type)
  axios.post(LIST_URL, form).then(
    (res) => {
      const { code, info, data } = res.data
      if (code != SUCCESS_CODE) {
        return message.warning(info)
      }
      setTimeout(()=>{
        cb(data)

      },1000)
    }
  )
}

const seatRender = (

  <List
    dataSource={[...Array(preview).keys()]}
    renderItem={() => (
      <List.Item className="seat">
        <div className="list-item">
          <Skeleton
            title={{ width: '50%' }}
            paragraph={{ rows: rows }}
            active
          />

          <div className="notes-meta">
            <Skeleton.Button
              size="small"
              active />
          </div>
        </div>
      </List.Item>)}
  />
)


const banner = (
  <Banner
    bg={'https://gw.alipayobjects.com/mdn/rms_08e378/afts/img/A*kJM2Q6uPXCAAAAAAAAAAAABkARQnAQ'}
    title="记录生活 分享技术"
    desc={<p>编程是一门艺术，生活亦是如此</p>}
  />
)



const notes = () => {

  console.log('notes render')

  const [spinning, setSpinning] = useState(false)

  const viewDetail = id => {
    setSpinning(true)
    Router.push({
      pathname: '/detail',
      query: { id }
    })
  }

  const render = item => (
    <div className="list-item">
      <Title
        className="notes-title"
        level={4}
        ellipsis={true}
        onClick={() => viewDetail(item.id)}
      >
        {item.title}
      </Title>
      <Paragraph
        className="notes-preview"
        ellipsis={{ rows: rows, expandable: false }}
        onClick={() => viewDetail(item.id)}
      >
        {item.preview}
      </Paragraph>
      <div className="notes-meta">
        <div>{moment(item.gmtCreate).format(DATE_FORMAT)}</div>
      </div>
    </div>
  )


  const list = (
    <Spin indicator={ICON_LOAD} spinning={spinning}>
      <AutoList
        className="list"
        getData={getData}
        itemHeight={height}
        itemRender={render}
        itemSeatRender={seatRender}
      />
    </Spin>
  )

  return (
    <Layout
      banner={banner}
      main={list}
      menuKeys={['/notes']}
    />
  )
}


export default notes
