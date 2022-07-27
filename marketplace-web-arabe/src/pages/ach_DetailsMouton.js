import React, { Component } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import Loader from "react-loader-spinner";
import { HiOutlineBadgeCheck } from "react-icons/hi";
import HomeCaroussel from "./HomeCaroussel";

import {
  EmailShareButton,
  EmailIcon,
  FacebookShareButton,
  FacebookIcon,
  WhatsappShareButton,
  WhatsappIcon,
  TwitterShareButton,
  TwitterIcon,
} from "react-share";
import { FormattedMessage } from "react-intl";

const intl=JSON.parse(localStorage.getItem('intl'))

class DetailsMouton extends Component {
  constructor() {
    super();
    // let redirect = false;
    this.state = {
      loading: true,
      Espece: {},
      cooperative: {},
      eleveur: {},
      Favoris: [],
      Panier: [],
      redirect: false,
      image: "",
      isDispo: false,
      isLoged: false,
      isFav: false,
      isInpanier: false,
    };
    this.onClickImageBoucle = this.onClickImageBoucle.bind(this);
    this.onClickImageProfile = this.onClickImageProfile.bind(this);
    this.onClickImageFace = this.onClickImageFace.bind(this);
    this.handleFavoris = this.handleFavoris.bind(this);
    this.handleDeleteFav = this.handleDeleteFav.bind(this);
    this.handlePanier = this.handlePanier.bind(this);
  }

  onClickImageBoucle() {
    this.setState({ image: this.state.Espece.image_boucle });
  }
  onClickImageProfile() {
    this.setState({ image: this.state.Espece.image_profile });
  }
  onClickImageFace() {
    this.setState({ image: this.state.Espece.image_face });
  }

  componentDidMount() {
    // const idm = this.props.location.state.id;
    const idm = this.props.match.params.idMouton;
    const token = localStorage.getItem("usertoken");
    const myToken = `Bearer ` + localStorage.getItem("myToken");

    this.setState({ loading: true }, () => {
      axios
        .get("http://127.0.0.1:8000/api/Espece/" + idm, {
          headers: {
            // "x-access-token": token, // the token is a variable which holds the token
            Authorization: myToken,
          },
        })
        .then((res) => {
          this.setState(
            {
              Espece: res.data.objet,
              eleveur: res.data.Eleveur[0],
              image: res.data.objet.image_profile,
              loading: false,
            },
            () => {
              axios
                .get(
                  "http://127.0.0.1:8000/api/cooperative/" +
                    res.data.objet.id_cooperative,
                  {
                    headers: {
                      // "x-access-token": token, // the token is a variable which holds the token
                      Authorization: myToken,
                    },
                  }
                )
                .then((res) => {
                  this.setState({ cooperative: res.data }, () => {});
                });
            }
          );
          if (res.data.objet.statut === "disponible") {
            this.setState({ isDispo: true });
          }
          if (token) {
            this.setState({ isLoged: true });
            // this.props.history.push("/login");
          }
          // console.log(res);
        });
    });
    //-------------------favoris&&Panier--------------------------//

    if (!token) {
      // this.props.history.push("/login");
      this.setState(
        {
          Favoris: [],
          Panier: [],
        },
        () => this.setState({ isFav: false })
      );
    } else {
      axios
        .get("http://127.0.0.1:8000/api/consommateur/" + token, {
          headers: {
            Authorization: myToken,
          },
        })
        .then((res) => {
          var pan = res.data.panier;
          var paniers = pan.filter((pan) => pan.id_espece === idm);
          var fav = res.data.favoris;

          var favoris = fav.filter((fav) => fav.id_espece === idm);

          this.setState(
            {
              Panier: paniers,
              Favoris: favoris,
            },
            () => {
              if (this.state.Panier.length !== 0) {
                this.setState({ isInpanier: true });
              }
              if (this.state.Favoris.length !== 0) {
                this.setState({ isFav: true });
              }
            }
          );
        });
    }
  }

  handleFavoris(Mid) {
    const token = localStorage.getItem("usertoken");
    const myToken = `Bearer ` + localStorage.getItem("myToken");
    if (!token) {
      this.props.history.push("/login");
    } else {
      axios
        .put(
          "http://127.0.0.1:8000/api/consommateur/" + token + "/favoris",
          { id_espece: Mid },

          {
            headers: {
              // "Access-Control-Allow-Origin": "*",
              // "Content-Type": "application/json",
              // Accept: "application/json",
              Authorization: myToken,
            },
          }
        )
        .then(this.setState({ isFav: true }));
      Swal.fire({
        title: intl.messages.details_mouton_ajoute_favoris_succes,
        icon: "success",
        width: 400,
        heightAuto: false,
        timer: 1500,
        showConfirmButton: false,
        /* confirmButtonColor: "#7fad39",
 
        confirmButtonText: "Ok!",*/
      });
    }
  }

  handlePanier(Mid) {
    const token = localStorage.getItem("usertoken");
    const myToken = `Bearer ` + localStorage.getItem("myToken");
    if (!token) {
      this.props.history.push("/login");
    } else {
      // console.log(token);
      axios
        .put(
          "http://127.0.0.1:8000/api/consommateur/" + token + "/panier",
          { id_espece: Mid },

          {
            headers: {
              // "Access-Control-Allow-Origin": "*",
              // "Content-Type": "application/json",
              // Accept: "application/json",
              Authorization: myToken,
            },
          }
        )
        .then(this.setState({ isInpanier: true }));
      Swal.fire({
        title: intl.messages.favoris_ajoute_au_panier_succes,
        icon: "success",
        width: 400,
        heightAuto: false,
        timer: 1500,
        showConfirmButton: false,
        /* confirmButtonColor: "#7fad39",

        confirmButtonText: "Ok!",*/
      });
    }
  }

  handleDeleteFav(Mid) {
    // const idm = this.props.location.state.id;
    const idm = this.props.match.params.idMouton;

    const token = localStorage.getItem("usertoken");
    const myToken = `Bearer ` + localStorage.getItem("myToken");
    if (!token) {
      this.props.history.push("/login");
    } else {
      // console.log(token);
      axios
        .put(
          "http://127.0.0.1:8000/api/consommateur/" + token + "/favoris/" + idm,

          {},
          {
            headers: {
              //"Content-Type": "application/json",

              Authorization: myToken,
            },
          }
        )
        .then(this.setState({ isFav: false }));
      Swal.fire({
        title: intl.messages.details_mouton_supprimer_du_favoris_succes,
        icon: "success",
        width: 400,
        heightAuto: false,
        timer: 1500,
        showConfirmButton: false,
        /* confirmButtonColor: "#7fad39",
 
        confirmButtonText: "Ok!",*/
      });
    }
  }

  render() {
    // var mois = new Array(
    //   "Janvier",
    //   "Février",
    //   "Mars",
    //   "Avril",
    //   "Mai",
    //   "Juin",
    //   "Juillet",
    //   "Août",
    //   "Septembre",
    //   "Octobre",
    //   "Novembre",
    //   "Décembre"
    // );
    const { loading } = this.state;
    const shareUrl = "http://localhost:3000/DetailsMouton";
    return (
      <div>
        <style>{` .product__details__text ul{ margin-top:35px;} `}</style>
        {loading ? (
          <div
            style={{
              width: "100%",
              height: "40rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <br></br>
            <Loader type="Oval" color="#7fad39" height="80" width="80" />
          </div>
        ) : (
          <section style={localStorage.getItem('lg')=='ar'?{direction:"rtl",textAlign:"right"}:{}} className="product-details spad">
            <div className="container">
              <div className="row">
                <div className="col-lg-6 col-md-6">
                  <div className="product__details__pic">
                    {this.state.Espece.anoc ? (
                      <div className="product__details__pic__item mb-1">
                        <img
                          className="product__details__pic__item--large"
                          src={this.state.image}
                          alt=""
                          id="roundB"
                          style={{ objectFit: "scale-down" }}
                        />
                        <div className="heartchild">
                          <h4 className="d-inline">
                            {this.state.isFav ? (
                              <span className="text-left text-danger col-lg-4 col-md-4">
                                {" "}
                                <a
                                  id={this.state.Espece._id}
                                  onClick={(e) => {
                                    this.handleDeleteFav(e.currentTarget.id);
                                  }}
                                >
                                  <i
                                    className="fa fa-heart fa-lg"
                                    style={{ margin: "0.5em" }}
                                  ></i>
                                </a>{" "}
                              </span>
                            ) : null}
                            {!this.state.isFav ? (
                              <span className="text-left text-muted col-lg-2 col-md-2">
                                {" "}
                                <a
                                  id={this.state.Espece._id}
                                  onClick={(e) =>
                                    this.handleFavoris(e.currentTarget.id)
                                  }
                                >
                                  <i
                                    className="fa fa-heart fa-lg"
                                    style={{ margin: "0.5em" }}
                                  ></i>{" "}
                                </a>{" "}
                              </span>
                            ) : null}
                          </h4>
                        </div>
                      </div>
                    ) : (
                      <div className="product__details__pic__item">
                        <img
                          className="product__details__pic__item--large"
                          src={this.state.image}
                          alt=""
                          id="roundB"
                          style={{ objectFit: "contain" }}
                        />
                        <div className="heartchild">
                          <h4 className="d-inline">
                            {this.state.isFav ? (
                              <span className="text-left text-danger col-lg-4 col-md-4">
                                {" "}
                                <a
                                  id={this.state.Espece._id}
                                  onClick={(e) => {
                                    this.handleDeleteFav(e.currentTarget.id);
                                  }}
                                >
                                  <i className="fa fa-heart "></i>
                                </a>{" "}
                              </span>
                            ) : null}
                            {!this.state.isFav ? (
                              <span className="text-left text-muted col-lg-2 col-md-2">
                                {" "}
                                <a
                                  id={this.state.Espece._id}
                                  onClick={(e) =>
                                    this.handleFavoris(e.currentTarget.id)
                                  }
                                >
                                  <i className="fa fa-heart"></i>
                                </a>{" "}
                              </span>
                            ) : null}
                          </h4>
                        </div>
                      </div>
                    )}
                    <div className="row">
                      <div className="container">
                        <div
                          id="lesImagesM"
                          className="col-lg-12 col-md-12 mb-2"
                        >
                          <div className="row">
                            <img
                              style={{
                                height: "100px",
                                width: "100px",
                                margin: "1%",
                              }}
                              // data-imgbigurl="Images/1.jpg"
                              src={this.state.Espece.image_boucle}
                              alt=""
                              onClick={this.onClickImageBoucle}
                            />
                            <img
                              style={{
                                height: "100px",
                                width: "100px",
                                margin: "1%",
                              }}
                              // data-imgbigurl="Images/1.jpg"
                              src={this.state.Espece.image_face}
                              alt=""
                              onClick={this.onClickImageFace}
                            />

                            <img
                              style={{
                                height: "100px",
                                width: "100px",
                                margin: "1%",
                              }}
                              // data-imgbigurl="Images/1.jpg"
                              src={this.state.Espece.image_profile}
                              alt=""
                              onClick={this.onClickImageProfile}
                            />
                          </div>
                        </div>
                        {this.state.Espece.anoc ? (
                          <span className=" text-success ">
                            <HiOutlineBadgeCheck className=" mr-1 fa-lg " />
                            <FormattedMessage id="details_mouton_label_anoc"/>
                            <br></br>
                          </span>
                        ) : null}
                        <br></br>
                        <div
                          style={{
                            backgroundColor: "white",
                            borderRadius: "5%",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "18px",
                              fontWeight: "bold",
                              padding: "10px 0 10px 10px",
                            }}
                          >
                            <FormattedMessage id="details_mouton_description_title"/>
                          </span>
                          <div id="gris">
                            {this.state.Espece.description ? (
                              <span className="text-dark col-md-12">
                                {this.state.Espece.description}
                              </span>
                            ) : (
                              <span><FormattedMessage id="details_mouton_aucune_description"/></span>
                            )}
                          </div>
                        </div>
                        <div>
                          <br></br>

                          <div id="centrer2">
                            {/* Ajouter ici Social Sharing Button */}
                            <h4 id="centrer2">
                            <FormattedMessage id="details_mouton_partage_annonce"/>
                            </h4>
                            <div>
                            <FormattedMessage id="details_mouton_partage_par_email_body" 
                            values={{ categorie: this.state.Espece.categorie,race:this.state.Espece.race }}
                            >
                          {(body) => (
                            <EmailShareButton
                            url={shareUrl + "/" + this.state.Espece._id}
                            subject={intl.messages.details_mouton_partage_par_email_subject}
                            body={body}
                          >
                            <EmailIcon size={36} round />
                          </EmailShareButton>
                          )}
                        </FormattedMessage>{" "}
                              {/*<FacebookMessengerShareButton
                                    url="https://github.com/nygardk/react-share"
                                    appId="521270401588372"
                                  >
                                    <FacebookMessengerIcon size={36} round />
                                  </FacebookMessengerShareButton> {" "}*/}
                              <FormattedMessage id="details_mouton_partage_par_email_body" 
                            values={{ categorie: this.state.Espece.categorie,race:this.state.Espece.race }}
                            >
                          {(quote) => (
                            <FacebookShareButton
                            // url= "https://youtube.com"
                            url={shareUrl + "/" + this.state.Espece._id}
                            quote={quote}
                          >
                            <FacebookIcon size={36} round />
                          </FacebookShareButton>
                          )}
                        </FormattedMessage>{" "}

                        <FormattedMessage id="details_mouton_partage_par_email_body" 
                            values={{ categorie: this.state.Espece.categorie,race:this.state.Espece.race }}
                            >
                          {(title) => (
                            <WhatsappShareButton
                            // url= "https://youtube.com"
                            url={shareUrl + "/" + this.state.Espece._id}
                            title={title}
                            separator=": "
                          >
                            <WhatsappIcon size={36} round />
                          </WhatsappShareButton>
                          )}
                        </FormattedMessage>{" "}

                        <FormattedMessage id="details_mouton_partage_par_email_body" 
                            values={{ categorie: this.state.Espece.categorie,race:this.state.Espece.race }}
                            >
                          {(title) => (
                            <TwitterShareButton
                            url={shareUrl + "/" + this.state.Espece._id}
                            title={title}
                          >
                            <TwitterIcon size={36} round />
                          </TwitterShareButton>
                          )}
                        </FormattedMessage>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="product__details__text">
                    <div id="centrer" className="container col-md-12">
                      <b> </b>
                      <br></br>
                      <b>
                        <FormattedMessage id="details_mouton_numero"/>{" "}
                        <span className="text-secondary">
                          {this.state.Espece.reference}
                        </span>{" "}
                        <br></br>{" "}
                      </b>
                      <br></br>
                      <b className="w-50">
                        <FormattedMessage id="details_mouton_nom_eleveur"/>
                        <span className="text-secondary">
                          {" "}
                          {" " +
                            this.state.eleveur.nom.toUpperCase() +
                            "     " +
                            this.state.eleveur.prenom}{" "}
                        </span>
                      </b>

                      <ul className="pt-4">
                        <li>
                          <b><FormattedMessage id="details_mouton_numero_boucle"/></b>{" "}
                          <span>{this.state.Espece.boucle}</span>
                        </li>
                        <li>
                          <b><FormattedMessage id="details_mouton_espece"/></b>{" "}
                          <span>
                            {this.state.Espece.espece == "chevre"
                              ? <FormattedMessage id="tout_les_annonces_chevre"/>
                              : <FormattedMessage id="tout_les_annonces_mouton"/>}
                          </span>
                        </li>
                        {/*<li>
                          <b>Categorie</b> <span>{this.state.Espece.categorie}</span>
                        </li>*/}
                        <li>
                          <b><FormattedMessage id="home_item_race"/></b> <span>{this.state.Espece.race}</span>
                        </li>
                        <li>
                          <b><FormattedMessage id="tout_les_annonces_ville"/></b>{" "}
                          <span>{this.state.Espece.localisation} </span>
                        </li>
                        <li>
                          <b><FormattedMessage id="add_mouton_sexe"/></b> <span>{this.state.Espece.sexe} </span>
                        </li>
                        <li>
                        <FormattedMessage
   id = "details_mouton_age"
   values = {{age: this.state.Espece.age, b: (word)=> <b>{word}</b>,span: (word)=> <span>{word}</span>}}
/>
                        </li>
                        <li>
                        <FormattedMessage
   id = "details_mouton_poids"
   values = {{poids: this.state.Espece.poids, b: (word)=> <b>{word}</b>,span: (word)=> <span>{word}</span>}}
/>
                          {/* <b>Poids</b> <span>{this.state.Espece.poids} Kg</span> */}
                        </li>
                      </ul>
                    </div>
                    <div style={localStorage.getItem('lg')=='ar'?{right:"66%"}:{}} className="price-stack-left container">
                      <div className="single-price-wrap">
                        <div className="white-block single-price">
                          <i className="fas fa-euro-sign"></i>
                          <div className="white-block-content">
                            <div
                              className="price"
                              style={{ fontSize: "1rem", fontWeight: "900" }}
                            >
                              {this.state.Espece.prix}
                              <span className="price-symbol"> <FormattedMessage id="panier_currency_abbreviation"/></span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row  text-center">
                    {!this.state.isLoged ? (
                      this.state.isDispo ? (
                        <div className="col-10 col sm-8 col-md-4 col-lg-4">
                          {" "}
                          <Link
                            to={{
                              pathname: "/Commander",
                              state: {
                                id: this.state.Espece._id,
                                cooperative: this.state.cooperative,
                              },
                            }}
                          >
                            <button
                              style={{
                                borderColor: "transparent",
                                backgroundColor: "#4CB050",
                              }}
                              className="primary-btn rounded     "
                            >
                              <i className="fa fa-plus"></i> <FormattedMessage id="details_mouton_commander"/>
                            </button>
                          </Link>
                        </div>
                      ) : null
                    ) : this.state.isDispo && !this.state.isInpanier ? (
                      <>
                        <div className="col-10 col sm-10 col-md-4 col-lg-4">
                          <Link>
                            <button
                              style={{
                                borderColor: "transparent",
                                backgroundColor: "#4CB050",
                              }}
                              id={this.state.Espece._id}
                              className="primary-btn rounded "
                              onClick={(e) =>
                                this.handlePanier(e.currentTarget.id)
                              }
                            >
                              <i className="fa fa-shopping-cart"></i> 
                              <FormattedMessage id="favoris_ajoute_au_panier"/>
                            </button>{" "}
                          </Link>{" "}
                        </div>
                        <div className="col-10 col sm-10 col-md-4 col-lg-4">
                          {" "}
                          <Link
                            to={{
                              pathname: "/Commander",
                              state: {
                                id: this.state.Espece._id,
                                cooperative: this.state.cooperative,
                              },
                            }}
                          >
                            <button
                              style={{
                                borderColor: "transparent",
                                backgroundColor: "#4CB050",
                              }}
                              className="primary-btn rounded    "
                            >
                              <i className="fa fa-plus"></i> <FormattedMessage id="details_mouton_commander"/>
                            </button>
                          </Link>
                        </div>
                      </>
                    ) : this.state.isDispo && this.state.isInpanier ? (
                      <div className="col-10 col sm-10 col-md-4 col-lg-4">
                        {" "}
                        <Link
                          to={{
                            pathname: "/Commander",
                            state: {
                              id: this.state.Espece._id,
                              cooperative: this.state.cooperative,
                            },
                          }}
                        >
                          <button
                            style={{
                              borderColor: "transparent",
                              backgroundColor: "#4CB050",
                            }}
                            className="primary-btn rounded    "
                          >
                            <i className="fa fa-plus"></i> <FormattedMessage id="details_mouton_commander"/>
                          </button>
                        </Link>
                      </div>
                    ) : null}
                    <div className="col-10 col sm-10 col-md-4 col-lg-4">
                      <button
                        style={{
                          borderColor: "transparent",
                          backgroundColor: "#f87171",
                        }}
                        className="primary-btn rounded     "
                        onClick={(e) => {
                          this.state.isFav
                            ? this.handleDeleteFav(this.state.Espece._id)
                            : this.handleFavoris(this.state.Espece._id);
                        }}
                      >
                        {this.state.isFav ? (
                          <span className="text-left text-danger ">
                            {" "}
                            <a id={this.state.Espece._id}>
                              <i className="fa fa-heart"></i>
                            </a>{" "}
                          </span>
                        ) : null}
                        {!this.state.isFav ? (
                          <span className="text-left ">
                            {" "}
                            <a id={this.state.Espece._id}>
                              <i
                                className="fa fa-heart"
                                style={{ color: "white" }}
                              ></i>
                            </a>{" "}
                          </span>
                        ) : null}
                        {/*                                 <i className="fa fa-plus"></i>
                         */}{" "}
                        {!this.state.isFav
                          ? <FormattedMessage id="details_mouton_ajouter_favoris"/>
                          : <FormattedMessage id="details_mouton_supprimer_favoris"/>}
                      </button>
                    </div>
                  </div>

                  <br></br>
                </div>
                <br></br>
              </div>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  margin: "20px",
                }}
              >
                <FormattedMessage id="details_mouton_annonces_similaire"/>
              </div>
              <div>
                <HomeCaroussel
                  espece={this.state.Espece.espece}
                  ville={this.state.Espece.localisation}
                />
              </div>
            </div>
          </section>
        )}
      </div>
    );
  }
}

export default DetailsMouton;
