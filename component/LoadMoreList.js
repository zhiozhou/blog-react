import { Button, List } from 'antd'
import { useEffect, useState } from 'react'
import '../static/style/component/loadMoreList.css'



const pool = {}
/**
 * 
 * 封装List组件，提供缓存式自动加载
 * 
 * @param {string} className 类名称
 * @param {string} cache 当组件卸载时依然缓存数据
 * @param {function} getData 获取数据的方法,会自动传入页数page和一个接收返回值为{list,hasMore}的钩子函数
 * @param {item => ReactNode} itemRender 数据渲染方式
 * @param {ReactNode} itemSeatRender 获取数据时占位元素
 * @param {string} listkey 列表数据标识
 * @param {object} locale 列表文案
 * @param {ReactNode} loadMore 加载更多的样式
 * @param {any[]} rawData 初始数据，当存在初始数据时，初始化不进行获取数据
 * @param {boolean} rawHasMore 初始是否还有更多
 * @param {boolean} split 列表是否带分割线
 */
const LoadMoreList = ({
    cache = true,
    className,
    getData,
    itemRender,
    itemSeatRender,
    listkey,
    locale,
    loadMore = (<Button className="loadMore">加载更多</Button>),
    rawData = [],
    rawHasMore = true,
    split = true
}) => {

    const [data, setData] = useState(),
        [loading, setLoading] = useState(false)

    useEffect(() => {

        let member = pool[listkey]
        if (!member) {
            pool[listkey] = member = {
                page: 0,
                data: rawData,
                hasMore: rawHasMore
            }
        }
        let { page, data: _data, hasMore } = member

        0 == rawData.length && hasMore ?
            getData(++page, ({ list = [], hasMore }) => {
                let tempData = _data.concat(list)
                pool[listkey] = { hasMore, page, data: tempData }
                setData(tempData)
            })
            : setData(_data)

        if (!cache) {
            return () => delete pool[listkey]
        }
    }, [listkey])


    const onLoadMore = () => {
        let { page, hasMore } = pool[listkey]
        if (!hasMore) return

        setLoading(true)
        getData(++page, ({ list = [], hasMore }) => {
            let tempData = data.concat(list)
            pool[listkey] = { hasMore, page, data: tempData }
            setLoading(false)
            setData(tempData)
            window.dispatchEvent(new Event('resize'))
        })
    }

    const _loadMore = (
        <div onClick={onLoadMore} >
            {loadMore}
        </div>
    )


    let hasMore = pool[listkey] ? pool[listkey].hasMore : rawHasMore
    return (
        <List
            split={split}
            locale={locale}
            dataSource={data}
            className={className}
            loadMore={data && hasMore && !loading && _loadMore}
            renderItem={item => (<List.Item listkey={item.id}>{itemRender(item, listkey)}</List.Item>)}
        >
            {(!data || loading) && itemSeatRender}
        </List>
    )
}
export default LoadMoreList