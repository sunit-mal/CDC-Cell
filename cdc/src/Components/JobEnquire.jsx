import React from "react";
import { request } from "../Axios_helper";
import { Card } from "react-bootstrap";
import { GiReturnArrow } from "react-icons/gi";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-flip";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { EffectCards, Pagination, Navigation, Autoplay } from "swiper/modules";

function JobEnquire({ id, back }) {
  const [jobData, setJobData] = React.useState();
  const [jobApplicationData, setJobApplicationData] = React.useState();

  React.useEffect(() => {
    request("get", "/job/getjob/" + id, "application/json", {}, "josn")
      .then((response) => {
        const values = JSON.parse(response.data);
        setJobData(values);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  React.useEffect(() => {
    if (jobData !== null && jobData !== "") {
      const DATA = (jobData || []).map((item) => ({
        requestDataString: JSON.stringify(item),
      }));
      // console.log(DATA.length);
      if (DATA.length !== 0 && DATA !== null) {
        request(
          "post", // Change to 'post' to send data to the server
          "/basicimformation/fetchInformationForJobApplication",
          "application/json",
          DATA, // Send the array directly as the request body
          "json" // Correct the typo 'josn' to 'json'
        )
          .then((response) => {
            const values = response.data;
            setJobApplicationData(values);
            // console.log(values);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  }, [jobData]);

  return (
    <>
      <GiReturnArrow
        size={30}
        onClick={() => back()}
        className="pdfClose position-absolute"
        style={{
          cursor: "pointer",
          top: "5rem",
          left: "5rem",
          zIndex: "1000",
        }}
      />
      <Swiper
        effect={"cards"}
        grabCursor={true}
        centeredSlides={true}
        navigation={true}
        pagination={{ clickable: true }}
        modules={[EffectCards, Pagination, Navigation, Autoplay]}
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        className="mySwiper py-2 px-2 my-3"
        style={{
          width: "90%",
          backgroundColor: "transparent",
        }}
      >
        {jobApplicationData &&
          jobApplicationData.map((item, index) => (
            <SwiperSlide style={{ backgroundColor: "transparent" }}>
              <Card
                style={{ width: "30rem" }}
                className="py-3 moreInfoByEditor"
              >
                <Card.Body>
                  <Card.Title>
                    {index + 1} : {item.fullName}
                  </Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {item.batch}
                  </Card.Subtitle>
                  <Card.Subtitle className="mb-2 text-muted">
                    {item.dept}
                  </Card.Subtitle>
                  <Card.Body>
                    <Card className="my-2 py-2 px-2 text-start moreInfoInnerByEditor">
                      <Card.Title>SKILLS :</Card.Title>
                      <Card.Body>{item.skill}</Card.Body>
                    </Card>
                    <Card className="my-2 py-2 px-2 text-start moreInfoInnerByEditor">
                      <Card.Title>PROJECTS :</Card.Title>
                      <Card.Body>{item.project}</Card.Body>
                    </Card>
                  </Card.Body>
                  <Card.Link href={"/profile/" + item.email}>
                    {item.email}
                  </Card.Link>
                </Card.Body>
              </Card>
            </SwiperSlide>
          ))}
      </Swiper>
    </>
  );
}

export default JobEnquire;
