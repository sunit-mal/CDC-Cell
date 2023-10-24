import React from 'react'
import { AiFillCloseCircle } from 'react-icons/ai'
import { request } from '../Axios_helper';

function JobDetailsView({ id }) {

    const [pdf, setPdf] = React.useState(null);

    React.useEffect(() => {
        request(
            'get',
            'job/'+id,
            'application/json',
            {},
            'blob'
        ).then((response) => {
            setPdf(URL.createObjectURL(response.data));
            
        }).catch((error) => {
            setPdf(null)
            console.error(error);
        });
    },[id]);

    const backToProfile = () => {
        window.location.href = '/';
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
            <AiFillCloseCircle className='z-3 position-fixed bottom-0 end-0 pdfClose test rounded-circle' size={50} onClick={backToProfile} style={{ cursor: 'pointer' }} />
        </>
    )
}

export default JobDetailsView