import React from "react"

interface LoaderProps {
    show: boolean
}

export const Loader: React.FC<LoaderProps> = (show) => {

    if(!show){
        return <React.Fragment></React.Fragment>
    }

    return(
       <div id="loader" style={{
        backgroundImage: 'linear-gradient(135deg, rgba(30, 30, 30, 0.3), rgba(45, 65, 90, 0.3))',
        width: '100%',
        height: '100%',
        zIndex: 99999,
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
       }}>
            <div style={{
                position: 'absolute',
                alignContent: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <div className="lds-facebook">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
       </div> 
    )
}