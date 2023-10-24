import React from "react";

import {
  Stack,
  Image,
  Container,
  Row,
  Col,
  Card,
  Button,
  ButtonGroup,
  // eslint-disable-next-line
  Form,
  Table,
  Tooltip,
  OverlayTrigger,
  // eslint-disable-next-line
  Badge,
} from "react-bootstrap";
import { FcWorkflow } from "react-icons/fc";
import { BiSolidPhoneCall, BiSolidUserCheck } from "react-icons/bi";
import { errorToastify, successToastify } from "./toastify";
import collage from "../DemoData/collegeImage.png";
import PieComponent from "./PieComponent";
import LineChart from "./LineChart";
import { data } from "./HomeSlid";
import {
  Navigation,
  Pagination,
  EffectCoverflow,
  Autoplay,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/effect-coverflow";
import { request } from "../Axios_helper";
import JobDetailsView from "./JobDetailsView";

function HomePage() {
  // eslint-disable-next-line
  const [userDetails, setUserDetails] = React.useState({
    Name: "",
    Email: "",
    userName: "",
    userType: "",
  });
  const [selectedButton, setSelectedButton] = React.useState("resent");
  const [jobData, setJobData] = React.useState([]);
  const [detailsView, setDetailsView] = React.useState({
    status: true,
    id: "",
  });

  React.useEffect(() => {
    const userDetailsString = window.localStorage.getItem("user_details");
    if (userDetailsString !== null) {
      const userDetail = JSON.parse(userDetailsString);
      setUserDetails({
        Name: userDetail.firstName + " " + userDetail.lastName,
        Email: userDetail.email,
        userName: userDetail.email,
        userType: userDetail.userType,
      });
    }
  }, [userDetails.userName]);

  React.useEffect(() => {
    handleButtonClick("resent");

    // eslint-disable-next-line
  }, []);

  const copyNumber = () => {
    navigator.clipboard.writeText("1234567890");
    successToastify("Successfully Copied");
  };

  const handleButtonClick = (variant) => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Month is zero-based
    const day = String(currentDate.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;
    if (variant === "resent") {
      request(
        "get",
        "/job/byDate/" + formattedDate,
        "application/json",
        {},
        "josn"
      ).then((response) => {
        const values = JSON.parse(response.data);
        setJobData(values);
      });
    } else {
      request("get", "/job/all", "application/json", {}, "josn").then(
        (response) => {
          const values = JSON.parse(response.data);
          setJobData(values);
        }
      );
    }
    setSelectedButton(variant);
  };

  const applicationSend = (id) => {
    if (!userDetails.userName || userDetails.userName === "") {
      errorToastify("You are not authorized to apply for this job");
    } else {
      if (userDetails.userType === "student") {
        let username = userDetails.userName;
        request(
          "post",
          "/job/apply/" + id,
          "text/plain",
          {
            username,
          },
          "josn"
        ).then((response) => {
          successToastify(response.data);
          handleButtonClick("resent");
        });
      } else {
        errorToastify("Only student can apply for this job");
      }
    }
  };

  const viewDetails = (id) => {
    if (
      jobData
        .filter((item) => item.id === id)
        .map((item) => item.moreDetails)[0] !== null
    ) {
      console.log(jobData.moreDetails);
      setDetailsView({
        status: false,
        id: id,
      });
    } else {
      setDetailsView({ status: true });
      errorToastify("No more details available");
    }
  };

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      For More Details Click Here
    </Tooltip>
  );

  return (
    <>
      {detailsView.status ? (
        <>
          <Stack gap={3}>
            {/* Slide section */}

            <div className="p-2">
              <Swiper
                effect={"coverflow"}
                slidesPerView={2}
                loop={true}
                grabCursor={true}
                centeredSlides={true}
                coverflowEffect={{
                  rotate: 50,
                  stretch: 0,
                  depth: 100,
                  modifier: 1,
                  slideShadows: true,
                }}
                autoplay={{
                  delay: 1000,
                  disableOnInteraction: false,
                }}
                navigation={true}
                pagination={{ clickable: true }}
                modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
                className="mySwiper"
                style={{
                  width: "100%",
                }}
              >
                {data.map((item) => (
                  <SwiperSlide key={item.id}>
                    <Image src={item.image} fluid />
                    <div className="carousel-caption d-none d-md-block ">
                      <h5>
                        <span className="slide-inner-text">{item.name}</span>
                      </h5>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <div className="p-2">
              <Container>
                <Row>
                  {/* Placement Report section */}

                  <Col sm={3}>
                    <Card
                      style={{
                        width: "18rem",
                        backgroundColor: "#f6e9fa",
                        border: "none",
                        boxShadow: "3px 4px 5px 0px lightgray",
                      }}
                    >
                      <Card.Body>
                        <Card.Title>Placement Report</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">
                          2023
                        </Card.Subtitle>
                        <Card.Text>
                          <PieComponent />
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col sm={9}>
                    {/* Job section */}

                    <Container className="mx-3">
                      <Card
                        style={{
                          backgroundColor: "#EDFAE9",
                          border: "none",
                          boxShadow: "1px 2px 5px 0px lightgray",
                        }}
                      >
                        <Card.Title>
                          <Row>
                            <Col sm={7} className="text-start mx-3 px-3 py-3">
                              New Uploaded Job
                            </Col>
                            <Col sm={3} className="text-end mx-3 px-3 py-3">
                              <FcWorkflow style={{ fontSize: "2rem" }} />
                            </Col>
                          </Row>
                        </Card.Title>
                        <Card.Subtitle>
                          <Row>
                            <Col className="text-start">
                              <ButtonGroup
                                aria-label="Basic example"
                                className="mx-3 px-3"
                              >
                                <Button
                                  variant={
                                    selectedButton === "All"
                                      ? "primary"
                                      : "light"
                                  }
                                  style={{ border: "1px solid black" }}
                                  onClick={() => handleButtonClick("All")}
                                >
                                  All
                                </Button>
                                <Button
                                  variant={
                                    selectedButton === "resent"
                                      ? "primary"
                                      : "light"
                                  }
                                  style={{ border: "1px solid black" }}
                                  onClick={() => handleButtonClick("resent")}
                                >
                                  Resent
                                </Button>
                              </ButtonGroup>
                            </Col>
                            <Col className="text-end">
                              {/* <Form inline>
                                <Row>
                                  <Col xs="auto">
                                    <Form.Control
                                      type="text"
                                      placeholder="Search"
                                      className=" mr-sm-2"
                                    />
                                  </Col>
                                  <Col xs="auto">
                                    <Button type="submit">Submit</Button>
                                  </Col>
                                </Row>
                              </Form> */}
                            </Col>
                          </Row>
                        </Card.Subtitle>
                        <hr />
                        <Card.Subtitle className="text-start mx-3">
                          <Table hover style={{ backgroundColor: "#EDFAE9" }}>
                            <thead style={{ backgroundColor: "#EDFAE9" }}>
                              <tr style={{ color: "gray" }}>
                                <th style={{ backgroundColor: "#EDFAE9" }}>
                                  Company Name
                                </th>
                                <th style={{ backgroundColor: "#EDFAE9" }}>
                                  Designation
                                </th>
                                <th style={{ backgroundColor: "#EDFAE9" }}>
                                  Last Date
                                </th>
                                <th style={{ backgroundColor: "#EDFAE9" }}>
                                  Status
                                </th>
                              </tr>
                            </thead>
                          </Table>
                        </Card.Subtitle>
                        <Card.Body
                          style={{
                            height: "10rem",
                            overflowY: "scroll",
                            overflowX: "hidden",
                          }}
                        >
                          <Table hover style={{ backgroundColor: "#EDFAE9" }}>
                            <tbody>
                              {jobData.map((item) => (
                                <tr key={item.id}>
                                  <OverlayTrigger
                                    placement="right"
                                    delay={{ show: 250, hide: 400 }}
                                    overlay={renderTooltip}
                                  >
                                    <td
                                      style={{
                                        backgroundColor: "#EDFAE9",
                                        cursor: "pointer",
                                      }}
                                      onClick={() => viewDetails(item.id)}
                                    >
                                      {item.companyName}
                                      <br />
                                      {item.applicentList && (
                                        <span>
                                          <BiSolidUserCheck />
                                          {item.applicentList.length}
                                        </span>
                                      )}
                                    </td>
                                  </OverlayTrigger>
                                  <td style={{ backgroundColor: "#EDFAE9" }}>
                                    {item.designation}
                                  </td>
                                  <td style={{ backgroundColor: "#EDFAE9" }}>
                                    {item.lastSubDate}
                                  </td>
                                  {item.applicentList &&
                                  item.applicentList.includes(
                                    userDetails.userName
                                  ) ? (
                                    <>
                                      <td
                                        style={{ backgroundColor: "#EDFAE9" }}
                                      >
                                        <Button
                                          type="button"
                                          onClick={() =>
                                            errorToastify(
                                              "Already Submit Application"
                                            )
                                          }
                                          className="btn-success disable"
                                        >
                                          Applied
                                        </Button>
                                      </td>
                                    </>
                                  ) : (
                                    <>
                                      <td
                                        style={{ backgroundColor: "#EDFAE9" }}
                                      >
                                        <Button
                                          type="button"
                                          onClick={() =>
                                            applicationSend(item.id)
                                          }
                                        >
                                          Apply
                                        </Button>
                                      </td>
                                    </>
                                  )}
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </Card.Body>
                      </Card>
                    </Container>
                  </Col>
                </Row>
              </Container>
            </div>
            <div className="p-2 px-3 d-flex justify-content-start">
              <Card
                style={{
                  height: "25rem",
                  width: "55rem",
                  backgroundColor: "#eaf7ff",
                  border: "none",
                }}
                className="mx-3"
              >
                <LineChart />
              </Card>
              <Card
                style={{ width: "18rem", height: "25rem" }}
                className="mx-3"
              >
                <Card.Body>
                  <Card.Img variant="top" src={collage} />
                  <Card.Subtitle>More Contact</Card.Subtitle>
                  <BiSolidPhoneCall
                    size={30}
                    className="my-3"
                    onClick={copyNumber}
                  />
                </Card.Body>
                <footer className="blockquote-footer">&copy;Sunit Mal</footer>
              </Card>
            </div>
          </Stack>
        </>
      ) : (
        <JobDetailsView id={detailsView.id} />
      )}
    </>
  );
}

export default HomePage;
