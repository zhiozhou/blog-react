import Layout from '../component/Layout'
import RollList from '../component/RollList'

import Banner from '../component/Banner'


cosnt 

const index = () => (
  <Layout
    // banner={<Banner title="记录生活 分享技术" desc="编程是一门艺术，生活亦是如此"/>}
    main={<RollList/>}
    menuKeys={['/']}
  />
)

export default index