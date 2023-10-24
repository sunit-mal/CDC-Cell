import React from 'react'
import { Container, Row, Col, Image, Stack, Form, Card, Button, Dropdown } from 'react-bootstrap'
import { BiCloudUpload } from "react-icons/bi";
import { AiFillDelete } from 'react-icons/ai';
import { GiReturnArrow } from 'react-icons/gi';
import img from '../DemoData/img.jpg';
import { request } from '../Axios_helper';
import { errorToastify, successToastify } from './toastify.jsx';

function Setting() {
    const [inputValue, setInputValue] = React.useState('');
    const [selectedValues, setSelectedValues] = React.useState([]);
    // eslint-disable-next-line
    const [intentValue, setIntentValue] = React.useState('');
    const fileInputRef = React.useRef(null);
    const [imageData, setImageData] = React.useState(null);
    const [userDetails, setUserDetails] = React.useState({
        Name: '',
        Email: '',
        userName: ''
    });
    const [cv, setCV] = React.useState(null);
    const [basicInfo, setBasicInfo] = React.useState({
        batch: null,
        dept: null,
    });
    const [additionalInfo, setAdditionalInfo] = React.useState({
        github: null,
        linkedin: null,
        number: null,
        project: null,
        skill: null,
    });

    React.useEffect(() => {
        const userDetailsString = window.localStorage.getItem('user_details');
        if (userDetailsString !== null) {
            const userDetail = JSON.parse(userDetailsString);
            setUserDetails({
                Name: userDetail.firstName + " " + userDetail.lastName,
                Email: userDetail.email,
                userName: userDetail.email
            })
        }

    }, [userDetails.userName]);

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
            console.log('No file selected.');
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
                console.log(response.status + response.data.massage);
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

    const getCV = (event) => {
        const file = event.target.files[0];
        setCV(file);
    }

    const onChangeHandlerForBasic = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setBasicInfo((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    
    const onChangeHandlerForAdditional = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setAdditionalInfo((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const uploadBasicInfo = (e) => {
        console.log(basicInfo);
        if (basicInfo.email !== '' || basicInfo.fullName !== '') {
            const data = {
                email: userDetails.Email,
                fullName: userDetails.Name,
                batch: basicInfo.batch,
                dept: basicInfo.dept,
            };
            UpdateBasicInformation(data);
        }
        if (cv !== null)
            uploadCV(cv);
    }

    const uploadCV = (file) => {
        if (userDetails.userName === '' || userDetails.userName === null) {
            errorToastify('No username found');
        } else {

            const formData = new FormData();
            formData.append('cv', file);
            const path = 'basicimformation/upload/' + userDetails.userName;

            // Make a POST request to your image upload endpoint
            request(
                'POST',
                path,
                'multipart/form-data',
                formData,
                'json'
            ).then((response) => {
                // if (response.status === 200) {
                //     setImageData(URL.createObjectURL(imageData));
                // }
                successToastify(response.data.massage)
                console.log(response.status + response.data.massage);
            }).catch((error) => {
                // setImageData(null);
                errorToastify(error.response.data.massage)
                console.error(error.response);
            });
        }
    }

    const UpdateBasicInformation = (data) => {
        console.log(data);
        if (data.email !== '' && data.fullName !== '') {
            request(
                'POST',
                '/basicimformation/basicData',
                'application/json',
                data,
                'json'
            ).then((response) => {
                successToastify(response.data)
                console.log(response);
            }).catch((error) => {
                errorToastify(error.response.data.massage)
                console.error(error.response);
            });
        } else {
            errorToastify('No username found')
        }
    };
    const UpdateAdditionalInformation = () => {
        const data = {
            email: userDetails.Email,
            fullName: userDetails.Name,
            github: additionalInfo.github,
            linkedin: additionalInfo.linkedin,
            number: additionalInfo.number,
            project: additionalInfo.project,
            // skill: additionalInfo.skill,
            skill: inputValue,
        };

        if (data.email !== '' && data.fullName !== '') {
            request(
                'POST',
                '/basicimformation/additionalData',
                'application/json',
                data,
                'json'
            ).then((response) => {
                successToastify(response.data.massage)
                console.log(response);
            }).catch((error) => {
                errorToastify(error.response.data.massage)
                console.error(error.response);
            });
        } else {
            errorToastify('No username found')
        }
    };

    // For Skill insert
    // const handleInputChange = (e) => {
    //     setInputValue(e.target.value);
    // };

    const handleInsertClick = () => {
        const selectElement = document.querySelector('#mySelect');
        const selectedValue = selectElement.value;

        setSelectedValues([...selectedValues, selectedValue]);

        setInputValue(selectedValues.join(', '));

        setIntentValue('');
    };

    React.useEffect(() => {
        setInputValue(selectedValues.join(', '));
    }, [selectedValues]);

    const backToProfile = () => {
        window.location.href = '/profile/' + userDetails.userName;
    }

    return (
        <Stack gap={4}>
            <div className="p-2 text-start mx-3"><GiReturnArrow size={40} onClick={backToProfile} /></div>
            <div className="p-2 d-flex justify-content-center">
                <Container className='my-3'>
                    <Row className='my-3'>
                        {/* For Profile Pic upload process */}
                        <Col className='d-flex justify-content-center'>
                            <Stack direction="horizontal" gap={0}>
                                <div><Image src={imageData == null ? img : imageData} roundedCircle className='translate-middle' width={150} height={150} /></div>
                                <Stack className='d-flex align-items-center' gap={2}>
                                    <AiFillDelete size={30} onClick={deleteClick} />
                                    <BiCloudUpload size={30} onClick={handleUploadClick} />
                                </Stack>
                            </Stack>
                            <form encType="multipart/form-data">
                                <input
                                    type="file"
                                    accept=".jpg"
                                    style={{ display: 'none' }}
                                    ref={fileInputRef}
                                    onChange={handleFileSelect}
                                />
                            </form>
                        </Col>
                    </Row>
                </Container>
            </div>

            <div className="d-flex justify-content-center">
                {/* For Basic Information */}
                <Col className='d-flex justify-content-center'>
                    <Form style={{ width: '30rem', backgroundColor: '#81f6cdb9' }} className='px-3 py-3 text-start'>
                        <Card.Title className='my-3'>Basic Information</Card.Title>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Batch</Form.Label>
                            <Form.Control type="text" placeholder="2020-2024" name='batch' onChange={onChangeHandlerForBasic} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Department</Form.Label>
                            <Form.Control type="text" placeholder="Computer Science and Engineering" name='dept' onChange={onChangeHandlerForBasic} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Resume</Form.Label>
                            <Form.Control type="file" name='cv' accept='.pdf' onChange={getCV} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Control type="button" value='Update' onClick={uploadBasicInfo} />
                        </Form.Group>
                    </Form>
                </Col>

                {/* For Additional Information */}
                <Col className='d-flex justify-content-center'>
                    <Form style={{ width: '30rem', backgroundColor: '#81f6cdb9' }} className='px-3 py-3 text-start'>
                        <Card.Title className='my-3'>Additional Information</Card.Title>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Skill</Form.Label>
                            <Form.Control type="text" placeholder="No Skill Select" name='skill' value={inputValue} onChange={onChangeHandlerForAdditional} disabled />
                            <Form.Select size="sm" id="mySelect" className='my-2'>
                                {/* Programming Languages */}
                                <option>Java</option>
                                <option>JavaScript</option>
                                <option>Python</option>
                                <option>C#</option>
                                <option>C++</option>
                                <option>Ruby</option>
                                <option>Go (Golang)</option>
                                <option>Swift</option>
                                <option>Kotlin</option>
                                <option>PHP</option>
                                <option>R</option>
                                <Dropdown.Divider />
                                {/* Web Development Frameworks */}
                                <option>React</option>
                                <option>Angular</option>
                                <option>Django</option>
                                <option>SpringBoot</option>
                                <option>Vue.js</option>
                                <option>Express.js</option>
                                <option>Ruby on Rails</option>
                                <Dropdown.Divider />
                                {/* Mobile App Development */}
                                <option>React Native</option>
                                <option>Flutter</option>
                                <option>Xamarin</option>
                                <Dropdown.Divider />
                                {/* Data Science and Machine Learning */}
                                <option>TensorFlow</option>
                                <option>PyTorch</option>
                                <option>Scikit-Learn</option>
                                <option>Pandas</option>
                                <option>NumPy</option>
                                <option>R</option>
                                <Dropdown.Divider />
                                {/* Game Development */}
                                <option>Unity</option>
                                <option>Unreal Engine</option>
                                <Dropdown.Divider />
                                {/* Database Management */}
                                <option>SQL</option>
                                <option>NoSQL</option>
                                <option>MySQL</option>
                                <Dropdown.Divider />
                                {/* DevOps and Infrastructure */}
                                <option>Docker</option>
                                <option>Kubernetes</option>
                                <option>Ansible</option>
                                <option>Terraform</option>
                                <Dropdown.Divider />
                                {/* Cloud Platforms */}
                                <option>Amazon Web Services (AWS)</option>
                                <option>Microsoft Azure</option>
                                <option>Google Cloud Platform (GCP)</option>
                                <Dropdown.Divider />
                                {/* Server-Side Technologies */}
                                <option>Node.js</option>
                                <option>ASP.NET</option>
                                <Dropdown.Divider />
                                {/* Blockchain Development  */}
                                <option>Ethereum</option>
                            </Form.Select>
                            <Button variant="primary" onClick={handleInsertClick}>
                                Insert
                            </Button>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Project</Form.Label>
                            <Form.Control type="text" placeholder="CodeArena, HalloDoc" name='project' onChange={onChangeHandlerForAdditional} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Linkedin profile link</Form.Label>
                            <Form.Control type="url" placeholder='https://in.linkedin.com/in/sunit-mal' name='linkedin' onChange={onChangeHandlerForAdditional} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Github link</Form.Label>
                            <Form.Control type="url" placeholder='https://github.com/sunit-mal' name='github' onChange={onChangeHandlerForAdditional} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Whatsapp Number</Form.Label>
                            <Form.Control type="text" placeholder='8172089782' name='number' onChange={onChangeHandlerForAdditional} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Control type="button" value='Update' onClick={UpdateAdditionalInformation} />
                        </Form.Group>
                    </Form>
                </Col>
            </div>

        </Stack >
    )
}

export default Setting