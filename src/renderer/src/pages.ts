import { BsHouseDoor, BsArrowDownUp, BsGear, BsGearFill } from 'react-icons/bs'
import { BsFillHouseDoorFill } from 'react-icons/bs'

export const navItems = [
  {
    path: '/',
    label: 'Dashboard',
    icon: BsHouseDoor,
    activeIcon: BsFillHouseDoorFill
  },
  {
    path: '/transactions',
    label: 'Transactions',
    icon: BsArrowDownUp,
    activeIcon: BsArrowDownUp
  },
  {
    path: '/settings',
    label: 'Settings',
    icon: BsGear,
    activeIcon: BsGearFill
  }
]
