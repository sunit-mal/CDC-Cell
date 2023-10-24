import React from 'react'
import { Container, Row, Col, Image, Stack, Card } from 'react-bootstrap'
import img from '../DemoData/img.jpg'
import defaultPDF from '../DemoData/demo.pdf'
import { FaGithub, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { BiLogoGmail } from "react-icons/bi";
import { LuSettings } from 'react-icons/lu'
import { request } from '../Axios_helper';
import Setting from './Setting';
import CVView from './CVView';
import { errorToastify, successToastify } from './toastify';
import { useParams } from 'react-router-dom';

function Profile() {

    const { userEmail } = useParams();

    const [pageChange, setPageChange] = React.useState(false);
    // eslint-disable-next-line
    const [userDetails, setUserDetails] = React.useState({
        Name: '',
        Email: '',
        userName: '',
        userType: ''
    });
    const [username, setUsername] = React.useState(null);
    const [imageData, setImageData] = React.useState(null);
    const [cv, setCV] = React.useState(null);
    const [displayCV, setDisplayCV] = React.useState(false);
    const [pdf, setPdf] = React.useState(defaultPDF);
    const [information, setInformation] = React.useState({
        name: '',
        batch: '',
        department: '',
        skill: '',
        project: '',
        github: '',
        linkedin: '',
        whatsapp: '',
        email: '',
    });

    React.useEffect(() => {
        const userDetailsString = window.localStorage.getItem('user_details');
        if (userDetailsString !== null) {
            const userDetail = JSON.parse(userDetailsString);
            setUserDetails({
                Name: userDetail.firstName + " " + userDetail.lastName,
                Email: userDetail.email,
                userName: userDetail.email,
                userType: userDetail.userType
            })
        }
    }, [userEmail]);

    React.useEffect(() => {
        setUsername(userEmail);
    }, [userEmail]);

    React.useEffect(() => {
        // successToastify(username)
        if (!username || username === '') {
            console.log('No username found for pic');
        } else {
            // Fetch the image data from your backend using axios
            const path = '/ProfilePic/' + username;
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
    }, [username]);

    // For CV
    React.useEffect(() => {
        if (!username || username === '') {
            console.log('No UserName found for cv');
        } else {
            // Fetch the image data from your backend using axios
            const path = '/basicimformation/cv/' + username;
            request(
                'GET',
                path,
                'application/json',
                {},
                'json'
            ).then((response) => {
                setCV(response.data.fileName);

            }).catch((error) => {
                setCV(null)
                console.error(error);
            });

        }
    }, [username]);

    const displayCVHandler = () => {

        if (username !== '' || username !== null) {
            const path = '/basicimformation/pdf/' + username;
            request(
                'GET',
                path,
                'application/json',
                {},
                'blob'
            ).then((response) => {
                setPdf(URL.createObjectURL(response.data));

            }).catch((error) => {
                setCV(null)
                console.error(error);
            });
        } else {
            errorToastify('No CV found');
            setPdf(defaultPDF);
        }
        setDisplayCV(true);
    }

    // for Information
    React.useEffect(() => {
        if (!username || username === '') {
            console.log('No UserName found for information');
        } else {
            // Fetch the image data from your backend using axios
            const path = '/basicimformation/all/' + username;
            request(
                'GET',
                path,
                'application/json',
                {},
                'json'
            ).then((response) => {
                setInformation({
                    name: response.data.fullName,
                    batch: response.data.batch,
                    department: response.data.dept,
                    skill: response.data.skill,
                    project: response.data.project,
                    github: response.data.github,
                    linkedin: response.data.linkedin,
                    whatsapp: response.data.number,
                    email: response.data.email,
                });

            }).catch((error) => {
                setInformation({
                    name: '',
                    batch: '',
                    department: '',
                    skill: '',
                    project: '',
                    github: '',
                    linkedin: '',
                    whatsapp: '',
                    email: '',
                })
                console.error(error);
            });

        }
    }, [username]);

    const copyNumber = () => {
        navigator.clipboard.writeText(information.whatsapp);
        successToastify('Successfully Copied');
    }
    const copyGmail = () => {
        navigator.clipboard.writeText(information.email);
        successToastify('Successfully Copied');
    }

    const setting = () => {
        // window.location.href = '/setting';
        if (pageChange === true) {
            setPageChange(false);
        } else {
            setPageChange(true);
        }
    }

    return (
        <>{displayCV ? <CVView pdf={pdf} username={username} /> : pageChange ? <Setting /> :
            <Container className='my-3'>
                <Row className='text-start my-3'>
                    <Col>
                        {userDetails.userType === 'student' ? (
                            <LuSettings size={30} onClick={setting} className='pdfClose' />
                        ) : null}
                    </Col>
                </Row>
                <Row>
                    <Col className='bg-info text-dark px-3 py-3 rounded-3' sm={4}>
                        <Col>
                            <Image src={imageData == null ? img : imageData} roundedCircle width={150} height={150} />
                        </Col>
                        <Col>
                            <Stack gap={3}>
                                <div className="p-2">
                                    <figure>
                                        <blockquote className="blockquote">
                                            <p>{information.name}</p>
                                        </blockquote>
                                        <figcaption className="blockquote-footer">
                                            {information.email}
                                        </figcaption>
                                    </figure>
                                </div>
                                <div>
                                    <Card className='text-start'>
                                        <Card.Title className='mx-3'>Batch</Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted mx-3">{information.batch}</Card.Subtitle>
                                    </Card>
                                </div>
                                <div>
                                    <Card className='text-start'>
                                        <Card.Title className='mx-3'>Department</Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted mx-3">{information.department}</Card.Subtitle>
                                    </Card>
                                </div>
                                <div>
                                    <Card className='text-start'>
                                        <Card.Title className='mx-3'>CV</Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted mx-3" onClick={displayCVHandler}>{cv !== null ? cv : 'demo.pdf'}</Card.Subtitle>
                                    </Card>
                                </div>
                            </Stack>
                        </Col>
                    </Col>
                    <Col>
                        <Stack gap={3}>
                            <div className="p-2">
                                <Card className='text-start'>
                                    <Row >
                                        <Col xs={2} lg={2} className='d-flex justify-content-center align-items-center'>
                                            <Card.Subtitle className="text-muted px-3 ">Skill : </Card.Subtitle>
                                        </Col>
                                        <Col className='d-flex justify-content-start align-items-center'>
                                            <Card.Body className="text-muted mx-3">{information.skill}</Card.Body>
                                        </Col>
                                    </Row>
                                </Card>
                            </div>
                            <div className="p-2">
                                <Card className='text-start'>
                                    <Card.Subtitle className="text-muted px-3 py-3">Project : </Card.Subtitle>
                                    <Card.Body className="text-muted mx-3">{information.project}</Card.Body>
                                </Card>
                            </div>
                            <div className="p-2">
                                <Row>
                                    <Col>
                                        <a href={information.github} target="_blank" rel="noreferrer" style={{ color: 'black' }}>
                                            <FaGithub size={30} />
                                        </a>
                                    </Col>
                                    <Col>
                                        <a href={information.linkedin} target="_blank" rel="noreferrer" style={{ color: 'black' }}>
                                            <FaLinkedin size={30} />
                                        </a>
                                    </Col>
                                    <Col>
                                        <FaWhatsapp size={30} onClick={copyNumber} />
                                    </Col>
                                    <Col>
                                        <BiLogoGmail size={30} onClick={copyGmail} />
                                    </Col>
                                </Row>
                            </div>
                        </Stack>
                    </Col>

                </Row>
            </Container>
        }
        </>
    )
}

export default Profile
