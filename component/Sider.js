
import { Avatar, Drawer } from 'antd'
import { useMemo } from 'react'
import Link from 'next/link'

import Menu from './Menu'
import Sns from './Sns'

import '../static/style/component/sider.less'

const name = 'zhou',
    avatar = 'https://s.gravatar.com/avatar/f4ca98d8768ec3ac3e761335e3f94d1d?s=458&r=g'

const Profile = () => (
    <div className="profile">
        <div>
            <Link href="/">
                <a>
                    <Avatar shape="square" size={128} src={avatar} />
                </a>
            </Link>
            <div className="name">{name}</div>
        </div>
    </div>
)

/**
 * 小屏侧栏
 */
const Sider = ({ className, menuKeys, visible, onClose, openSpin }) => {

    const menu = useMemo(() => (
        <div>
            <Menu
                menuKeys={menuKeys}
                loseSider={onClose}
                openSpin={openSpin}
            />
        </div>
    ), [menuKeys, openSpin])

    const sns = useMemo(() => (<Sns />), [])

    const profile = useMemo(() => (<Profile />), [])

    return (
        <Drawer
            className={className}
            placement="left"
            width={225}
            closable={false}
            maskStyle={{ backgroundColor: 'transparent' }}
            onClose={onClose}
            visible={visible}
        >
            {profile}
            {menu}
            <div className="sider-footer">{sns}</div>
        </Drawer>
    )
}

export default Sider