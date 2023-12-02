import { useEffect, useState } from "preact/hooks";

export default function ValueRange({ settings, activeTab, setSettings }) {
    const [min, setMin] = useState('0');
    const [max, setMax] = useState('10');

    const handleInput = (e, field) => {
        // Remove non-numeric characters and allow only two decimal point
        const sanitizedValue = e.target.value.replace(/[^0-9.]/g, '')  // Remove non-numeric characters
            .replace(/(\..*?)\..*/g, '$1')  // Allow only one dot (decimal point)
            .replace(/^(\d*\.\d{0,2}).*$/g, '$1');  // Allow up to two decimal places

        const newSettings = [...settings]

        if (field === "min") {
            newSettings[activeTab].value[0] = sanitizedValue
            setMin(sanitizedValue);
        } else {
            newSettings[activeTab].value[1] = sanitizedValue
            setMax(sanitizedValue);
        }
        setSettings(newSettings)
        localStorage.setItem('settings', JSON.stringify(newSettings))
    };

    useEffect(() => {
        setMin(settings[activeTab].value[0])
        setMax(settings[activeTab].value[1])
    }, [])

    return (
        <div className="flex flex-col gap-6 px-10 py-4">
            <div className="">
                <h1>Minimum Number</h1>
                <input
                    type="text"
                    placeholder="Type here"
                    className="input input-bordered w-full max-w-xs"
                    value={min}
                    onInput={(e) => handleInput(e, "min")}
                />
            </div>
            <div className="">
                <h1>Maximum Number</h1>
                <input
                    type="text"
                    placeholder="Type here"
                    className="input input-bordered w-full max-w-xs"
                    value={max}
                    onInput={(e) => handleInput(e, "max")}
                />
            </div>
        </div>
    )
}
