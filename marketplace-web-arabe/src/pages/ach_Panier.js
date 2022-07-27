import React, { Component } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { HiOutlineBadgeCheck } from "react-icons/hi";

import { Link } from "react-router-dom";
import Loader from "react-loader-spinner";
import { GiWeight } from "react-icons/gi";
import { IoMdMale } from "react-icons/io";
import { FaShapes } from "react-icons/fa";
import { MdCake } from "react-icons/md";
import Pagination from "react-js-pagination";
import { FormattedMessage } from "react-intl";

const intl=JSON.parse(localStorage.getItem('intl'));
require("bootstrap-less/bootstrap/bootstrap.less");

class Commandes extends Component {
  constructor() {
    super();
    // let redirect = false;
    this.state = {
      loading: true,
      activePage: 1,
      nombrePages: [],
      currentPage: 1,
      annoncesPerPage: 2,
      Paniers: [],
      panier: [],
      redirect: false,
      coop: [],
      coopn: [],
    };
/*     let done = false;
 */
    // this.elv = this.elv.bind(this);
    this.handleDeleteFromPanier = this.handleDeleteFromPanier.bind(this);
  }
  // elv = (id) => {
  //   axios
  //     .get("http://127.0.0.1:8000/api/mouton/" + id)
  //     .then((res) => {
  //       //  console.log(res.data.objet)
  //       this.setState({ mouton: res.data.objet });
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };
  componentDidMount() {
    function appendLeadingZeroes(n) {
      if (n <= 9) {
        return "0" + n;
      }
      return n;
    }

    let current_datetime = new Date();
    let formatted_date =
      current_datetime.getFullYear() +
      "-" +
      appendLeadingZeroes(current_datetime.getMonth() + 1) +
      "-" +
      appendLeadingZeroes(current_datetime.getDate()) +
      " " +
      appendLeadingZeroes(current_datetime.getHours() - 2) +
      ":" +
      appendLeadingZeroes(current_datetime.getMinutes()) +
      ":" +
      appendLeadingZeroes(current_datetime.getSeconds());

    const expiredTimeToken = localStorage.getItem("expiredTimeToken");
    const token = localStorage.getItem("usertoken");
    const myToken = `Bearer ` + localStorage.getItem("myToken");

    if (!token || expiredTimeToken < formatted_date) {
      this.props.history.push("/login");
    } else {
      this.setState({ loading: true }, () => {
        axios
          .get("http://127.0.0.1:8000/api/consommateur/" + token + "/panier", {
            headers: {
              // "x-access-token": token, // the token is a variable which holds the token
              "Content-Type": "application/json",
              Authorization: myToken,
            },
          })
          .then((res) => {
            this.setState(
              {
                Paniers: res.data,
              },
              () =>
                this.setState({
                  Paniers: this.state.Paniers.filter(
                    (Paniers) => Paniers.statut === "disponible"
                  ),
                })
            );
            let i = 0;
            let coop = [];
            this.state.Paniers.map((c) => {
              coop[i] = c.id_cooperative;
              i++;
            });
            const unique = (value, index, self) => {
              return self.indexOf(value) === index;
            };
            this.setState({ coop: coop.filter(unique) });
            let coopn = [];
            if (this.state.coop.length == 0) {
              this.setState({ loading: false });
            }
            this.state.coop.map((c) =>
              axios
                .get("http://127.0.0.1:8000/api/cooperative/" + c, {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: myToken,
                  },
                })
                .then((res) => {
                  coopn.splice(0, 0, {
                    nom: res.data.nom,
                    idc: c,
                    adresse: res.data.adresse,
                    ville: res.data.ville,
                    rib: res.data.rib,
                    techniciens: res.data.techniciens,
                    parametres: res.data.parametres,
                    livraison: res.data.livraison,
                    occasion: res.data.occasion,
                    id_animateur: res.data.id_animateur,
                    paiement_rapide: res.data.paiement_rapide,
                  });
                  this.setState({ coopn: coopn });
                  let p = [];
                  this.state.coop.map((c) => {
                    p.splice(0, 0, {
                      _id: c,
                      nom: coopn
                        .filter((f) => f.idc === c)
                        .map((m) => m.nom)[0],
                      adresse: coopn
                        .filter((f) => f.idc === c)
                        .map((m) => m.adresse)[0],
                      ville: coopn
                        .filter((f) => f.idc === c)
                        .map((m) => m.ville)[0],
                      rib: coopn
                        .filter((f) => f.idc === c)
                        .map((m) => m.rib)[0],
                      tech: coopn
                        .filter((f) => f.idc === c)
                        .map((m) => m.techniciens)[0],
                      parametres: coopn
                        .filter((f) => f.idc === c)
                        .map((m) => m.parametres)[0],
                      livraison: coopn
                        .filter((f) => f.idc === c)
                        .map((m) => m.livraison)[0],
                      occasion: coopn
                        .filter((f) => f.idc === c)
                        .map((m) => m.occasion)[0],
                      paiement_rapide: coopn
                        .filter((f) => f.idc === c)
                        .map((m) => m.paiement_rapide)[0],
                      id_animateur: coopn
                        .filter((f) => f.idc === c)
                        .map((m) => m.id_animateur)[0],
                      id_espaces: this.state.Paniers.filter(
                        (f) => f.id_cooperative === c
                      ).map((m) => m._id),
                      especes: this.state.Paniers.filter(
                        (f) => f.id_cooperative === c
                      ),
                      prix: this.state.Paniers.filter(
                        (f) => f.id_cooperative === c
                      ).reduce(function (prev, cur) {
                        return prev - -cur.prix;
                      }, 0),
                    });
                  });
                  this.setState({ panier: p });
                  const pageNumbers = [];
                  for (
                    let i = 1;
                    i <=
                    Math.ceil(
                      this.state.panier.length / this.state.annoncesPerPage
                    );
                    i++
                  ) {
                    pageNumbers.push(i);
                  }
                  this.setState({ nombrePages: pageNumbers, loading: false });
                })
            );
          });
      });
    }
  }
  handleDeleteFromPanier(Mid, cid) {
    // const idm = this.props.location.state.id;
    // console.log(Mid);
    const token = localStorage.getItem("usertoken");
    const myToken = `Bearer ` + localStorage.getItem("myToken");
    if (!token) {
      this.props.history.push("/login");
    } else {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "ml-2 btn btn-success",
          cancelButton: " btn btn-danger",
        },
        buttonsStyling: false,
      });

      swalWithBootstrapButtons
        .fire({
          title: intl.messages.panier_delete_item,
          text: intl.messages.panier_delete_message,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: intl.messages.panier_delete_oui,
          cancelButtonText: intl.messages.panier_delete_non,
          reverseButtons: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            axios
              .put(
                "http://127.0.0.1:8000/api/consommateur/" +
                  token +
                  "/panier/" +
                  Mid,
                {},
                {
                  headers: {
                    //"Content-Type": "application/json",

                    Authorization: myToken,
                  },
                }
              )
              .then(() => {
                this.setState({
                  Paniers: this.state.Paniers.filter(
                    (Paniers) => Paniers._id !== Mid
                  ),
                });

                let p = [];

                this.state.coop.map((c) => {
                  p.splice(0, 0, {
                    _id: c,
                    nom: this.state.coopn
                      .filter((f) => f.idc === c)
                      .map((m) => m.nom)[0],
                    adresse: this.state.coopn
                      .filter((f) => f.idc === c)
                      .map((m) => m.adresse)[0],
                    ville: this.state.coopn
                      .filter((f) => f.idc === c)
                      .map((m) => m.ville)[0],
                    rib: this.state.coopn
                      .filter((f) => f.idc === c)
                      .map((m) => m.rib)[0],
                    tech: this.state.coopn
                      .filter((f) => f.idc === c)
                      .map((m) => m.techniciens)[0],
                    parametres: this.state.coopn
                      .filter((f) => f.idc === c)
                      .map((m) => m.parametres)[0],
                    id_espaces: this.state.Paniers.filter(
                      (f) => f.id_cooperative === c
                    ).map((m) => m._id),
                    especes: this.state.Paniers.filter(
                      (f) => f.id_cooperative === c
                    ),
                    prix: this.state.Paniers.filter(
                      (f) => f.id_cooperative === c
                    ).reduce(function (prev, cur) {
                      return prev - -cur.prix;
                    }, 0),
                  });
                });

                this.setState({
                  panier: p.filter((f) => f.especes.length >= 1),
                });

                this.props.history.push("/panier");
              });
            Swal.fire({
              title: intl.messages.panier_delete_succes,
              icon: "success",
              width: 400,
              heightAuto: false,
              timer: 1500,
              showConfirmButton: false,
            });
            const pageNumbers = [];
            for (
              let i = 1;
              i <=
              Math.ceil(
                this.state.panier.filter((f) => f.especes.length >= 1).length /
                  this.state.annoncesPerPage
              );
              i++
            ) {
              pageNumbers.push(i);
            }
            this.setState({ nombrePages: pageNumbers });
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire({
              title: intl.messages.panier_delete_failed,
              icon: "error",
              width: 400,
              heightAuto: false,
              timer: 1500,
              showConfirmButton: false,
            });
          }
        });
    }
  }
  annonceVision(a) {
    if (a.race === undefined) {
      return " ";
    } else return a.race;
  }

  paginate(pageNumber) {
    this.setState({ currentPage: pageNumber });
  }

  render() {
    var fav = this.state.Paniers.filter((Paniers) => Paniers !== null);

    const { loading } = this.state;

    let titre;
    if (fav.length === 1 || fav.length === 0) {
      titre = (
        <h6>
          <span>{fav.length}</span>  <FormattedMessage values={{ count: fav.length }} id="panier_nbr_annonces" />{" "}
        </h6>
      );
    } 
    else if (fav.length === 2) {
      titre = (
        <h6>
          <FormattedMessage values={{ count: fav.length }} id="panier_nbr_annonces" />{" "}
        </h6>
      );
    }
    else {
      titre = (
        <h6>
          <span>{fav.length}</span>  <FormattedMessage values={{ count: fav.length }} id="panier_nbr_annonces" />{" "}
        </h6>
      );
    }
    return (
      <div>
        {/* //   {/* <!-- Page Preloder --> */}
        {/* <div id="preloder">
           <div className="loader"></div>
        </div>  */}

        <section style={localStorage.getItem("lg")=='ar'?{"direction":"rtl"}:{}} className="">
          <div className="container">
            <br></br>
            <h3 style={localStorage.getItem("lg")=='ar'?{"textAlign":"justify"}:{}} className="latest-product__item">
            <FormattedMessage id="panier_title" /> <i className="fa fa-shopping-cart"></i>
            </h3>

            <div className="row">
              <div className="col-lg-12 col-md-7">
                {/*<!-- Sheeps Grid Section Begin --> */}
                <div style={localStorage.getItem("lg")=='ar'?{"textAlignLast":"right"}:{}} className="filter__found text-left">
                  <h6>
                    <span>{titre}</span>
                  </h6>
                </div>
                <div>
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
                      <Loader
                        type="Oval"
                        color="#7fad39"
                        height="80"
                        width="80"
                      />
                    </div>
                  ) : (
                    <div>
                      <div>
                        {this.state.panier.length === 0 ? (
                          <div
                            className="text-center my-5"
                            style={{ height: "30rem" }}
                          >
                            <p style={{ color: "#fba502" }}>
                              <i
                                className="fa fa-frown-o fa-5x"
                                aria-hidden="true"
                              ></i>
                            </p>

                            <h3 style={{ color: "#28a745" }}>
                            <FormattedMessage id="panier_vide" />
                            </h3>
                          </div>
                        ) : (
                          this.state.panier
                            .slice(
                              this.state.currentPage * 2 - 2,
                              this.state.currentPage * 2
                            )
                            .map((p) => (
                              <div className="row  mb-2">
                                <div className=" col-lg-12 col-md-12 col-sm-12 mt-3">
                                  <b style={localStorage.getItem("lg")=='ar'?{float:"right"}:{}} className="text-dark"><FormattedMessage id="panier_cooperative" /> : </b>
                                  <b style={localStorage.getItem("lg")=='ar'?{float:"right"}:{}} className="text-primary">{p.nom}</b>
                                  <Link
                                    to={{
                                      pathname: "/Commander",
                                      state: {
                                        id: p.id_espaces,
                                        cooperative: p,
                                      },
                                    }}
                                  >
                                    {p.especes.length > 1 ? (
                                      <>
                                        {" "}
                                        <b
                                          style={localStorage.getItem("lg")=='ar'?{
                                          float:"left",color: "#fe6927",
                                          fontWeight: "900",
                                          fontSize: "18pt",}
                                          :{float:"right",
                                          color: "#fe6927",
                                          fontWeight: "900",
                                          fontSize: "18pt",}}
                                        >
                                          {p.prix} <FormattedMessage id="panier_currency" />{" "}
                                          <button
                                            id={p.id_espaces}
                                            className=" rounded text-white bg-success py-1 px-2 ml-3  "
                                            style={{
                                              maxHeight:"50px",
                                              minHeight: "45px",
                                              fontSize: "16px",
                                              border: "none",
                                            }}
                                            //  onClick={(e) => {
                                            //   this.handlePanier(e.currentTarget.id);
                                            //  }
                                            // }
                                          >
                                            {""} <FormattedMessage id="panier_cmd_globale" />
                                          </button>
                                        </b>
                                      </>
                                    ) : (
                                      <></>
                                    )}{" "}
                                  </Link>
                                </div>

                                <br></br>
                                <br></br>
                                <br></br>
                                {p.especes.map((Annonces) => (
                                  <div className="col-sm-auto">
                                    <div id="anonce" className="product__item">
                                      <div
                                        className="product__item__pic set-bg"
                                        // data-setbg={Annonces.images}
                                        // src="Images/sardi1.jpg"
                                      >
                                        <img
                                          src={Annonces.image_face}
                                          alt="item"
                                          style={{
                                            width: "355px",
                                            height: "170px",
                                            borderTopRightRadius: "10%",
                                            borderTopLeftRadius: "10%",
                                            objectFit: "contain",
                                          }}
                                        />
                                        <ul className="product__item__pic__hover">
                                          <li>
                                            <Link
                                              to={`/DetailsMouton/${Annonces._id}`}
                                            >
                                              <a href="#">
                                                <i className="fa fa-eye"></i>
                                              </a>
                                            </Link>
                                          </li>
                                          <li>
                                            <a
                                              id={Annonces._id}
                                              onClick={(e) =>
                                                this.handleDeleteFromPanier(
                                                  e.currentTarget.id
                                                )
                                              }
                                            >
                                              <i className="fa fa-trash"></i>
                                            </a>
                                          </li>
                                        </ul>
                                      </div>
                                      {Annonces.anoc ? (
                                        <h1
                                          style={{
                                            borderRadius: "0% 0% 0% 40%",
                                            fontSize: "14px",
                                          }}
                                          className=" badge badge-success pt-2 w-100  "
                                        >
                                          <HiOutlineBadgeCheck className=" mr-1 fa-lg " />
                                          <span><FormattedMessage id="panier_Labelise"/></span>{" "}
                                        </h1>
                                      ) : (
                                        <span className="badge pt-3 w-100 mb-2    ">
                                          {" "}
                                        </span>
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
                                            {Annonces.espece == "chevre"
                                              ? <FormattedMessage id="tout_les_annonces_chevre"/>
                                              : <FormattedMessage id="tout_les_annonces_mouton"/>}
                                            <span style={localStorage.getItem('lg')=="ar"?{ float: "left"}:{float:"right"}}>
                                              <FaShapes
                                                style={{ marginRight: "5px" }}
                                              />
                                              {" " + Annonces.race}
                                            </span>
                                          </div>
                                          <div>
                                            <IoMdMale
                                              className=" mr-1 fa-lg "
                                              style={{
                                                marginRight: "5px",
                                              }}
                                            />
                                            {Annonces.sexe}
                                            <span style={localStorage.getItem('lg')=="ar"?{ float: "left"}:{float:"right"}}>
                                              <GiWeight
                                                className=" mr-1 fa-lg "
                                                style={{ marginRight: "5px" }}
                                              />
                                              <FormattedMessage id="panier_mouton_poids_kg"
                                            values={{ poids:Annonces.poids }} />
                                            </span>
                                          </div>
                                          <div>
                                            <span style={localStorage.getItem('lg')=="ar"?{ float: "right"}:{float:"left"}}>
                                              <MdCake
                                                className=" mr-1 fa-lg "
                                                style={{ marginRight: "5px" }}
                                              />

                                            <FormattedMessage id="panier_mouton_age_mois"
                                            values={{ age:Annonces.age }} />
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
                                            <FormattedMessage id="panier_mouton_currency"
                                            values={{ prix:Annonces.prix }} />
                                          </div>
                                          <br></br>
                                          {Annonces.statut === "disponible" ? (
                                            <Link
                                              to={{
                                                pathname: "/Commander",
                                                state: {
                                                  id: Annonces._id,
                                                  cooperative: p,
                                                },
                                              }}
                                            >
                                              <div
                                                style={{ textAlign: "center" }}
                                              >
                                                <button
                                                  id={Annonces._id}
                                                  className="rounded text-white bg-success py-1 px-2 center"
                                                  style={{
                                                    fontSize: "16px",
                                                    border: "none",
                                                    marginLeft: "auto",
                                                    marginRight: "auto",
                                                  }}
                                                  //  onClick={(e) => {
                                                  //   this.handlePanier(e.currentTarget.id);
                                                  //  }
                                                  // }
                                                >
                                                  {""} <FormattedMessage id="panier_commander"/>
                                                </button>
                                              </div>
                                            </Link>
                                          ) : null}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ))
                        )}
                      </div>
                      {/* <!-- Sheeps Grid Section End --> */}

                      {
                        <div className="center-div">
                          <Pagination
                            activePage={this.state.currentPage}
                            itemsCountPerPage={9}
                            totalItemsCount={this.state.panier.length}
                            pageRangeDisplayed={7}
                            onChange={this.paginate.bind(this)}
                            itemClass="page-item"
                            linkClass="page-link"
                          />
                        </div>
                      }
                      <br></br>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <br></br>
          </div>
        </section>
      </div>
    );
  }
}
export default Commandes;
