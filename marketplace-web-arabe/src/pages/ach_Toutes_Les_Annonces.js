import React, { Component } from "react";
import axios from "axios";
import Select from "react-select";
import { Link } from "react-router-dom";
import Loader from "react-loader-spinner";
import { GiWeight, GiSheep, GiGoat } from "react-icons/gi";
import { IoMdMale } from "react-icons/io";
import { FaShapes } from "react-icons/fa";
import { MdCake } from "react-icons/md";
import { HiOutlineBadgeCheck } from "react-icons/hi";
import "bootstrap/dist/css/bootstrap.css";
import "react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css";
import RangeSlider from "react-bootstrap-range-slider";
import Pagination from "react-js-pagination";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

import styled, { keyframes } from "styled-components";
import { bounce } from "react-animations";
import { FormattedMessage } from "react-intl";

require("bootstrap-less/bootstrap/bootstrap.less");
const Bounce = styled.div`
  animation: 2s ${keyframes`${bounce}`} infinite;
`;

class HomeSheeps extends Component {
  constructor() {
    super();

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.popupOnClose = this.popupOnClose.bind(this);
    // let redirect = false;
    this.state = {
      alreadySeen: false,
      open: false,
      loading: true,
      open: false,
      activePage: 1,
      nombrePages: [],
      currentPage: 1,
      annoncesPerPage: 9,
      Disabled: true,
      Annonces: [],
      AnnoncesN: [],
      selectedOptionRace: null,
      race: [],
      selectedOptionEspece: null,
      valueprice: null,
      valuepoids: null,
      poids_max: null,
      poids_min: null,
      prix_max: 10000,
      prix_min: 1,
      nbrmoutons: null,
      nbrchevre: null,

      optionsEspece: [],
      selectedOptionVille: null,
      optionsVille: [],
      conditions: {
        statut: "disponible",
        order_by: "espece",
        order_mode: "asc",
      },
      redirect: false,

      selectedOptionSort: null,
      optionsSort: [
        { value: "prix", label: <FormattedMessage id="tout_les_annonces_moins_cher_au_plus" /> },
        { value: "prix_dec", label:<FormattedMessage id="tout_les_annonces_plus_cher_au_moins" /> },

        { value: "age", label: <FormattedMessage id="tout_les_annonces_plus_jeune_au_plus_age" /> },
        { value: "age_dec", label:<FormattedMessage id="tout_les_annonces_plus_age_au_plus_jeune" /> },

        { value: "poids", label: <FormattedMessage id="tout_les_annonces_moins_lourd_au_plus_lourd" /> },
        { value: "poids_dec", label:<FormattedMessage id="tout_les_annonces_plus_lourd_aumoins_lourd" /> },
      ],
    };

    this.onChange = this.onChange.bind(this);
    this.handleChangeEspece = this.handleChangeEspece.bind(this);

    this.handelChercher = this.handelChercher.bind(this);
    this.handelReinitialiser = this.handelReinitialiser.bind(this);
    this.handleChangeRegion = this.handleChangeRegion.bind(this);

    this.sortData = this.sortData.bind(this);

    this.paginate = this.paginate.bind(this);
    // this.handleFavoris=this.handleFavoris.bind(this)
  }
  /*  countmoutons() {
     axios
         .get("http://127.0.0.1:8000/api/Espece?statut=disponible&order_by=espece&order_mode=asc&espece=mouton", {
           headers: {
             "Content-Type": "application/json",
           },
           params: this.state.conditions,
         })
         .then((res) => {
           this.setState({
             nbrmoutons: res.data.length,
           });
         });
   } */
  openModal() {
    this.setState({ open: true });
  }

  closeModal() {
    this.setState({ open: false });
  }

  popupOnClose() {}

  handleChangeEspece = (selectedOptionEspece) => {
    this.setState({
      selectedOptionRace: null,
      selectedOptionEspece: selectedOptionEspece,
    });
    let annonce = this.state.AnnoncesN;
    let c = selectedOptionEspece.value;
    let races = [];

    let r = [];
    this.groupBy(annonce, "espece")[c].map((m) => {
      races.push(m.race);
    });
    races = [...new Set(races)];
    races.map((e) => {
      r.splice(0, 0, { value: e, label: e });
    });

    this.setState({
      race: r,
      Disabled: false,
      conditions: Object.assign(this.state.conditions, {
        espece: c,
        race: null,
      }),
    });
  };

  handleChangeRace = (selectedOptionRace) => {
    this.setState({ selectedOptionRace }, () =>
      this.setState({
        conditions: Object.assign(this.state.conditions, {
          race: this.state.selectedOptionRace.value,
        }),
      })
    );
  };

  handleChangeSort = (selectedOptionSort) => {
    this.setState({ selectedOptionSort }, () =>
      this.setState({
        selectedOptionSort: selectedOptionSort,
      })
    );
  };

  handleChangeVille = (selectedOptionVille) => {
    this.setState({ selectedOptionVille }, () =>
      this.setState({
        conditions: Object.assign(this.state.conditions, {
          localisation: this.state.selectedOptionVille.value,
        }),
      })
    );
  };

  groupBy(objectArray, property) {
    return objectArray.reduce((acc, obj) => {
      const key = obj[property];
      if (!acc[key]) {
        acc[key] = [];
      }
      // Add object to list for given key's value
      acc[key].push(obj);
      return acc;
    }, {});
  }

  componentDidMount() {
    const token = localStorage.getItem("usertoken");
    this.setState({ loading: true }, () => {
      axios
        .get(
          "http://127.0.0.1:8000/api/Espece?statut=disponible&order_by=espece&order_mode=asc&espece=mouton",
          {
            headers: {
              "Content-Type": "application/json",
            },
            params: this.state.conditions,
          }
        )
        .then((res) => {
          this.setState({
            nbrmoutons: res.data.length,
          });
        });
      axios
        .get(
          "http://127.0.0.1:8000/api/Espece?statut=disponible&order_by=espece&order_mode=asc&espece=chevre",
          {
            headers: {
              "Content-Type": "application/json",
            },
            params: this.state.conditions,
          }
        )
        .then((res) => {
          this.setState({
            nbrchevre: res.data.length,
          });
        });
    });
    axios
      .get("http://127.0.0.1:8000/api/EspecesMinMax", {
        headers: {
          "Content-Type": "application/json",
        },
        params: this.state.conditions,
      })
      .then((res) => {
        this.setState({
          prix_max: res.data.all.prix_max,
          prix_min: res.data.all.prix_min,
          poids_min: res.data.all.poids_min,
          poids_max: res.data.all.poids_max,
        });
      });

    axios
      .get("http://127.0.0.1:8000/api/Espece", {
        headers: {
          "Content-Type": "application/json",
        },
        params: {
          statut: "disponible",
          order_by: "espece",
          order_mode: "asc",
        },
      })
      .then((res) => {
        //espece
        let espece = [];
        Object.getOwnPropertyNames(this.groupBy(res.data, "espece")).map(
          (e) => {
            espece.splice(0, 0, { value: e, label: e });
          }
        );

        //ville
        let ville = [];
        let villes = [];
        res.data.map((e) => {
          villes.push(e.localisation);
        });
        villes = [...new Set(villes)];
        villes.map((e) => {
          ville.splice(0, 0, { value: e, label: e });
        });
        this.setState({
          optionsEspece: espece,
          optionsVille: ville,
          AnnoncesN: res.data,
          Annonces: res.data,
          loading: false,
        });
        const pageNumbers = [];
        for (
          let i = 1;
          i <=
          Math.ceil(this.state.Annonces.length / this.state.annoncesPerPage);
          i++
        ) {
          pageNumbers.push(i);
        }
        this.setState({ nombrePages: pageNumbers });
      });
  }

  onChange(e) {
    const n = e.target.name,
      v = e.target.value;

    this.setState({
      conditions: Object.assign(this.state.conditions, { [n]: v }),
    });
  }

  sortData(e) {
    const sortProperty = Object.values(e)[0];
    const sorted = this.state.Annonces;
    this.setState({
      selectedOptionSort: Object.values(e)[1],
    });
    if (
      sortProperty === "prix" ||
      sortProperty === "poids" ||
      sortProperty === "age"
    ) {
      this.setState({ loading: true }, () => {
        sorted.sort((a, b) => a[sortProperty] - b[sortProperty]);
        this.setState({
          Annonces: sorted,
          loading: false,
        });
      });
    } else if (sortProperty === "prix_dec") {
      const sort_ = "prix";
      this.setState({ loading: true }, () => {
        sorted.sort((a, b) => b[sort_] - a[sort_]);
        this.setState({ Annonces: sorted, loading: false });
      });
    } else if (sortProperty === "poids_dec") {
      const sort_ = "poids";
      this.setState({ loading: true }, () => {
        sorted.sort((a, b) => b[sort_] - a[sort_]);
        this.setState({ Annonces: sorted, loading: false });
      });
    } else if (sortProperty === "age_dec") {
      const sort_ = "age";
      this.setState({ loading: true }, () => {
        sorted.sort((a, b) => b[sort_] - a[sort_]);
        this.setState({ Annonces: sorted, loading: false });
      });
    } else {
      this.setState({ loading: true }, () => {
        sorted.sort(function (a, b) {
          return new Date(b[sortProperty]) - new Date(a[sortProperty]);
        });
        this.setState({ Annonces: sorted, loading: false });
      });
    }
  }

  handelReinitialiser() {
    this.setState({ loading: true }, () => {
      axios
        .get("http://127.0.0.1:8000/api/Espece", {
          headers: {
            "Content-Type": "application/json",
          },
          params: {
            statut: "disponible",
            order_by: "espece",
            order_mode: "asc",
          },
        })
        .then((res) => {
          this.setState({
            Annonces: res.data,
            loading: false,
            conditions: {
              statut: "disponible",
              order_by: "espece",
              order_mode: "asc",
            },
            selectedOptionEspece: null,
            selectedOptionRace: null,
            Disabled: true,
            selectedOptionVille: null,
          });
          var all = document.querySelectorAll(
            'input[name="reference"],input[name="prix_min"],input[name="prix_max"],input[name="poids_min"],input[name="poids_max"]'
          );
          Array.from(all).map((a) => (a.value = null));

          const pageNumbers = [];
          for (
            let i = 1;
            i <=
            Math.ceil(this.state.Annonces.length / this.state.annoncesPerPage);
            i++
          ) {
            pageNumbers.push(i);
          }
          this.setState({ nombrePages: pageNumbers });
        });
    });
  }
  handelChercher() {
    this.setState({ loading: true }, () => {
      axios
        .get("http://127.0.0.1:8000/api/Espece", {
          headers: {
            // "x-access-token": token, // the token is a variable which holds the token
            "Content-Type": "application/json",
          },
          params: this.state.conditions,
        })
        .then((res) => {
          this.setState({
            Annonces: res.data,
            loading: false,
          });
          const pageNumbers = [];
          for (
            let i = 1;
            i <=
            Math.ceil(this.state.Annonces.length / this.state.annoncesPerPage);
            i++
          ) {
            pageNumbers.push(i);
          }
          this.setState({ nombrePages: pageNumbers });
        });
    });
  }

  handleChangeRegion(selectedOptionRegions) {
    this.setState(
      {
        loading: true,
        conditions: {
          statut: "disponible",
          order_by: "espece",
          order_mode: "asc",
          region: selectedOptionRegions,
        },
      },
      () => {
        axios
          .get("http://127.0.0.1:8000/api/especes/search", {
            headers: {
              // "x-access-token": token, // the token is a variable which holds the token
              "Content-Type": "application/json",
            },
            params: this.state.conditions,
          })
          .then((res) => {
            console.log(this.state.conditions);

            this.setState({
              Annonces: res.data,
              loading: false,
            });
            const pageNumbers = [];
            for (
              let i = 1;
              i <=
              Math.ceil(
                this.state.Annonces.length / this.state.annoncesPerPage
              );
              i++
            ) {
              pageNumbers.push(i);
            }
            this.setState({ nombrePages: pageNumbers });
          });
      }
    );
  }

  handleChangeCategorie(selectedOptionEspece) {
    this.setState(
      {
        loading: true,
        conditions: {
          statut: "disponible",
          order_by: "espece",
          order_mode: "asc",
          espece: selectedOptionEspece,
        },
      },
      () => {
        axios
          .get("http://127.0.0.1:8000/api/Espece", {
            headers: {
              // "x-access-token": token, // the token is a variable which holds the token
              "Content-Type": "application/json",
            },
            params: this.state.conditions,
          })
          .then((res) => {
            console.log(this.state.conditions);

            this.setState({
              Annonces: res.data,
              loading: false,
            });
            const pageNumbers = [];
            for (
              let i = 1;
              i <=
              Math.ceil(
                this.state.Annonces.length / this.state.annoncesPerPage
              );
              i++
            ) {
              pageNumbers.push(i);
            }
            this.setState({ nombrePages: pageNumbers });
          });
      }
    );
  }
  closeModal = () => {
    this.setState({ open: false });
  };

  annonceVision(a) {
    if (a.race === undefined) {
      return " ";
    } else return a.race;
  }
  // handleFavoris(Mid) {
  //   console.log(Mid);
  //   const token = localStorage.getItem("usertoken");
  //   if (!token) {
  //     this.props.history.push("/login");
  //   } else {
  //     // console.log(token);
  //     axios
  //       .put(
  //         "http://127.0.0.1:8000/api/consommateur/" + token + "/favoris",{ id_mouton: Mid }

  //        , {
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //         }

  //       )
  //       .then((res) => {});
  //   }
  // }

  paginate(pageNumber) {
    this.setState({ currentPage: pageNumber });
  }

  render() {
    var mois = new Array(
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre"
    );
    const indexOfLastAnnonce =
      this.state.currentPage * this.state.annoncesPerPage;
    const indexOfFirstAnnonce = indexOfLastAnnonce - this.state.annoncesPerPage;
    const currentAnnonces = this.state.Annonces.slice(
      indexOfFirstAnnonce,
      indexOfLastAnnonce
    );
    const { selectedOptionRace } = this.state;
    const { selectedOptionEspece } = this.state;
    const { optionsEspece } = this.state;
    const { selectedOptionVille } = this.state;
    const { optionsVille } = this.state;
    const { optionsSort } = this.state;
    const { loading } = this.state;
    const { valueprice } = this.state;
    const { valuepoids } = this.state;

    const { poids_max } = this.state;
    const { poids_min } = this.state;

    const { prix_max } = this.state;
    const { prix_min } = this.state;

    const { nbrmoutons } = this.state;
    const { nbrchevre } = this.state;
    const { alreadySeen } = this.state;

    setTimeout(() => {
      if (!alreadySeen) {
        this.setState({ open: true, alreadySeen: true });
      }
    }, 4000);

    return (
      <div style={localStorage.getItem("lg") == "ar" ? { direction: "rtl" } : {}}>
        <section className="search-header">
          {/*           <div>
            <button type="button" className="button" onClick={() => {this.setState({open:true})}}>
              Controlled Popup
            </button>
            <Popup open={open} >
              <div className="modal">
                <a className="close" >
                  &times;
                </a>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae magni
                omnis delectus nemo, maxime molestiae dolorem numquam mollitia, voluptate
                ea, accusamus excepturi deleniti ratione sapiente! Laudantium, aperiam
                doloribus. Odit, aut.
              </div>
            </Popup>
          </div>
 */}
          {/*           <Modal /> */}
          {/*           <Demo/> */}
          {/* <Popup modal trigger={<button>Click Me</button>}>
            {close => <Content close={close} />}
          </Popup> */}

          {/* <div style={styles}>
    <h2>Rejoignez l'application mobile Aujourd'hui! {"\u2728"}</h2>
    <Popup trigger={<button>Trigger</button>}>
      <div> Your Popup content here Your Popup content hereYour Popup content hereYour Popup content hereYour Popup content here </div>
    </Popup>
  </div> */}

          {/* <div>
    <input
      type="button"
      value="Click to Open Popup"
      onClick={togglePopup}
    />
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    {isOpen && <Popup1
      content={<>
        <b>Design your Popup</b>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <button>Test button</button>
      </>}
      handleClose={togglePopup}
    />}
  </div> */}

          <div>
            {/*         <span onClick={this.openModal}>Click here to open Popup</span>
             */}{" "}
            <Popup
              open={this.state.open}
              enablebackground="https://png.pngtree.com/thumb_back/fw800/back_our/20190619/ourmid/pngtree-mobile-app-display-rack-background-material-image_135842.jpg"
              className="popup-modal-container-box"
              modal
              onOpen={(e) => this.popupOnClose(e)}
              onClose={this.popupOnClose}
              /*           lockScroll={true}
               */ closeOnDocumentClick={false}
            >
              <br></br>
              <center>
                <h4>
                  {"\u2728"} <FormattedMessage id="tout_les_annonces_popup_title"/>{" "}
                  {"\u2728"}
                </h4>
              </center>
              <br></br>
              <br></br>
              <div style={localStorage.getItem('lg')=='ar'?{ display: "flex", flexDirection: "row",direction:"rtl" }:{ display: "flex", flexDirection: "row"}}>
                <div className="infoCards item" style={{ flexBasis: "70%" }}>
                  {" "}
                  <a href="https://qrco.de/bcHPx6">
                    <center>
                      {" "}
                      <Bounce>
                        <img
                          style={{ width: "80%" }}
                          src="http://www.anoc.ma/wp-content/uploads/2021/06/6-01.jpg"
                          alt=""
                        />
                      </Bounce>
                    </center>
                  </a>
                </div>
                <div
                  className="item"
                  style={{
                    flexBasis: "30%",
                    marginBottom: "auto",
                    marginTop: "auto",
                  }}
                >
                  <center>
                    <img
                      style={{ width: "70%" }}
                      src="./Images/my_App.png"
                      alt=""
                    />
                  </center>
                </div>
              </div>
              <br />
              <div style={localStorage.getItem('lg')=='ar'?{}:{ display: "flex" }}>
                <button
                  className="fermer"
                  style={{ marginLeft: "auto" }}
                  onClick={this.closeModal}
                >
                  <FormattedMessage id="tout_les_annonces_popup_button_fermer"/>
                </button>
              </div>
            </Popup>
          </div>
          <div
            style={{
              backgroundImage:
                'url("https://i.ibb.co/88zvScY/secondsectionespece.jpg")',
              backgroundSize: "cover",
              height: "100%",
            }}
          >
            <div className="searchheader">
              <div
                className="col-lg-2 col-md-3"
                style={{ display: "table-cell", verticalAlign: "middle" }}
              >
                <FormattedMessage id="tout_les_annonces_espece">
                          {(placeholder) => (
                            <Select
                            value={selectedOptionEspece}
                            onChange={this.handleChangeEspece}
                            options={optionsEspece}
                            placeholder={placeholder}
                            required
                          />
                          )}
                        </FormattedMessage>
                
              </div>

              <div
                className="col-lg-2 col-md-3"
                style={{ display: "table-cell", verticalAlign: "middle" }}
              >
                <FormattedMessage id="home_item_race">
                          {(placeholder) => (
                            <Select
                            id="recherchePlace"
                            isDisabled={this.state.Disabled}
                            value={selectedOptionRace}
                            onChange={this.handleChangeRace}
                            options={this.state.race}
                            placeholder={placeholder}
                            required
                          />
                          )}
                        </FormattedMessage>
                
              </div>
              <div
                className="col-lg-2 col-md-3"
                style={{ display: "table-cell", verticalAlign: "middle" }}
              >
                <FormattedMessage id="tout_les_annonces_ville">
                          {(placeholder) => (
                            <Select
                            value={selectedOptionVille}
                            onChange={this.handleChangeVille}
                            options={optionsVille}
                            placeholder={placeholder}
                          />
                          )}
                        </FormattedMessage>
                
              </div>
              {/*             <div className="col-lg-3 col-md-3">
              <input
                id="recherchePlace"
                type="text"
                className="form-control"
                placeholder=" Reference de l'annonce"
                name="reference"
                onChange={this.onChange}
              />
            </div> */}
              {/*             <div className="col-lg-2 col-md-3">
              <input
                id="recherchePlace"
                type="text"
                className="form-control"
                placeholder=" Budget min"
                name="prix_min"
                onChange={this.onChange}
              />
            </div> */}

              <div
                className="col-lg-2 col-md-3"
                name="prix_max"
                id="recherchePlace"
                style={localStorage.getItem('lg')=='ar'?{ display: "table-cell",direction:"ltr" }:{ display: "table-cell" }}
              >
                <RangeSlider
                  tooltip="auto"
                  name="prix_max"
                  id="recherchePlace"
                  value={valueprice}
                  min={prix_min}
                  max={prix_max}
                  onChange={(e) =>
                    this.setState({
                      conditions: Object.assign(this.state.conditions, {
                        prix_max: e.target.value,
                      }),
                      valueprice: e.target.value,
                    })
                  }
                  /*  onAfterChange={e => this.setState({
            conditions: Object.assign(this.state.conditions, { [e.target.name]: e.target.value }),
            valueprice: e.target.value
          })} */
                />
                <div style={{ color: "white" }}>
                  {" "}
                  <FormattedMessage
   id = "tout_les_annonces_prix_max"
   values = {{Mprix: valueprice}}
/>
                  {/* Prix max : {valueprice} DH */}
                </div>
                <RangeSlider
                  tooltip="auto"
                  name="poids_max"
                  value={valuepoids}
                  min={poids_min}
                  max={poids_max}
                  onChange={(e) =>
                    this.setState({
                      conditions: Object.assign(this.state.conditions, {
                        poids_max: e.target.value,
                      }),
                      valuepoids: e.target.value,
                    })
                  }
                  /*  onAfterChange={e => this.setState({
            conditions: Object.assign(this.state.conditions, { [e.target.name]: e.target.value }),
            valueprice: e.target.value
          })} */
                />
                <div style={{ color: "white" }}>
                  {" "}
                  <FormattedMessage
   id = "tout_les_annonces_poids__max"
   values = {{Mpoids: valuepoids}}
/>
                  {/* Poids max : {valuepoids} KG */}
                </div>
                {/*   <input
                id="recherchePlace"
                type="text"
                className="form-control"
                placeholder=" Budget max"
                name="prix_max"
                onChange={this.onChange}
              /> */}
              </div>

              {/*             <div className="col-lg-2 col-md-3">
              <input
                id="recherchePlace"
                type="text"
                className="form-control"
                placeholder=" Poids min"
                name="poids_min"
                onChange={this.onChange}
              />
            </div>
            <div className="col-lg-2 col-md-3">
              <input
                id="recherchePlace"
                type="text"
                className="form-control"
                placeholder=" Poids max"
                name="poids_max"
                onChange={this.onChange}
              />
            </div> */}

              <div
                className="col-lg-2 col-md-3"
                style={{ display: "table-cell", verticalAlign: "middle" }}
              >
                <button
                  id="roundB"
                  className="newBtn site-btn"
                  onClick={this.handelChercher}
                >
                  <i className="fa fa-search "></i> <FormattedMessage id="tout_les_annonces_rechrcher"/>{" "}
                </button>
              </div>
              <div
                className="col-lg-2 col-md-3"
                style={{ display: "table-cell", verticalAlign: "middle" }}
              >
                <button
                  id="roundB"
                  className="newBtn site-btn"
                  onClick={this.handelReinitialiser}
                >
                  <i className="fa fa-refresh"></i> <FormattedMessage id="tout_les_annonces_reinilialiser"/>{" "}
                </button>
              </div>
            </div>
          </div>
        </section>
        <div className="pageAnnonceEspeces">
          {/* <!-- Page Preloder --> */}
          {/* <div id="preloder">
          <div className="loader"></div>
        </div> */}

          <section className="">
            <br></br>

            <div className="container">
              <div className="row">
                <div className="col-lg-3 col-md-4">
                  <a className="lienapropos" href="./Apropos">
                    <div
                      style={{ cursor: "pointer" }}
                      className="categorie_items"
                    >
                      <span></span>

                      <img
                        style={{ height: "40px" }}
                        src={require("./Images/logo-text.png")}
                        alt=""
                      />
                      <br></br>
                      <p>
                        <FormattedMessage id="tout_les_annonces_my_anoc_message"/>
                      </p>
                    </div>
                  </a>
                  <h4 style={{ fontWeight: "900" }}><FormattedMessage id="tout_les_annonces_categorie"/></h4>
                  <br></br>
                  <div
                    id="gras"
                    style={{
                      cursor: "pointer",
                      backgroundColor: "white",
                      paddingRight: "1px",
                      borderRadius: "10px",
                      textAlign: "center",
                      boxShadow: "1px 1px 1px 1px rgb(158 158 158 / 60%)",
                    }}
                    className=" categorie_items"
                    onClick={(param) => this.handleChangeCategorie("mouton")}
                  >
                    <div>
                      {" "}
                      <GiSheep className=" mr-1 fa-lg " />
                      <FormattedMessage id="tout_les_annonces_moutons"/>
                      <p style={{ margin: "0px" }}> {nbrmoutons} <FormattedMessage values={{ count: nbrmoutons }} id="panier_nbr_annonces" /> </p>
                    </div>
                  </div>
                  <div
                    id="gras"
                    style={{
                      cursor: "pointer",
                      backgroundColor: "white",
                      paddingRight: "1px",
                      borderRadius: "10px",
                      textAlign: "center",
                      boxShadow: "1px 1px 1px 1px rgb(158 158 158 / 60%)",
                    }}
                    className=" categorie_items"
                    onClick={(param) => this.handleChangeCategorie("chevre")}
                  >
                    <div style={{ verticalAlign: "middle", padding: "auto" }}>
                      {" "}
                      <GiGoat className=" mr-1 fa-lg " />
                      <FormattedMessage id="tout_les_annonces_chevres"/>
                      <p style={{ margin: "0px" }}> {nbrchevre} <FormattedMessage values={{ count: nbrchevre }} id="panier_nbr_annonces" /> </p>
                    </div>
                  </div>
                  <div className="mymap">
                    {" "}
                    <h4 style={{ fontWeight: "900", marginTop: "25px" }}>
                      <FormattedMessage id="tout_les_annonces_regions"/>
                    </h4>
                    <br></br>
                    <center>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsAmcharts="http://amcharts.com/ammap"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        version="1.1"
                        viewBox="0 0 612 820"
                        style={{ marginTop: "-60" }}
                      >
                        <g>
                          <path
                            onClick={(param) =>
                              this.handleChangeRegion(
                                "Tanger-Tétouan-Al Hoceïma"
                              )
                            }
                            id="MA-01"
                            title="Tanger-Tétouan-Al Hoceïma"
                            d="M505.091,182.589L504.892,186.859L506.041,198.086L506.195,198.152L502.255,200.168L495.946,200.872L491.886,205.353L488.042,202.629L484.853,207.196L480.646,208.863L469.044,205.177L466.305,200.334L461.938,203.157L455.035,203.297L452.987,210.197L453.268,214.479L447.364,217.28L444.398,214.698L444.195,211.412L440.184,207.794L431.143,203.926L431.007,196.757L424.616,195.599L422.689,193.654L411.977,192.597L418.39,173.967L420.41,170.051L424.166,155.313L428.854,155.229L431.125,157.004L434.659,154.417L439.282,154.501L441.866,151.162L445.108,150.166L449.411,151.162L447.848,155.252L448.236,160.122L450.504,166.518L453,167.294L457.149,173.011L462.344,177.222L471.697,182.512L484.015,185.115L500.469,179.842z"
                          />
                          <path
                            onClick={(param) =>
                              this.handleChangeRegion("L'Oriental")
                            }
                            id="MA-02"
                            title="L'Oriental"
                            d="M531.531,341.948L526.256,342.012L525.506,340.089L531.379,336.585L528.32,334.86L526.167,327.685L527.414,322.496L522.088,322.895L514.66,320.173L506.68,319.698L505.547,311.562L500.222,308.356L501.128,304.346L497.765,301.387L501.509,296.345L502.669,292.225L509.196,284.92L513.063,279.298L525.129,279.699L534.43,278.549L536.678,276.136L541.826,275.618L536.533,267.937L531.24,262.231L526.994,261.671L526.072,258.819L534.838,250.793L534.521,248.786L522.692,247.158L520.925,243.899L516.857,242.319L511.136,249.383L505.743,253.721L507.51,258.379L504.428,262.328L502.344,258.649L500.032,260.868L494.549,258.649L494.606,253.038L498.971,251.201L500.105,246.48L504.683,237.349L505.181,230.332L501.191,226.787L504.5,223.948L504.183,218.045L507.719,216.567L507.537,211.311L511.525,209.338L513.505,203.219L513.197,199.808L506.432,198.254L506.041,198.086L504.892,186.859L505.091,182.589L508.797,178.616L517.093,182.77L523.41,183.208L532.626,178.978L535.409,174.188L538.721,180.152L538.679,183.518L542.953,187.241L552.317,188.232L557.662,185.154L565.806,188.09L565.675,189.806L582.934,203.267L580.289,208.888L583.548,214.39L582.213,220.062L585.147,223.835L585.122,227.832L587.301,233.125L585.346,243.933L587.103,252.506L589.563,259.431L586.701,266.263L586.422,270.59L590.066,276.757L594.421,281.585L591.297,285.403L597.449,295.244L601.682,297.217L612,305.153L607.348,309.864L604.396,310.349L602.74,319.238L605.155,321.342L604.157,324.638L588.479,323.913L582.99,324.099L572.767,321.628L569.431,325.888L564.717,325.802L556.162,322.821L550.505,325.888L544.704,325.206L540.788,328.016L542.747,337.79L538.033,341.44z"
                          />
                          <path
                            onClick={(param) =>
                              this.handleChangeRegion("Fès- Meknès")
                            }
                            id="MA-03"
                            title="Fès- Meknès"
                            d="M497.765,301.387L495.633,299.827L492.856,302.339L488.552,302.339L486.523,296.195L479.359,288.59L472.218,289.074L468.633,286.308L469.103,283.149L465.74,279.456L459.494,280.04L456.503,286.494L453.186,285.979L452.479,286.43L450.738,288.815L450.656,288.813L450.781,288.675L450.291,287.063L447.408,283.385L448.496,278.102L443.928,278.232L440.013,272.605L440.556,268.979L434.465,266.322L428.663,262.339L428.675,262.258L431.431,258.839L430.444,256.075L430.676,255.191L433.171,249.02L430.397,245.242L433.497,240.48L427.624,237.543L425.085,233.586L428.983,228.743L432.867,230.37L433.226,233.976L438.229,234.63L443.232,231.622L443.452,226.647L440.107,222.847L445.817,220.322L447.364,217.28L453.268,214.479L452.987,210.197L455.035,203.297L461.938,203.157L466.305,200.334L469.044,205.177L480.646,208.863L484.853,207.196L488.042,202.629L491.886,205.353L495.946,200.872L502.255,200.168L506.195,198.152L506.432,198.254L513.197,199.808L513.505,203.219L511.525,209.338L507.537,211.311L507.719,216.567L504.183,218.045L504.5,223.948L501.191,226.787L505.181,230.332L504.683,237.349L500.105,246.48L498.971,251.201L494.606,253.038L494.549,258.649L500.032,260.868L502.344,258.649L504.428,262.328L507.51,258.379L505.743,253.721L511.136,249.383L516.857,242.319L520.925,243.899L522.692,247.158L534.521,248.786L534.838,250.793L526.072,258.819L526.994,261.671L531.24,262.231L536.533,267.937L541.826,275.618L536.678,276.136L534.43,278.549L525.129,279.699L513.063,279.298L509.196,284.92L502.669,292.225L501.509,296.345z"
                          />
                          <path
                            onClick={(param) =>
                              this.handleChangeRegion("Rabat-Salé-Kénitra")
                            }
                            id="MA-04"
                            title="Rabat-Salé-Kénitra"
                            d="M447.364,217.28L445.817,220.322L440.107,222.847L443.452,226.647L443.232,231.622L438.229,234.63L433.226,233.976L432.867,230.37L428.983,228.743L425.085,233.586L427.624,237.543L433.497,240.48L430.397,245.242L433.171,249.02L430.676,255.191L430.444,256.075L431.431,258.839L428.675,262.258L428.53,263.21L430.202,269.187L428.609,270.862L413.593,267.792L412.433,262.864L408.734,263.037L405.616,270.383L408.3,274.007L401.772,277.887L398.469,273.72L391.025,272.981L391.042,272.972L391.983,266.841L391.187,262.345L388.666,256.995L388.264,257.063L383.862,258.017L384.106,254.337L380.786,246.845L378.581,245.792L384.137,242.166L391.555,233.934L400.93,217.479L407.3,204.466L411.977,192.597L422.689,193.654L424.616,195.599L431.007,196.757L431.143,203.926L440.184,207.794L444.195,211.412L444.398,214.698z"
                          />
                          <path
                            onClick={(param) =>
                              this.handleChangeRegion("Béni-Mellal-Khénifra")
                            }
                            id="MA-05"
                            title="Béni-Mellal-Khénifra"
                            d="M450.781,288.675L449.91,289.641L448.441,291.188L448.605,300.324L447.245,305.012L444.473,308.605L440.524,308.238L438.878,311.557L441.844,313.987L439.777,318.275L434.61,318.787L433.142,323.519L427.567,324.062L426.317,328.531L429.09,332.805L426.785,336.235L423.45,336.32L421.13,340.564L417.068,343.109L410.38,344.126L405.685,348.786L398.795,350.986L393.977,350.227L392.835,357.574L384.568,358.25L382.069,355.667L378.84,356.813L377.58,354.056L379.798,349.04L375.51,347.169L374.649,344.296L371.227,342.167L373.852,339.292L376.752,340.48L383.278,339.801L384.873,336.065L379.994,327.531L379.802,315.284L379.847,314.338L383.673,305.742L383.922,301.686L381.841,296.748L384.22,285.314L386.532,284.024L387.823,274.898L390.179,273.451L391.025,272.981L398.469,273.72L401.772,277.887L408.3,274.007L405.616,270.383L408.734,263.037L412.433,262.864L413.593,267.792L428.609,270.862L430.202,269.187L428.53,263.21L428.663,262.339L434.465,266.322L440.556,268.979L440.013,272.605L443.928,278.232L448.496,278.102L447.408,283.385L450.291,287.063z"
                          />
                          <path
                            onClick={(param) =>
                              this.handleChangeRegion("Casablanca-Settat")
                            }
                            id="MA-06"
                            title="Casablanca-Settat"
                            d="M378.581,245.792L380.786,246.845L384.106,254.337L383.862,258.017L388.264,257.063L388.666,256.995L391.187,262.345L391.983,266.841L391.042,272.972L390.179,273.451L387.823,274.898L386.532,284.024L384.22,285.314L381.841,296.748L383.922,301.686L383.673,305.742L379.847,314.338L379.825,314.79L372.788,311.808L370.931,308.763L367.758,307.801L361.063,309.147L354.86,299.259L350.354,299.215L346.563,291.857L344.042,293.109L342.918,302.819L337.982,308.285L332.472,310.32L330.98,313.813L325.464,314.868L321.766,305.294L311.613,306.406L307.843,302.983L309.221,298.099L305.02,295.919L315.39,285.831L321.21,278.445L321.336,276.219L325.579,271.675L330.225,270.982L334.002,266.848L340.541,264.741L357.948,256.354L363.535,255.127L374.698,246.96z"
                          />
                          <path
                            onClick={(param) =>
                              this.handleChangeRegion("Marrakech-Safi")
                            }
                            id="MA-07"
                            title="Marrakech-Safi"
                            d="M379.825,314.79L379.802,315.284L379.994,327.531L384.873,336.065L383.278,339.801L376.752,340.48L373.852,339.292L371.227,342.167L374.649,344.296L375.51,347.169L379.798,349.04L377.58,354.056L372.733,359.288L366.7,360.04L357.017,365.255L355.602,365.853L349.027,370.714L345.965,377.862L341.578,374.487L332.641,379.911L324.349,377.801L316.461,380.699L315.575,373.908L308.345,377.659L305.72,380.383L300.747,380.092L299.874,383.061L294.03,380.231L289.806,381.128L287.056,379.866L282.878,382.904L278.8,382.746L279.06,378.522L275.974,375.065L275.138,368.249L276.757,360.729L275.466,354.552L281.042,346.191L282.481,340.97L293.634,327.43L297.243,320.593L297.899,315.165L296.173,311.887L298.396,307.096L296.322,304.087L305.02,295.919L309.221,298.099L307.843,302.983L311.613,306.406L321.766,305.294L325.464,314.868L330.98,313.813L332.472,310.32L337.982,308.285L342.918,302.819L344.042,293.109L346.563,291.857L350.354,299.215L354.86,299.259L361.063,309.147L367.758,307.801L370.931,308.763L372.788,311.808z"
                          />
                          <path
                            onClick={(param) =>
                              this.handleChangeRegion("Drâa-Tafilalet")
                            }
                            id="MA-08"
                            title="Drâa-Tafilalet"
                            d="M497.765,301.387L501.128,304.346L500.222,308.356L505.547,311.562L506.68,319.698L514.66,320.173L522.088,322.895L527.414,322.496L526.167,327.685L528.32,334.86L531.379,336.585L525.506,340.089L526.256,342.012L531.531,341.948L531.586,344.746L522.231,344.683L516.575,350.083L512.877,351.796L509.942,350.137L508.715,354.861L505.161,357.566L505.161,364.235L514.157,373.467L503.961,385.417L502.862,389.543L492.149,391.208L485.495,393.693L480.295,398.858L477.335,398.902L473.029,403.215L463.625,408.957L455.117,416.612L452.888,416.729L447.34,422.537L446.308,425.406L440.706,430.392L437.552,437.922L437.116,441.279L430.481,438.979L429.503,436.118L425.913,438.481L418.19,439.974L413.079,440.036L404.106,436.003L404.837,429.32L402.389,427.14L404.292,424.021L402.661,420.433L407.171,416.491L398.854,406.206L402.502,401.418L400.576,398.673L396.092,398.793L395.251,394.88L387.32,401.024L381.471,402.35L375.649,399.457L373.61,404.813L368.852,408.597L361.822,405.092L359.697,400.189L363.231,390.612L360.785,388.726L360.921,385.107L355.891,384.793L359.969,379.596L355.618,379.28L356.026,372.814L354.53,368.709L356.241,365.583L357.017,365.255L366.7,360.04L372.733,359.288L377.58,354.056L378.84,356.813L382.069,355.667L384.568,358.25L392.835,357.574L393.977,350.227L398.795,350.986L405.685,348.786L410.38,344.126L417.068,343.109L421.13,340.564L423.45,336.32L426.785,336.235L429.09,332.805L426.317,328.531L427.567,324.062L433.142,323.519L434.61,318.787L439.777,318.275L441.844,313.987L438.878,311.557L440.524,308.238L444.473,308.605L447.245,305.012L448.605,300.324L448.441,291.188L449.91,289.641L450.656,288.813L450.738,288.815L452.479,286.43L453.186,285.979L456.503,286.494L459.494,280.04L465.74,279.456L469.103,283.149L468.633,286.308L472.218,289.074L479.359,288.59L486.523,296.195L488.552,302.339L492.856,302.339L495.633,299.827z"
                          />
                          <path
                            onClick={(param) =>
                              this.handleChangeRegion("Souss-Massa")
                            }
                            id="MA-09"
                            title="Souss-Massa"
                            d="M404.106,436.003L401.175,437.828L394.086,438.482L391.941,440.381L386.938,438.922L377.749,437.742L368.371,442.459L360.609,444.112L358.851,446.967L353.498,449.347L346.876,454.799L331.838,465.192L328.831,468.423L319.884,472.823L319.895,489.832L317.971,489.56L309.677,479.253L309.54,475.247L304.782,474.322L304.51,471.083L301.383,469.386L302.878,464.29L297.44,457.949L302.471,456.402L304.238,450.205L301.111,447.26L300.431,443.069L297.848,438.72L292.138,438.098L289.418,441.36L285.883,439.341L282.756,442.292L280.581,439.808L276.23,443.225L273.783,441.205L272.967,435.609L269.432,438.098L267.975,434.039L269.784,431.039L275.529,425.376L280.757,414.649L282.894,408.696L284.429,399.333L280.429,393.078L277.392,390.131L273.35,389.225L276.535,381.081L275.974,375.065L279.06,378.522L278.8,382.746L282.878,382.904L287.056,379.866L289.806,381.128L294.03,380.231L299.874,383.061L300.747,380.092L305.72,380.383L308.345,377.659L315.575,373.908L316.461,380.699L324.349,377.801L332.641,379.911L341.578,374.487L345.965,377.862L349.027,370.714L355.602,365.853L356.241,365.583L354.53,368.709L356.026,372.814L355.618,379.28L359.969,379.596L355.891,384.793L360.921,385.107L360.785,388.726L363.231,390.612L359.697,400.189L361.822,405.092L368.852,408.597L373.61,404.813L375.649,399.457L381.471,402.35L387.32,401.024L395.251,394.88L396.092,398.793L400.576,398.673L402.502,401.418L398.854,406.206L407.171,416.491L402.661,420.433L404.292,424.021L402.389,427.14L404.837,429.32z"
                          />
                          <path
                            onClick={(param) =>
                              this.handleChangeRegion("Guelmim-Oued Noun")
                            }
                            id="MA-10"
                            title="Guelmim-Oued Noun"
                            d="M267.975,434.039L269.432,438.098L272.967,435.609L273.783,441.205L276.23,443.225L280.581,439.808L282.756,442.292L285.883,439.341L289.418,441.36L292.138,438.098L297.848,438.72L300.431,443.069L301.111,447.26L304.238,450.205L302.471,456.402L297.44,457.949L302.878,464.29L301.383,469.386L304.51,471.083L304.782,474.322L309.54,475.247L309.677,479.253L317.971,489.56L319.895,489.832L319.917,517.687L319.687,548.31L308.136,545.751L296.806,526.738L292.274,529.277L285.929,529.786L280.037,527.5L273.239,518.348L267.121,520.893L260.096,513L254.884,511.982L248.993,514.529L246.953,512.746L227.465,513L225.426,515.293L219.081,512.236L211.453,512.178L203.841,500.49L201.509,494.307L213.427,489.022L219.405,480.692L229.299,470.819L243.574,463.309L249.711,459.191L254.208,453.108L259.53,448.162L266.197,438.58z"
                          />
                          <path
                            onClick={(param) =>
                              this.handleChangeRegion("Laâyoune-Sakia El Hamra")
                            }
                            id="MA-11"
                            title="Laâyoune-Sakia El Hamra"
                            d="M201.509,494.307L203.841,500.49L211.453,512.178L219.081,512.236L225.426,515.293L227.465,513L246.953,512.746L248.993,514.529L254.884,511.982L260.096,513L267.121,520.893L273.239,518.348L280.037,527.5L285.929,529.786L292.274,529.277L296.806,526.738L308.136,545.751L319.687,548.31L319.639,588.706L285.783,588.605L192.799,588.664L192.708,639.494L192.823,651.653L185.861,649.866L180.649,650.608L172.038,653.58L157.083,648.628L148.245,649.37L139.181,648.132L131.703,653.58L110.855,648.132L107.683,650.361L101.792,652.343L99.299,650.608L94.54,653.828L91.821,651.847L90.461,647.636L88.195,646.148L83.664,647.141L82.239,643.817L85.117,634.463L85.498,628.193L84.535,622.022L86.767,613.034L90.556,606.564L92.587,598.145L95.148,595.025L97.868,588.765L98.693,580.983L101.391,577.522L107.433,574.364L109.793,570.676L117.613,568.725L129.051,561.312L133.432,557.06L138.839,542.966L139.283,539.241L142.542,533.891L148.489,517.13L152.161,514.891L155.515,508.356L158.012,505.557L167.461,504.377L190.984,499.38z"
                          />
                          <path
                            onClick={(param) =>
                              this.handleChangeRegion("Dakhla-Oued Ed-Dahab")
                            }
                            id="MA-12"
                            title="Dakhla-Oued Ed-Dahab"
                            d="M82.239,643.817L83.664,647.141L88.195,646.148L90.461,647.636L91.821,651.847L94.54,653.828L99.299,650.608L101.792,652.343L107.683,650.361L110.855,648.132L131.703,653.58L139.181,648.132L148.245,649.37L157.083,648.628L172.038,653.58L180.649,650.608L185.861,649.866L192.823,651.653L192.947,694.781L188.127,695.494L179.29,700.158L170.452,701.631L154.363,712.659L149.851,721.183L149.302,724.558L154.787,781.783L108.279,781.313L45.258,781.36L4.778,781.954L2.363,790.975L0,792L1.45,780.603L3.164,772.464L3.164,765.989L9.831,747.878L14.613,742.422L16.337,743.514L21.724,741.25L24.274,733.101L26.866,730.834L27.48,724.838L29.596,717.841L32.411,716.881L35.183,712.128L33.659,709.772L44.135,690.236L50.22,681.435L51.616,676.673L49.572,674.312L56.082,670.386L56.822,668.299L66.282,659.371L72.303,651.907L77.827,649.42L79.212,645.937z"
                          />
                        </g>
                      </svg>
                    </center>
                  </div>{" "}
                  <hr></hr>
                  <h4
                    style={{
                      fontWeight: "900",
                      marginTop: "25px",
                      textAlign: "center",
                    }}
                  >
                    <FormattedMessage id="tout_les_annonces_popup_title"/>!
                  </h4>
                  <a href="https://qrco.de/bcHPx6">
                    <div className="infoCards">
                      <center>
                        {" "}
                        <img
                          style={{ width: "100%" }}
                          src="http://www.anoc.ma/wp-content/uploads/2021/06/6-01.jpg"
                          alt=""
                        />
                      </center>
                    </div>
                  </a>
                  <br />
                  <center>
                    <img
                      style={{ width: "70%" }}
                      src="./Images/my_App.png"
                      alt=""
                    />
                  </center>
                  <div id="rechercher" className="col-lg-12">
                    <div className="sidebar__item">
                      <div className="mobileSearch">
                        {" "}
                        <h6 id="gras" className="latest-product__item">
                          <FormattedMessage id="tout_les_annonces_reference"/>
                        </h6>
                        <div className="row">
                          <div className="col-lg-12 col-md-12">
                          <FormattedMessage id="tout_les_annonces_reference_placeholder">
                          {(placeholder) => (
                            <input
                            id="recherchePlace"
                            type="text"
                            className="form-control"
                            placeholder={placeholder}
                            name="reference"
                            onChange={this.onChange}
                          />
                          )}
                        </FormattedMessage>
                          </div>
                        </div>
                        <br />
                        <h6 id="gras" className="latest-product__item">
                          <FormattedMessage id="home_item_price"/>
                        </h6>
                        <div className="row">
                          <div className="col-lg-12 col-md-12">
                          <FormattedMessage id="tout_les_annonces_min_budget">
                          {(placeholder) => (
                            <input
                              id="recherchePlace"
                              type="text"
                              class="form-control"
                              placeholder={placeholder}
                              name="prix_min"
                              onChange={this.onChange}
                            />
                          )}
                        </FormattedMessage>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-lg-12 col-md-12">
                          <FormattedMessage id="tout_les_annonces_max_budget">
                          {(placeholder) => (
                            <input
                              id="recherchePlace"
                              type="text"
                              class="form-control"
                              placeholder={placeholder}
                              name="prix_max"
                              onChange={this.onChange}
                            />
                          )}
                        </FormattedMessage>
                          </div>
                        </div>
                        <br></br>
                        <h6 id="gras" className="latest-product__item">
                          <FormattedMessage id="tout_les_annonces_poids"/>
                        </h6>
                        <div className="row">
                          <div className="col-lg-12 col-md-12">
                          <FormattedMessage id="tout_les_annonces_poids_min">
                          {(placeholder) => (
                            <input
                              id="recherchePlace"
                              type="text"
                              class="form-control"
                              placeholder={placeholder}
                              name="poids_min"
                              onChange={this.onChange}
                            />
                          )}
                        </FormattedMessage>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-lg-12 col-md-12">
                          <FormattedMessage id="tout_les_annonces_poids_max">
                          {(placeholder) => (
                            <input
                              id="recherchePlace"
                              type="text"
                              class="form-control"
                              placeholder={placeholder}
                              name="poids_max"
                              onChange={this.onChange}
                            />
                          )}
                        </FormattedMessage>
                          </div>
                        </div>
                        <br></br>
                        <h6 id="gras" className="latest-product__item">
                          <FormattedMessage id="tout_les_annonces_ville"/>
                        </h6>
                        <div className="row">
                          <div className="col-lg-12 col-md-12">
                          <FormattedMessage id="tout_les_annonces_ville">
                          {(placeholder) => (
                            <Select
                              value={selectedOptionVille}
                              onChange={this.handleChangeVille}
                              options={optionsVille}
                              placeholder={placeholder}
                            />
                          )}
                        </FormattedMessage>
                            <br></br>
                            <br></br>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-lg-12 col-md-12">
                            {/* <button className="btn btn-success" onClick={this.handelChercher}> Rechercher </button><br/> */}
                            <button
                              id="roundB"
                              className="newBtn site-btn"
                              onClick={this.handelChercher}
                            >
                              <i className="fa fa-search "></i> <FormattedMessage id="tout_les_annonces_rechrcher"/>{" "}
                            </button>
                            <br></br>
                            <br></br>
                            <button
                              id="roundB"
                              className="newBtn site-btn"
                              onClick={this.handelReinitialiser}
                            >
                              <i className="fa fa-refresh"></i> <FormattedMessage id="tout_les_annonces_reinilialiser"/>{" "}
                            </button>
                            <br></br>
                            <br></br>
                          </div>
                        </div>
                      </div>
                      {/* <label className="latest-product__item">
                      <input name="withImages" type="checkbox" /> Avec photos
                    </label> */}
                      {/* <label className="latest-product__item">
                      <input name="withVideos" type="checkbox" /> Avec video
                    </label> */}
                    </div>
                  </div>
                </div>
                <div className="col-lg-9 col-md-7">
                  <div className="filter__item">
                    <div>
                      <div id="filterPlace" className="col-lg-5 col-md-8 fa ">
                      <FormattedMessage
                        id="tout_les_annonces_trier"
                      >
                        {(placeholder) => (
                          <Select
                          id="filterPlace"
                          value={this.state.selectedOptionSort}
                          onChange={this.sortData}
                          options={optionsSort}
                          placeholder={
                            this.state.selectedOptionSort
                              ? this.state.selectedOptionSort
                              : placeholder
                          }
                        />
                        )}
                      </FormattedMessage>
                      </div>
                    </div>

                    <br></br>
                    <div className="row">
                      <div className="col-lg-12 col-md-12">
                        <div className="filter__found text-left">
                          <h4>
                            <span id="nbEspece">
                              {" "}
                              {this.state.Annonces.length}
                            </span>{" "}
                            <FormattedMessage id="tout_les_annonces_disponible"/>{" "}
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/*<!-- Sheeps Grid Section Begin --> */}
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
                        {this.state.Annonces.length === 0 ? (
                          <div className="text-center my-5">
                            <p style={{ color: "#fba502" }}>
                              <i
                                className="fa fa-frown-o fa-5x"
                                aria-hidden="true"
                              ></i>
                            </p>

                            <h3 style={{ color: "#28a745" }}>
                              <FormattedMessage id="tout_les_annonces_pas_disponible"/>
                            </h3>
                          </div>
                        ) : (
                          <div className="row">
                            {currentAnnonces.map((Annonces) => (
                              <div
                                className="col-lg-4 col-md-6 col-sm-6"
                                key={Annonces.$oid}
                              >
                                <Link
                                  to={`/DetailsMouton/${Annonces._id.$oid}`}
                                  style={{ textDecoration: "none" }}
                                >
                                  <div id="anonce" className="product__item">
                                    <img
                                      src={Annonces.image_face}
                                      alt="item"
                                      style={{
                                        width: "355px",
                                        height: "170px",
                                        borderTopRightRadius: "14%",
                                        borderTopLeftRadius: "14%",
                                        objectFit: "contain",
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
                                      <span className="badge pt-3 w-100  mt-1  ">
                                        {"  "}
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
                                        ></i>{" "}
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
                                          <span style={localStorage.getItem('lg')=="ar"?{ float: "left"}:{float:"right"}} >
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
                                            {/* {Annonces.poids + " Kg"} */}
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

                                            {/* {Annonces.age + " mois"} */}
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
                                          {/* <FaDollarSign
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
                                  </div>
                                </Link>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="center-div">
                          <Pagination
                            activePage={this.state.currentPage}
                            itemsCountPerPage={9}
                            totalItemsCount={this.state.Annonces.length}
                            pageRangeDisplayed={7}
                            onChange={this.paginate.bind(this)}
                            itemClass="page-item"
                            linkClass="page-link"
                          />
                        </div>
                      </div>
                    )}
                    {/* <!-- Sheeps Grid Section End --> */}
                  </div>
                  {/*-------------------------------------------------*/}
                  <hr width="30%" />
                  <div className="kc-row-container  kc-container">
                    <div className="kc-wrap-columns">
                      <div className="kc-elm kc-css-856498 kc_col-sm-12 kc_column kc_col-sm-12">
                        <div className="kc-col-container">
                          <div className="af-title text-center">
                            <h3 className="af-heading"><FormattedMessage id="tout_les_annonces_comment_ca_marche"/></h3>
                            <p>
                              <FormattedMessage id="tout_les_annonces_comment_ca_marche_message"/>
                            </p>
                          </div>
                          <div
                            className="kc-elm kc-css-237067"
                            style={{
                              height: "15px",
                              clear: "both",
                              width: "100%",
                            }}
                          ></div>
                          <div
                            className="hiw-wrapper hiw-wrapper-4  flex-start-v"
                            style={localStorage.getItem('lg')=="ar"?{
                              display: "inline-flex",
                              flexWrap: "nowrap",
                              textAlign:"right"
                            }:{
                              display: "inline-flex",
                              flexWrap: "nowrap",
                            }}
                          >
                            <div className="hiw-item service hiw-1627300637">
                              <div
                                className="service-icon animation"
                                style={{
                                  background: "#10A745",
                                  color: "#ffffff",
                                  fontWeight: "bold",
                                }}
                              >
                                1{" "}
                              </div>
                              <div className="service-content">
                                <h5><FormattedMessage id="tout_les_annonces_comment_ca_marche_1_title"/></h5>
                                <p>
                                  <FormattedMessage id="tout_les_annonces_comment_ca_marche_1_message"/>
                                </p>
                              </div>
                            </div>
                            <div className="hiw-item service hiw-1627300637">
                              <div
                                className="service-icon animation"
                                style={{
                                  background: "#10A745",
                                  color: "#ffffff",
                                  fontWeight: "bold",
                                }}
                              >
                                2{" "}
                              </div>
                              <div className="service-content">
                                <h5><FormattedMessage id="tout_les_annonces_comment_ca_marche_2_title"/></h5>
                                <p>
                                  <FormattedMessage id="tout_les_annonces_comment_ca_marche_2_message"/>
                                </p>
                              </div>
                            </div>
                            <div className="hiw-item service hiw-1627300637">
                              <div
                                className="service-icon animation"
                                style={{
                                  background: "#10A745",
                                  color: "#ffffff",
                                  fontWeight: "bold",
                                }}
                              >
                                3{" "}
                              </div>
                              <div className="service-content">
                                <h5><FormattedMessage id="tout_les_annonces_comment_ca_marche_3_title"/></h5>
                                <p>
                                  <FormattedMessage id="tout_les_annonces_comment_ca_marche_3_message"/>
                                </p>
                              </div>
                            </div>
                            <div className="hiw-item service hiw-1627300637">
                              <div
                                className="service-icon animation"
                                style={{
                                  background: "#10A745",
                                  color: "#ffffff",
                                  fontWeight: "bold",
                                }}
                              >
                                4{" "}
                              </div>
                              <div className="service-content">
                                <h5><FormattedMessage id="tout_les_annonces_comment_ca_marche_4_title"/></h5>
                                <p><FormattedMessage id="tout_les_annonces_comment_ca_marche_4_message"/></p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/*-------------------------------------------------*/}{" "}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }
}
/*
     <nav className="row">
                            <ul className="pagination center-div">
                              {this.state.nombrePages.map((number) => (
                                <li
                                  key={number}
                                  className="page-item stylePagination"
                                >
                                  <a
                                    onClick={() => this.paginate(number)}
                                    className="page-link"
                                  >
                                    {number}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </nav>
*/
export default HomeSheeps;
