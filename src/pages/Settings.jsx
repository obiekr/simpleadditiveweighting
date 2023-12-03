import { useEffect, useState } from 'preact/hooks'
import DUMMYSETTINGS from '../../dummySettings.json'
import ValueTable from '../components/ValueTable'
import ValueRange from '../components/ValueRange'

export default function Settings({ setPage }) {
    const [settings, setSettings] = useState(DUMMYSETTINGS)
    const [activeTab, setActiveTab] = useState(0)

    function addRow() {
        // get last id of settings
        const lastId = settings[settings.length - 1]?.id ?? 0
        const newSettings = [...settings, { id: lastId+1, criteria: '', weight: '' }]
        setSettings(newSettings)
        localStorage.setItem('settings', JSON.stringify(newSettings))
    }

    function deleteRow(id) {
        const newSettings = [...settings]
        const index = newSettings.findIndex(item => item.id === id)
        newSettings.splice(index, 1)
        setSettings(newSettings)
        localStorage.setItem('settings', JSON.stringify(newSettings))
    }

    function handleInput(e, id, fieldName) {
        const newSettings = settings.map((item) => {
            if (item.id === id) {
                if (fieldName === "type") {
                    if (e.target.value === "select") {
                        return { ...item, [fieldName]: e.target.value, value: [] };
                    } else {
                        return { ...item, [fieldName]: e.target.value, value: [0, 0] };
                    }
                }
                if (fieldName === "weight") {
                    const formatted = e.target.value.replace(/[^0-9.]/g, '')  // Remove non-numeric characters
                        .replace(/(\..*?)\..*/g, '$1')  // Allow only one dot (decimal point)
                        .replace(/^(\d*\.\d{0,2}).*$/g, '$1');
                    return { ...item, [fieldName]: formatted };
                }
                return { ...item, [fieldName]: e.target.value };
            }
            return item;
        });
        setSettings(newSettings);
        localStorage.setItem('settings', JSON.stringify(newSettings));
    }

    // function to check total weight is equal to 1
    function checkWeight() {
        const totalWeight = settings.reduce((acc, item) => {
            return acc + Number(item.weight) * 100
        }, 0)
        if (totalWeight !== 100) {
            return [false, totalWeight]
        } else {
            return [true, totalWeight]
        }
    }

    function handleSubmit(e) {
        e.preventDefault()
        const [valid, totalWeight] = checkWeight()
        if (valid) {
            setPage("input")
        } else {
            alert('Total weight must equal to 1. Current total weight is ' + totalWeight / 100)
        }
    }

    useEffect(() => {
        const localSettings = JSON.parse(localStorage.getItem('settings'))
        if (localSettings) {
            setSettings(localSettings)
        }
    }, [])

    return (
        <form onSubmit={(e) => handleSubmit(e)}>
            <div className="flex justify-end my-4 gap-x-6">
                <button type='submit' className="btn btn-primary ">Save Settings</button>
            </div>
            <div className="overflow-x-auto">
                <table className="table my-5">
                    {/* head */}
                    <thead>
                        <tr>
                            <th>Settings</th>
                            <th>Weight</th>
                            <th>Attributes</th>
                            <th>Value Type</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            settings.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td className='p-1 '>
                                            <input type="text" onInput={(e) => handleInput(e, item.id, "criteria")} required={true} className="input input-bordered w-40 2xl:w-auto" placeholder={`Criteria ${index + 1}`} value={item.criteria} name='criteria' />
                                        </td>
                                        <td className='p-1 '>
                                            <input type="text" onInput={(e) => handleInput(e, item.id, "weight")} required={true} className="input input-bordered w-40 2xl:w-auto" placeholder={0.01} value={item.weight} name='weight' />
                                        </td>
                                        <td className="p-1">
                                            <select className={`select w-4/5 max-w-xs
                                                    ${item.modifier === "benefit" && "select-success"} 
                                                    ${item.modifier === "cost" && "select-error"} 
                                                    ${!item.modifier && "select-primary"} `}
                                                required={true}
                                                name='modifier'
                                                onChange={(e) => handleInput(e, item.id, "modifier")}
                                            >
                                                <option disabled value="" selected={!item.modifier}>Atrributes</option>
                                                <option value={"benefit"} selected={item.modifier === "benefit"}>
                                                    Benefit
                                                </option>
                                                <option value={"cost"} selected={item.modifier === "cost"}>Cost</option>
                                            </select>
                                        </td>
                                        <td className="p-1">
                                            <select className={`select w-4/5 max-w-xs select-primary`}
                                                required={true} onChange={(e) => handleInput(e, item.id, "type")} name='type'
                                            >
                                                <option disabled value="" selected={!item.type}>Value Type</option>
                                                <option value={"select"} selected={item.type === "select"}>Categorical</option>
                                                <option value={"range"} selected={item.type === "range"}>Score</option>
                                            </select>
                                        </td>
                                        <td className='p-1 '>
                                            <button type="button" className="btn btn-error" onClick={() => deleteRow(item.id)}>Delete Row</button>
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


            <div className="my-5">
                <div role="tablist" className="tabs tabs-lifted">
                    {
                        settings.map((item, index) => {
                            return (
                                <a role="tab"
                                    className={`tab ${index === activeTab && "tab-active"}`}
                                    onClick={() => setActiveTab(index)}
                                >
                                    {item.criteria}
                                </a>
                            )
                        })
                    }
                </div>
                {settings[activeTab]?.type === "select" &&
                    <ValueTable
                        settings={settings} activeTab={activeTab}
                        setSettings={setSettings} />
                }
                {settings[activeTab]?.type === "range" &&
                    <ValueRange settings={settings}
                        activeTab={activeTab}
                        setSettings={setSettings} />
                }
            </div>
        </form>
    )
}
