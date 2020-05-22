
import { Affix, Breadcrumb } from 'antd'
import { CalendarFilled, EyeFilled, LeftOutlined, RightOutlined } from '@ant-design/icons'

import axios from 'axios'
import hljs from 'highlight.js'
import marked from 'marked'
import moment from 'moment'
import Layout from '../component/Layout'
import Tocify from '../component/Tocify.tsx'
import 'highlight.js/styles/monokai-sublime.css'
import { DATE_FORMAT, DETAIL_URL, SUCCESS_CODE, ERROR_ENUM, ERROR_RESULT } from '../config/common'
import '../static/style/pages/detail.css'



const tocify = new Tocify()
const renderer = new marked.Renderer()
renderer.heading = (text, level, raw) => {
    const anchor = tocify.add(text, level);
    return `<a id="${anchor}" href="#${anchor}" class="anchor-fix"><h${level}>${text}</h${level}></a>\n`;
}

marked.setOptions({
    renderer: renderer,
    gfm: true,
    pedantic: false,
    sanitize: false,
    tables: true,
    breaks: false,
    smartLists: true,
    smartypants: false,
    highlight: function (code) {
        return hljs.highlightAuto(code).value
    }
})


const detail = ({ error, title, content, type, typeLabel, pv, gmtCreate, prev, next }) => {
    if (error) {
        return (<ERROR_RESULT error={error} />)
    }
    let backPath = `/${type}`

    let banner = (
        <div className="detail-header">
            <Breadcrumb>
                <Breadcrumb.Item>
                    <a href="/">首页</a>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <a href={backPath}>{typeLabel}</a>
                </Breadcrumb.Item>
                <Breadcrumb.Item>{title}</Breadcrumb.Item>
            </Breadcrumb>
            <div>
                <div className="detail-title">{title}</div>
                <div className="detail-meta">
                    <div><CalendarFilled /> {moment(gmtCreate).format(DATE_FORMAT)}</div>
                    <div><EyeFilled /> {pv}</div>
                </div>
            </div>
        </div>
    )

    let main = (
        <>
            <div className="detail-content">
                <div dangerouslySetInnerHTML={{ __html: marked(content) }}></div>
            </div>
            <div className="detail-nav">
                {prev && <a className="nav-prev" href={`?id=${prev.id}`}><LeftOutlined /> {prev.title}</a>}
                {next && <a className="nav-next" href={`?id=${next.id}`}>{next.title} <RightOutlined className="end" /></a>}
            </div>
        </>
    )



    let sticky = tocify.tocItems.length > 0 && (
        <Affix offsetTop={55}>
            <div className="detail-toc">{tocify.render()}</div>
        </Affix>
    )

    return (
        <Layout
            menuKeys={[backPath]}
            banner={banner}
            main={main}
            sticky={sticky}
        />
    )
}



detail.getInitialProps = async (context) => {
    const id = context.query.id
    if (null == id) {
        return { error: ERROR_ENUM[404] }
    }

    const promise = new Promise((resolve) => {
        setTimeout(() => {

            axios(DETAIL_URL + id).then(
                (res) => {
                    // const { code, info, data } = res.data
                    // if (code != SUCCESS_CODE) {
                    //     resolve({ error: { code, info } })
                    //     return
                    // }
                    // resolve(data)
                }
            )
        }, 3000)
    })
    return await promise
}

export default detail