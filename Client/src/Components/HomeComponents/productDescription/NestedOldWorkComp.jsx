import "./nestedOldWork.css"
import { globalUrl} from '../../../API/config.jsx'
import { useSelector } from 'react-redux'


const NestedOldWorkComp = () => {
    const singleService = useSelector(state => state.services.singleService)
    return (
        <div className="grid xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5 relative z-20 py-12">
            {singleService?.oldWork?.map((item, index) => (
                <div key={index}>
                    <div className="flex flex-col w-[300px] md:w-full">
                        <img
                            src={globalUrl + item.largeImage}
                            className="w-[334px] h-[211px] mx-auto mb-4"
                            alt=""
                        />
                        <p className="text-[22px] text-gray-400 mb-2">
                            {item?.projectCategory?.title}
                        </p>
                        <h2 className="text-2xl tracking-tight text-gray-900  mb-4 font-[500]">
                            {item?.title}
                        </h2>
                        <button className="hidden border-2 border-icon text-icon px-4 py-2 rounded-3xl mt-3">
                            View Details
                        </button>
                    </div>
                </div>
            ))
            }
        </div>
    )
}

export default NestedOldWorkComp;