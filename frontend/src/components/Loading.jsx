import {useApp} from "../AppContext.jsx";

function Loading() {
    const { loading } = useApp();

    return(
        <>
            {loading &&
                <div className="h-screen w-full fixed top-0 left-0 backdrop-blur-sm flex justify-center items-center">
                    <span className="loading loading-spinner loading-lg bg-primary"></span>
                </div>
            }
        </>
    );
}

export default Loading;