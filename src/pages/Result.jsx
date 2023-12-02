import { useEffect, useState } from 'preact/hooks'
import DUMMY from '../../dummy.json'
import DUMMYSETTINGS from '../../dummySettings.json'

export default function Result({ setPage }) {
    const [data, setData] = useState(DUMMY)
    const [settings, setSettings] = useState(DUMMYSETTINGS)

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

    function criteriaMatrix() {
        const matrix = []
        data.forEach((item, index) => {
            const row = []
            settings.forEach((setting, index) => {
                if (setting.type === 'select') {
                    row.push(setting.value.indexOf(item[setting.criteria]) + 1)
                } else {
                    row.push(Number(item[setting.criteria]))
                }
            })
            matrix.push(row)
        })
        return matrix
    }
    // return array of max and min value of each criteria based on the modifier
    function getMaxMin() {
        const maxmin = []
        // get max value of criteria if setting modifier is benefit
        settings.forEach((setting, index) => {
            if (setting.modifier === 'benefit') {
                maxmin.push(Math.max(...criteriaMatrix().map(item => item[index])))
            } else {
                maxmin.push(Math.min(...criteriaMatrix().map(item => item[index])))
            }
        })
        return maxmin
    }

    function normalizeMatrix() {
        const normalized = []
        const maxmin = getMaxMin()
        criteriaMatrix().forEach((item, index) => {
            const row = []
            item.forEach((value, index2) => {
                if (settings[index2].modifier === 'benefit') {
                    row.push(Math.round(value / maxmin[index2] * 1000) / 1000)
                } else {
                    row.push(Math.round(maxmin[index2] / value * 1000) / 1000)
                }
            })
            normalized.push(row)
        })
        return normalized
    }

    function calculateSimpleAddtiveWeight() {
        const normalized = normalizeMatrix()
        const weight = settings.map(item => item.weight)
        console.log(weight)
        const result = []
        normalized.forEach(item => {
            let sum = 0
            item.forEach((value, index) => {
                sum += value * weight[index]
            })
            result.push(Math.round(sum * 1000) / 1000)
        })
        return result
    }

    function sortNameByRank() {
        const score = calculateSimpleAddtiveWeight()
        let sortedDatabyScore = [...data]

        // append score to data
        sortedDatabyScore.forEach((item, index) => {
            item.score = score[index]
        })

        // sort data by score
        sortedDatabyScore.sort((a, b) => {
            return b.score - a.score
        })

        return sortedDatabyScore
    }

    return (
        <div>
            <div className="flex justify-left my-4 gap-x-6">
                <button className="btn btn-primary " onClick={() => setPage("input")}>Back</button>
            </div>
            <div className="flex flex-col align-middle w-full gap-10">
                <div className="overflow-x-auto">
                    <h3 className='text-center'>Priorities</h3>
                    <table className="table my-5 max-w-md bg-neutral mx-auto">
                        {/* head */}
                        <thead>
                            <tr>
                                <th className='text-center w-28'>Rank</th>
                                <th>Employees</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                sortNameByRank().map((item, index) => (
                                    <tr key={index}>
                                        <th className='text-center'>{index + 1}</th>
                                        <td className='p-1 '>
                                            {item.nama}
                                        </td>
                                    </tr>
                                ))
                            }
                            {/* row 1 */}
                        </tbody>
                    </table>
                </div>

                <div className="overflow-x-auto">
                    <h3 className='text-center'>Criteria Matrix</h3>
                    <table className="table my-5 bg-base-200">
                        {/* head */}
                        <thead>
                            <tr>
                                <th className='text-center'>Alternatives</th>
                                <th>Employees</th>
                                {
                                    settings.map((setting, index) => {
                                        return (
                                            <th className='text-center' key={index}>{setting.criteria} (C{index + 1})</th>
                                        )
                                    })
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <th className='text-center'>{index + 1}</th>
                                            <td className='p-1 '>
                                                {item.nama}
                                            </td>
                                            {
                                                criteriaMatrix()[index].map((value, index) =>
                                                    <td key={index} className='text-center'>{value}</td>
                                                )
                                            }
                                        </tr>
                                    )
                                })
                            }
                            <tr className='bg-base-300'>
                                <th className='text-center'>Max/Min</th>
                                <td className='p-1 '>
                                </td>
                                {
                                    getMaxMin().map((value, index) =>
                                        <td key={index} className='text-center'>{value}</td>
                                    )
                                }
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="overflow-x-auto">
                    <h3 className='text-center'>Normalization Matrix</h3>
                    <table className="table my-5 bg-base-200">
                        {/* head */}
                        <thead>
                            <tr>
                                <th className='text-center'>Alternatives</th>
                                <th>Employees</th>
                                {
                                    settings.map((setting, index) => {
                                        return (
                                            <th className='text-center' key={index}>{setting.criteria} (C{index + 1})</th>
                                        )
                                    })
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <th className='text-center'>{index + 1}</th>
                                            <td className='p-1 '>
                                                {item.nama}
                                            </td>
                                            {
                                                normalizeMatrix()[index].map((value, index) =>
                                                    <td key={index} className='text-center'>{value}</td>
                                                )
                                            }
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>

                <div className="overflow-x-auto">
                    <h3 className='text-center'>Weight</h3>
                    <table className="table my-5 bg-base-200">
                        {/* head */}
                        <thead>
                            <tr>
                                {
                                    settings.map((setting, index) => {
                                        return (
                                            <th className='text-center' key={index}>{setting.criteria} (C{index + 1})</th>
                                        )
                                    })
                                }
                            </tr>
                        </thead>
                        <tbody>
                            <tr className='bg-base-300'>
                                {
                                    settings.map((setting, index) =>
                                        <td key={index} className='text-center'>{setting.weight}</td>
                                    )
                                }
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="overflow-x-auto">
                    <h3 className='text-center'>Score Matrix</h3>
                    <table className="table my-5 bg-base-200 max-w-md mx-auto">
                        {/* head */}
                        <thead>
                            <tr>
                                <th className='text-center'>Alternatives</th>
                                <th>Employees</th>
                                <th className='text-end'>Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                calculateSimpleAddtiveWeight().map((item, index) => (
                                    <tr key={index}>
                                        <th className='text-center'>{index + 1}</th>
                                        <td className='p-1 '>
                                            {data[index].nama}
                                        </td>
                                        <td className='text-end'>{item}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
