import { Bot, House, TrendingUpDown } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'
import { useAuthClient } from '@/context/useAuthClient'
import { Link } from 'react-router-dom'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

const sideBarList = [
  {
    title: "Dashboard",
    icon: <House />,
    link: "/dashboard",
    disabled: false,
  },
  {
    title: "Trade Bot",
    icon: <Bot />,
    link: "/trade-bot",
    disabled: true,
  },
  {
    title: "Trades",
    icon: <TrendingUpDown />,
    link: "/trades",
    disabled: true,
  }
]

const Sidebar = () => {
  const { logout } = useAuthClient();

  return (
    <div className='w-full h-full bg-[#1b1b22] p-4 flex flex-col'>
      <h1 className='text-white text-center mt-4'> DeFiSeer AI </h1>
      <div className='p-2 mt-8'>
        <hr />
      </div>
      <div className='mt-8'>
        {sideBarList.map((item, index) => (
          <div key={index} className='flex items-center gap-4 text-white text-sm my-4'>
            {item.disabled ? (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className='w-full bg-black flex justify-start items-center gap-2 p-4 opacity-50 cursor-not-allowed text-white'>
                    {item.icon}
                    <h1 className='text-white'>{item.title}</h1>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className='text-xl font-mono'>Coming Soon</DialogTitle>
                    <p className='text-[14px]'>This feature is not available yet. Stay tuned for updates!</p>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            ) : (
              <Link to={item.link} className='w-full'>
                <Button className='w-full flex justify-start items-center gap-2 p-4'>
                  {item.icon}
                  <h1>{item.title}</h1>
                </Button>
              </Link>
            )}
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
