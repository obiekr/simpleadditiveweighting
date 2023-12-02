import React, { useState } from 'react'


export default function Sidebar({ setPage }) {

  // reset localstorage
  function reset() {
    localStorage.removeItem("settings")
    localStorage.removeItem("data")
    window.location.reload()
    console.log("true")
  }

  return (

    <div className="drawer w-full">
      <div className="navbar bg-base-100 gap-x-10">
        <div className="flex-none">
          <div className="drawer-content">
            {/* Page content here */}
            <label htmlFor="my-drawer" className="btn btn-primary drawer-button">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </label>
          </div>
        </div>
        <div className="flex">
          <a className="btn btn-ghost text-xl">Gajian</a>
        </div>

      </div>
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-side z-50">
        <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className="menu p-4 w-64 min-h-full bg-base-200 text-base-content  h-full flex flex-col justify-between">
          {/* Sidebar content here */}
          <div className="">
            <a className="btn btn-ghost text-xl">Gajian</a>
            <div className="mt-16">
              <li><a onClick={() => setPage("input")}>Input Karyawan</a></li>
              <li><a onClick={() => setPage("settings")}>Settings</a></li>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="btn">
              <label className="flex cursor-pointer gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" /></svg>
                <input type="checkbox" value="dracula" className="toggle theme-controller" />
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
              </label>
            </div>
            <button onClick={reset} className='btn btn-warning '>
              Reset
            </button>
          </div>
        </ul>
      </div>
    </div>
  )
}
