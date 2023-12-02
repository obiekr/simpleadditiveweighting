import Sidebar from './components/Sidebar'
import InputTable from './pages/InputTable'
import { useState } from 'preact/hooks'
import Result from './pages/Result'
import Settings from './pages/Settings'

export function App() {
    const [page, setPage] = useState('input')
    return (
        <div className='w-full m-0 p-6'>
            <Sidebar setPage={setPage}/>
            {page === 'input' && <InputTable setPage={setPage}/>}
            {page === 'result' && <Result setPage={setPage}/>}
            {page === 'settings' && <Settings setPage={setPage}/>}
        </div>
    )
}
