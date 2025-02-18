import { Bot, House, TrendingUpDown } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'
import { useAuthClient } from '@/hooks/useAuthClient'
import { Link } from 'react-router-dom'

const sideBarList = [
  {
    title: "Dashboard",
    icon: <House />,
    link: "/dashboard"
  },
  {
    title: "Trade Bot",
    icon: <Bot />,
    link: "/trade-bot"
  },
  {
    title: "Trades",
    icon: <TrendingUpDown />,
    link: "/trades"
  }
]

const Sidebar = () => {
  const { login, isAuthenticated, logout } = useAuthClient();

  return (
    <div className='w-full h-full bg-[#1b1b22] p-4 flex flex-col'>
      <h1 className='text-white text-center mt-4'> DeFiSeer AI </h1>
      <div className='p-2 mt-8'>
        <hr />
      </div>
      <div className='mt-8'>
        {sideBarList.map((item, index) => (
          <div key={index} className='flex items-center gap-4 text-white text-sm my-4'>
            <Button className='w-full flex justify-start items-center gap-2 p-4'>
              {item.icon}
              <h1>{item.title}</h1>
            </Button>
          </div>
        ))}
      </div>
      <div className='w-full h-full flex justify-end items-end'>
        <Link to={'/'} className='w-full'>
          <Button onClick={logout} className='w-full flex text-center justify-center items-center gap-2 p-4'>
            Sign Out
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default Sidebar