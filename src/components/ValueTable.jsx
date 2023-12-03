export default function ValueTable({ settings, activeTab, setSettings }) {

    function handleInput(e, index) {
        const newSettings = [...settings]
        newSettings[activeTab].value[index] = e.target.value
        setSettings(newSettings)
        localStorage.setItem('settings', JSON.stringify(newSettings))
    }

    function addRow() {
        const newSettings = [...settings]
        newSettings[activeTab].value.push('')
        setSettings(newSettings)
        localStorage.setItem('settings', JSON.stringify(newSettings))
    }

    function deleteRow(index) {
        const newSettings = [...settings]
        newSettings[activeTab].value.splice(index, 1)
        setSettings(newSettings)
        localStorage.setItem('settings', JSON.stringify(newSettings))
    }

    return (
        <div className="">
            <p className="my-5 mx-10">*Enter value starting from the lowest value</p>
            <table className="table my-5">
                {/* head */}
                <thead>
                    <tr>
                        <th className="text-center">No</th>
                        <th>Value</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        settings[activeTab].value.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td className='p-1 text-center'>
                                        {index + 1}
                                    </td>
                                    <td className='p-1 '>
                                        <input type="text" onInput={(e) => handleInput(e, index)} required={true} className="input input-bordered w-full" placeholder={`Value ${index + 1}`} value={item} name='criteria' />
                                    </td>
                                    <td className='p-1 '>
                                        <button type="button" className="btn btn-error" onClick={() => deleteRow(index)}>Delete Row</button>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
            <div className="flex justify-center my-10 gap-x-6">
                <button type="button" className="btn btn-secondary w-full sm:w-2/5" onClick={addRow}>Add Row</button>
            </div>
        </div>
    )
}
