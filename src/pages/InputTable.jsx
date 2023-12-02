import { useEffect, useState } from 'preact/hooks'
import DUMMY from '../../dummy.json'
import DUMMYSETTINGS from '../../dummySettings.json'

export default function InputTable({ setPage }) {
    const [data, setData] = useState(DUMMY)
    const [settings, setSettings] = useState(DUMMYSETTINGS)

    function addRow() {
        const newData = [...data, { id: data.slice(-1)[0]?.id + 1 ?? 0, nama: '', masa_kerja: '', level_jabatan: '', departemen: '', evaluasi_atasan: '', peringatan_karyawan: '' }]
        setData(newData)
        localStorage.setItem('data', JSON.stringify(newData))
    }

    function deleteRow(id) {
        const newData = [...data]
        const index = newData.findIndex(item => item.id === id)
        newData.splice(index, 1)
        setData(newData)
        localStorage.setItem('data', JSON.stringify(newData))
    }

    function handleInput(e, id, fieldName) {
        const newData = data.map((item) => {
            if (item.id === id) {
                return { ...item, [fieldName]: e.target.value };
            }
            return item;
        });
        setData(newData);
        localStorage.setItem('data', JSON.stringify(newData));
    }

    function handleSubmit(e){
        e.preventDefault()
        localStorage.setItem('data', JSON.stringify(data));
        setPage("result")
    }


    useEffect(() => {
        const localData = JSON.parse(localStorage.getItem('data'))
        const localSettings = JSON.parse(localStorage.getItem('settings'))
        if (localData) {
            setData(localData)
        }
        if (localSettings) {
            setSettings(localSettings)
        }
    }, [])

    return (
        <form className="" onSubmit={(e) => handleSubmit(e)}>
            <div className="flex justify-end my-4 gap-x-6 w-full">
                <button type='submit' className="btn btn-primary w-1/6">Calculate</button>
            </div>
            <div className="overflow-x-auto">
                <table className="table my-5">
                    {/* head */}
                    <thead>
                        <tr>
                            <th></th>
                            <th>Karyawan</th>
                            {settings.map((item, index) => {
                                return (
                                    <th key={index}>{item.criteria}</th>
                                )
                            })}
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <th>{index + 1}</th>
                                        <td className='p-1 '>
                                            <input type="text" onInput={(e) => handleInput(e, item.id, "nama")} required={true} className="input input-bordered w-40 2xl:w-auto" placeholder="Nama Karyawan" value={item.nama} name='nama' />
                                        </td>                                        {
                                            settings.map((setting, index) => {
                                                if (setting.type === 'select') {
                                                    return (
                                                        <td className='p-1 '>
                                                            <select className="select select-bordered w-40 2xl:w-auto" onChange={(e) => handleInput(e, item.id, setting.criteria)} required={true} value={item[setting.criteria]} name={setting.criteria}>
                                                                <option disabled selected value="">Select an option</option>
                                                                {
                                                                    setting.value.map((option, index) => {
                                                                        return (
                                                                            <option key={index} value={option} selected={item[setting.criteria] === option}>
                                                                                {option}
                                                                            </option>
                                                                        )
                                                                    })
                                                                }
                                                            </select>
                                                        </td>
                                                    )
                                                } else {
                                                    return (
                                                        <td className='p-1'>
                                                            <input type="number" onInput={(e) => handleInput(e, item.id, setting.criteria)} required={true} min={setting.value[0]} max={setting.value[1]} className="input input-bordered w-40 2xl:w-auto text-right" placeholder={setting.criteria} value={item[setting.criteria]} name={setting.criteria} />
                                                        </td>
                                                    )
                                                }
                                            })
                                        }
                                        <td className='p-1 '>
                                            <button className="btn btn-error" onClick={() => deleteRow(item.id)}>
                                                Delete Row
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                        {/* row 1 */}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center my-10 gap-x-6">
                <button className="btn btn-secondary w-2/5" onClick={addRow}>Add Row</button>
            </div>
        </form>
    )
}
