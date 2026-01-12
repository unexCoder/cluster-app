interface FlyerLoaderProps {
    url?:string
    width?:number | string
    height?:number | string
}

export default function FlyerDisplay( {url,width,height}:FlyerLoaderProps ) {
    const apiSrc = url ? url : '/api/postcard?'
    return (
        <>
            <img
                src={apiSrc}
                width={width}
                height={height}
                alt="Cluster event flyer"
                // className="w-full h-auto"
            />
        </>
    )
}
