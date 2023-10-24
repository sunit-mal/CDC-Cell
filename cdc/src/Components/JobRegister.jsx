import React from 'react';
import { request } from '../Axios_helper';
import { Container, Row, Col, Stack, Image, Collapse, Button, Card, Table, Form, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { AiFillDelete } from 'react-icons/ai';
import { BiCloudUpload, BiSolidUserCheck } from 'react-icons/bi';
import { errorToastify, successToastify } from './toastify'
import img from '../DemoData/img.jpg'
import JobEnquire from './JobEnquire';

function JobRegister() {
    const [postedJob, setPostedJob] = React.useState(false);
    const [newJob, setNewJob] = React.useState(false);
    const [jobData, setJobData] = React.useState([]);
    const [jobDescription, setJobDescription] = React.useState(null);
    const [imageData, setImageData] = React.useState(null);
    const fileInputRef = React.useRef(null);
    const [filename, setFilename] = React.useState('');
    const [jobEnquire, setJobEnquire] = React.useState({
        status: false,
        id: 0,
    });
    const [newJobData, setNewJobData] = React.useState({
        companyName: '',
        designation: '',
        lastSubDate: '',
    });
    const [userDetails, setUserDetails] = React.useState({
        Name: '',
        Email: '',
        userName: ''
    });

    React.useEffect(() => {
        const userDetailsString = window.localStorage.getItem('user_details');
        if (userDetailsString !== null) {
            const userDetail = JSON.parse(userDetailsString);
            // console.log(userDetail);
            if (userDetail.userType === 'ADMINISTRATOR' || userDetail.userType === 'editor') {
                setUserDetails({
                    Name: userDetail.firstName + " " + userDetail.lastName,
                    Email: userDetail.email,
                    userName: userDetail.email
                })
            } else if (userDetail.userType === 'student') {
                window.location.href = '/';
            } else {
                window.location.href = '/login';
            }
        }

    }, [userDetails.userName]);

    React.useEffect(() => {
        getAllJobs();
    }, []);

    const getAllJobs = () => {
        request(
            'get',
            '/job/all',
            'application/json',
            {},
            'josn'
        ).then((response) => {
            const values = JSON.parse(response.data);
            setJobData(values);
            // console.log(values);
        }).catch((error) => {
            console.log(error);
        });
    };

    const getCV = (event) => {
        const file = event.target.files[0];
        if (file !== undefined) {
            setFilename(file.name);
            setJobDescription(file);
        } else {
            errorToastify('No file selected.');
        }
    }

    const registerNewJob = () => {

        const fileExtension = filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);

        if (fileExtension.toLowerCase() === 'pdf') {
            const selectedFile = jobDescription;
            const size = (selectedFile.size) / (1024 * 1024);
            if (size < 10) {
                request(
                    'POST',
                    '/job/upload',
                    'multipart/form-data',
                    {
                        'jd': selectedFile
                    },
                    'json'
                ).then((response) => {
                    if (response.status === 200) {
                        registerJobData(response.data.fileName);
                    } else {
                        errorToastify("Job Description Uploading failed")
                    }
                    console.log(response.status + response.data.massage);
                }).catch((error) => {
                    errorToastify(error.response.data.massage)
                    console.error(error.response);
                });
            } else {
                errorToastify('File size is too large. Maximum file size is 10MB.');
            }
        } else {
            errorToastify('Selected file is not a .pdf file.');
        }
    }

    const registerJobData = (filename) => {
        request(
            'POST',
            '/job/register',
            'application/json',
            {
                'companyName': newJobData.companyName,
                'designation': newJobData.designation,
                'lastSubDate': newJobData.lastSubDate,
                'moreDetails': filename
            },
            'json'
        ).then((response) => {
            successToastify("Successfully Uploaded")
            // console.log(response.status + response.data);
            getAllJobs();
        }).catch((error) => {
            errorToastify(error.response.data.massage)
            console.error(error.response);
        });
    }

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setNewJobData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const deleteJob = (id) => {
        request(
            'DELETE',
            `/job/delete/${id}`,
            'application/json',
            {},
            'json'
        ).then((response) => {
            successToastify(response.data)
            // console.log(response.status + response.data);
            getAllJobs();
        }).catch((error) => {
            errorToastify(error.response.data)
            console.error(error.response);
        });
    }

    React.useEffect(() => {
        // successToastify(username)
        if (!userDetails.userName || userDetails.userName === '') {
            console.log('No username found for pic');
        } else {
            // Fetch the image data from your backend using axios
            const path = '/ProfilePic/' + userDetails.userName;
            request(
                'GET',
                path,
                'application/json',
                {},
                'blob'
            ).then((response) => {
                if (response.status === 200) {
                    const image = URL.createObjectURL(response.data);
                    setImageData(image);
                }
                else {
                    setImageData(null);
                }
            }).catch((error) => {
                console.error('Error fetching images:', error);
                setImageData(null);
            });

        }
    }, [userDetails.userName]);

    const handleUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];

        // Check if a file was selected
        if (selectedFile) {
            const fileName = selectedFile.name;
            const fileExtension = fileName.slice(((fileName.lastIndexOf(".") - 1) >>> 0) + 2);

            if (fileExtension.toLowerCase() === 'jpg') {

                const size = (selectedFile.size) / (1024 * 1024);

                if (size < 10) {
                    uploadProfilePic(selectedFile);
                } else {
                    errorToastify('File size is too large. Maximum file size is 10MB.');
                }

            } else {
                // The selected file does not have a .jpg extension
                errorToastify('Selected file is not a .jpg file.');
            }
        } else {
            errorToastify('No file selected.');
        }
    };

    const uploadProfilePic = (imageData) => {
        if (userDetails.userName === '' || userDetails.userName === null) {
            errorToastify('No username found');
        } else {

            const formData = new FormData();
            formData.append('image', imageData);
            const path = '/upload/' + userDetails.userName;

            // Make a POST request to your image upload endpoint
            request(
                'POST',
                path,
                'multipart/form-data',
                formData,
                'json'
            ).then((response) => {
                if (response.status === 200) {
                    setImageData(URL.createObjectURL(imageData));
                }
                successToastify(response.data.massage)
                // console.log(response.status + response.data.massage);
            }).catch((error) => {
                setImageData(null);
                errorToastify(error.response.data.massage)
                console.error(error.response);
            });
        }
    }

    const deleteClick = () => {
        if (userDetails.userName === '' || userDetails.userName === null) {
            errorToastify('No username found');
        }
        else {
            request(
                'DELETE',
                '/delete/' + userDetails.userName,
                'application/json',
                {},
                'json'
            ).then((response) => {
                setImageData(null);
                successToastify(response.data.massage)
            }).catch((error) => {
                errorToastify(error.response.data.massage)
                console.error(error.response);
            });
        }
    }
    const backToJobRegister = () => {
        setJobEnquire({
            status: false,
            id: 0,
        });
    }
    const jobEnquireHandel = (id) => {
        setJobEnquire({
            status: true,
            id: id,
        });
    }
    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            For More Details Click Here
        </Tooltip>
    );

    return (
        <>
            {jobEnquire.status ? <JobEnquire id={jobEnquire.id} back={backToJobRegister} /> : (
                <>
                    <Container className='my-3'>
                        <Row>
                            <Col sm={4} style={{ backgroundColor: '#05ffd59d', borderRadius: '10px' }}>
                                <Stack>
                                    <div className="p-2">
                                        <Image src={imageData == null ? img : imageData} roundedCircle width={150} height={150} /><br />
                                        <AiFillDelete size={30} onClick={deleteClick} />
                                        <BiCloudUpload size={30} onClick={handleUploadClick} />
                                    </div>
                                    <form encType="multipart/form-data">
                                        <input
                                            type="file"
                                            accept=".jpg"
                                            style={{ display: 'none' }}
                                            ref={fileInputRef}
                                            onChange={handleFileSelect}
                                        />
                                    </form>
                                    <div className="p-2">
                                        <div className="p-2">
                                            <figure>
                                                <blockquote className="blockquote">
                                                    <p>{userDetails.Name}</p>
                                                </blockquote>
                                                <figcaption className="blockquote-footer">
                                                    {userDetails.userName}
                                                </figcaption>
                                            </figure>
                                        </div>
                                    </div>
                                </Stack>
                            </Col>

                            <Col sm={8} style={{ backgroundColor: 'white' }} >
                                <Button
                                    onClick={() => setPostedJob(!postedJob)}
                                    aria-controls="example-collapse-text"
                                    aria-expanded={postedJob}

                                >
                                    Posted Jobs
                                </Button><br />
                                <Collapse in={postedJob} className='my-2'>
                                    <Card>
                                        <Card.Subtitle className='text-start mx-3 my-3'>
                                            <Table hover style={{ backgroundColor: '#EDFAE9' }}>
                                                <thead style={{ backgroundColor: '#EDFAE9' }}>
                                                    <tr style={{ color: 'gray' }}>
                                                        <th style={{ backgroundColor: '#EDFAE9' }}>Company Name</th>
                                                        <th style={{ backgroundColor: '#EDFAE9' }}>Designation</th>
                                                        <th style={{ backgroundColor: '#EDFAE9' }}>Post Date</th>
                                                        <th style={{ backgroundColor: '#EDFAE9' }}>Last Date</th>
                                                        <th style={{ backgroundColor: '#EDFAE9' }}>Action</th>
                                                    </tr>
                                                </thead>
                                            </Table>
                                        </Card.Subtitle>
                                        <Card.Body style={{ height: "20rem", overflowY: "scroll", overflowX: "hidden" }}>
                                            <Table hover style={{ backgroundColor: '#EDFAE9' }}>
                                                <tbody>
                                                    {jobData.map((item) => (
                                                        <tr key={item.id}>
                                                            <OverlayTrigger
                                                                placement="right"
                                                                delay={{ show: 250, hide: 400 }}
                                                                overlay={renderTooltip}
                                                            >
                                                                <td style={{ backgroundColor: '#EDFAE9', cursor: 'pointer' }} onClick={() => jobEnquireHandel(item.id)}>
                                                                    {item.companyName}<br />
                                                                    {item.applicentList && <span><BiSolidUserCheck />{item.applicentList.length}</span>}
                                                                </td>
                                                            </OverlayTrigger>
                                                            <td style={{ backgroundColor: '#EDFAE9' }}>{item.designation}</td>
                                                            <td style={{ backgroundColor: '#EDFAE9' }}>
                                                                {
                                                                    new Date(item.entryDate).toLocaleDateString('default', { year: 'numeric', month: 'long', day: 'numeric' })

                                                                }
                                                            </td>
                                                            <td style={{ backgroundColor: '#EDFAE9' }}>
                                                                {
                                                                    item.lastSubDate.replaceAll('-', '/')
                                                                }
                                                            </td>
                                                            <td style={{ backgroundColor: '#EDFAE9' }}>
                                                                <Button type='button' onClick={() => deleteJob(item.id)} className='btn-success disable'>
                                                                    Delete
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </Card.Body>
                                    </Card>
                                </Collapse>
                                {/* New Job Post */}
                                <Button
                                    onClick={() => setNewJob(!newJob)}
                                    aria-controls="example-collapse-text"
                                    aria-expanded={newJob}
                                    className='my-3'
                                >
                                    New Post
                                </Button>
                                <Collapse in={newJob}>
                                    <Card>
                                        <Card.Body>
                                            <Form>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Company Name</Form.Label>
                                                    <Form.Control type="text" placeholder="Company Name" name='companyName' onChange={onChangeHandler} />
                                                </Form.Group>

                                                <Form.Group className="mb-3">
                                                    <Form.Label>Designation</Form.Label>
                                                    <Form.Control type="text" placeholder="Designation" name='designation' onChange={onChangeHandler} />
                                                </Form.Group>

                                                <Form.Group className="mb-3">
                                                    <Form.Label>Last Submission Date</Form.Label>
                                                    <Form.Control type="date" placeholder="Last Submission Date" name='lastSubDate' onChange={onChangeHandler} />
                                                </Form.Group>

                                                <Form.Group controlId="formFile" className="mb-3">
                                                    <Form.Label>Job Description</Form.Label>
                                                    <Form.Control type="file" onChange={getCV} accept='.pdf' />
                                                </Form.Group>

                                                <Button variant="primary" type="button" onClick={registerNewJob}>
                                                    Submit
                                                </Button>
                                            </Form>
                                        </Card.Body>
                                    </Card>
                                </Collapse>
                            </Col>
                        </Row>
                    </Container>
                </>
            )}
        </>
    )
}

export default JobRegister