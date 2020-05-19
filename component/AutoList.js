import { List } from 'antd'
import { useState, useEffect } from 'react'

import WindowScroller from 'react-virtualized/dist/commonjs/WindowScroller'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import VList from 'react-virtualized/dist/commonjs/List'
import InfiniteLoader from 'react-virtualized/dist/commonjs/InfiniteLoader'



var tasks = 0, // 任务数
  hasMore = true


/**
* 无限滚动列表
* getData 获取数据的方式,返回数据为 {data:DATA,hasMore:HASMORE}
* itemRender 单元素渲染
* itemSeatRender   加载时的占位
*/
const AutoList = ({ className, getData, itemRender, itemHeight = 150, itemSeatRender }) => {

  console.log(`autolist render`)
  console.log(hasMore)

  const [data, setData] = useState(),
    [loading, setLoading] = useState(false)

  useEffect(() => {
    getData(r => {
      hasMore = r.hasMore
      setData(r.list)
    })
  }, [])

  // 未获取到数据使用seat占位
  if (!data) {
    console.log('init 占位')
    return itemSeatRender
  }

  console.log('大行其道')
  var loadedRowsMap = {}
  const loadMoreRows = ({ startIndex, stopIndex }) => {
    if (!hasMore) return

    setLoading(true)
    for (let i = startIndex; i <= stopIndex; i++) {
      loadedRowsMap[i] = 1
    }

    ++tasks
    getData(r => {
      setData(data.concat(r.list))
      --tasks <= 0 && setLoading(false)
      hasMore = r.hasMore
    })
  }

  const
    renderItem = ({ index, key, style }) => {
      return (
        <List.Item key={key} style={style}>
          {
            itemRender(data[index])
          }
        </List.Item>
      )
    },
    vlist = ({ height, isScrolling, onChildScroll, scrollTop, onRowsRendered, width }) => (
      <VList
        autoHeight
        height={height}
        isScrolling={isScrolling}
        onScroll={onChildScroll}
        overscanRowCount={2}
        rowCount={data.length}
        rowHeight={itemHeight}
        rowRenderer={renderItem}
        onRowsRendered={onRowsRendered}
        scrollTop={scrollTop}
        width={width}
      />
    ),
    autoSize = ({ height, isScrolling, onChildScroll, scrollTop, onRowsRendered }) => (
      <AutoSizer disableHeight>
        {({ width }) =>
          vlist({
            height,
            isScrolling,
            onChildScroll,
            scrollTop,
            onRowsRendered,
            width,
          })
        }
      </AutoSizer>
    )

  const
    isRowLoaded = ({ index }) => !!loadedRowsMap[index],
    infiniteLoader = ({ height, isScrolling, onChildScroll, scrollTop }) => (
      <InfiniteLoader
        isRowLoaded={isRowLoaded}
        loadMoreRows={loadMoreRows}
        rowCount={data.length}
      >
        {({ onRowsRendered }) =>
          autoSize({
            height,
            isScrolling,
            onChildScroll,
            scrollTop,
            onRowsRendered,
          })
        }
      </InfiniteLoader>
    )
  return (
    <List className={className}>
      {data.length > 0 && <WindowScroller>{infiniteLoader}</WindowScroller>}
      {loading && itemSeatRender}
    </List>
  )
}


export default AutoList