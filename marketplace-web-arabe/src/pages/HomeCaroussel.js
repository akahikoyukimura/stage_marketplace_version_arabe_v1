import React, { Component } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Link } from "react-router-dom";
import { GiWeight} from "react-icons/gi";
import { IoMdMale } from "react-icons/io";
import { FaShapes } from "react-icons/fa";
import { MdCake } from "react-icons/md";
import { HiOutlineBadgeCheck } from "react-icons/hi";

import axios from "axios";
import { FormattedMessage } from "react-intl";

const intl=JSON.parse(localStorage.getItem('intl'))
class HomeCaroussel extends Component {
  constructor(props) {
    super();
    console.log(props.espece);
    this.state = {
      especes: [],
      Cville: props.ville,
      Cespece: props.espece,
    };
  }

  async componentDidMount() {
    await axios
      .get("http://127.0.0.1:8000/api/Espece", {
        headers: {
          // "x-access-token": token, // the token is a variable which holds the token
          "Content-Type": "application/json",
        },
        params: {
          statut: "disponible",
          order_by: "espece",
          order_mode: "asc",
          espece: this.state.Cespece,
          localisation: this.state.Cville,
        },
      })
      .then((res) => {
        this.setState({
          especes: res.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    let annonces = {};
    let l = 0;
    let i = 0;

    try {
      l = this.state.especes.length;
      this.state.especes.map((espece) => {
        annonces = { ...annonces, [i]: espece };
        i = i + 1;
      });
      console.log(annonces);
      console.log(i);
    } catch (error) {
      console.log(error);
    }
    const responsive = {
      desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 5,
        slidesToSlide: 5, // optional, default to 1.
      },
      tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 2,
        slidesToSlide: 2, // optional, default to 1.
      },
      mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
        slidesToSlide: 1, // optional, default to 1.
      },
    };
    return (
      <div style={{ marginBottom: "1rem" }}>
        {l > 0 ? (
          <Carousel
            responsive={responsive}
            swipeable={false}
            draggable={false}
            showDots={false}
            ssr={true} // means to render carousel on server-side.
            infinite={true}
            autoPlay={this.props.deviceType !== "mobile" ? true : false}
            autoPlaySpeed={10000}
            keyBoardControl={true}
            customTransition="all .5"
            transitionDuration={500}
            containerClass="carousel-container"
            removeArrowOnDeviceType={["tablet", "mobile"]}
            deviceType={this.props.deviceType}
            dotListClass="custom-dot-list-style"
            itemClass="carousel-item-padding-40-px"
          >
            {Object.values(annonces).map((Annonces) => (
              <div
                id="anonce"
                className="product__item"
                style={{
                  margin: "0 10px 0 10px",
                }}
              >
                {Annonces ? (
                  <Link
                    to={`/DetailsMouton/${Annonces._id.$oid}`}
                    style={{ textDecoration: "none" }}
                  >
                    {" "}
                    <img
                      src={Annonces.image_face}
                      alt="item"
                      style={{
                        width: "355px",
                        height: "170px",
                        borderTopRightRadius: "10%",
                        borderTopLeftRadius: "10%",
                      }}
                    />
                    {Annonces.anoc ? (
                      <h1
                        style={{
                          borderRadius: "0% 0% 0% 40%",
                          fontSize: "14px",
                        }}
                        className=" badge badge-success py-1 w-100  "
                      >
                        <HiOutlineBadgeCheck className=" mr-1 fa-lg " />
                        <span><FormattedMessage id="panier_Labelise"/></span>{" "}
                      </h1>
                    ) : (
                      <span className="badge pt-3 w-100  mt-1  ">{"  "}</span>
                    )}
                    <div className="product__item__text p-2 text-justify">
                      <div
                        className="region"
                        style={{
                          color: "#aaa",
                          fontSize: "15px",
                          textAlign: "center",
                        }}
                      >
                        <i
                          className="fa fa-map-marker"
                          style={{ marginRight: "0.5rem" }}
                        ></i>
                        {Annonces.localisation}
                      </div>
                      <div
                        className="product__item__information"
                        style={{
                          color: "black",
                          fontSize: "15px",
                        }}
                      >
                        <div className=" nbrm">
                          <img
                            style={{
                              width: "18px",
                              height: "18px",
                              marginBottom: "5px",
                              marginRight: "5px",
                            }}
                            data-imgbigurl="Images/sheep-head.png"
                            src="Images/sheep-head.png"
                            alt=""
                          />
                          {Annonces.espece == "chevre" ? <FormattedMessage id="tout_les_annonces_chevre"/> : <FormattedMessage id="tout_les_annonces_mouton"/>}
                          <span style={localStorage.getItem('lg')=="ar"?{ float: "left"}:{float:"right"}}>
                            <FaShapes style={{ marginRight: "5px" }} />
                            {" " + Annonces.race}
                          </span>
                        </div>

                        <div>
                          <MdCake
                            className=" mr-1 fa-lg "
                            style={{ marginRight: "5px" }}
                          />
                          <FormattedMessage id="panier_mouton_age_mois"
                          values={{ age:Annonces.age }} />
                          {/* {Annonces.age + " mois"} */}

                          <span style={localStorage.getItem('lg')=="ar"?{ float: "left"}:{float:"right"}}>
                            <GiWeight
                              className=" mr-1 fa-lg "
                              style={{ marginRight: "5px" }}
                            />
                            <FormattedMessage id="panier_mouton_poids_kg"
                            values={{ poids:Annonces.poids }} />
                            {/* {Annonces.poids + " Kg"} */}
                          </span>
                        </div>
                        <div>
                          <span style={localStorage.getItem('lg')=="ar"?{ float: "right"}:{float:"left"}}>
                            <IoMdMale
                              className=" mr-1 fa-lg "
                              style={{
                                width: "18px",
                                height: "18px",
                                marginRight: "5px",
                              }}
                            />
                            {Annonces.sexe}
                          </span>
                        </div>
                        <div
                          style={localStorage.getItem('lg')=="ar"?{ float: "left",color: "#fe6927",
                          fontSize: "18px",
                          fontWeight: "1000",
                          textDecoration: "bold",
                          alignContent: "center",}:{float:"right",color: "#fe6927",
                          fontSize: "18px",
                          fontWeight: "1000",
                          textDecoration: "bold",
                          alignContent: "center",}}
                        >
                          <img
                            style={{ height: "30px" }}
                            src={require("./Images/cash-payment.png")}
                            alt=""
                          />
                          {/*   <FaDollarSign
                            className=" mr-1 fa-lg "
                            style={{
                              width: "18px",
                              height: "18px",
                              marginRight: "0.5rem",
                            }}
                          /> */}
                          <FormattedMessage id="panier_mouton_currency"
                          values={{ prix:Annonces.prix }} />
                          {/* {Annonces.prix + "  Dhs"} */}
                        </div>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <></>
                )}
              </div>
            ))}
          </Carousel>
        ) : (
          <div></div>
        )}
      </div>
    );
  }
}

export default HomeCaroussel;
