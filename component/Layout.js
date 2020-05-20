import { Affix, BackTop } from 'antd'
import { useState, useMemo, createContext } from 'react'

import Header from '../component/Header'
import Sider from '../component/Sider'
import Footer from '../component/Footer'

import '../static/style/component/layout.css'

// xs: <576
// sm：≥576
// md: ≥768
// lg: ≥992
// xl: ≥1200
// xxl: ≥1600


/**
 * 公用布局
 */
export const siderContext = createContext()

export default ({ main, menuKeys }) => {

    const [siderVisible, setSiderVisible] = useState(false)

    const footer = useMemo(() => (<Footer />), [])

    const sider = useMemo(() => (
        <siderContext.Provider value={{ siderVisible, setSiderVisible }}>
            <Sider
                className="sider"
                menuKeys={menuKeys}
            />
        </siderContext.Provider>
    ), [siderVisible])

    return (
        <>
            <div id="root">
                <div className={`${siderVisible ? 'root-lose' : ''}`}>
                    <Affix offsetTop={0}>
                        <siderContext.Provider value={{ setSiderVisible }}>
                            <Header menuKeys={menuKeys}/>
                        </siderContext.Provider>
                    </Affix>
                    {footer}
                    <BackTop />
                </div>
            </div>
            {sider}
        </>
    )
}