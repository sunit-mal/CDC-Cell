import React from 'react'
import { GiReturnArrow } from 'react-icons/gi'

function CVView({ pdf, username }) {

    console.log(pdf);

    const backToProfile = () => {
        window.location.href = '/profile/'+username;
    }

    return (
        <>
            <iframe
                title="PDF Viewer"
                src={pdf}
                width="100%"
                height={window.innerHeight + "px"}
                frameBorder="0"
            />
            <GiReturnArrow className='z-3 position-fixed bottom-0 end-0 pdfClose test rounded-circle' size={50} onClick={backToProfile} style={{ cursor: 'pointer' }} />
        </>
    )
}

export default CVView