import React, { Component } from "react";
import axios from "axios";
import { GiWeight } from "react-icons/gi";
import Swal from "sweetalert2";
import { CgFileAdd } from "react-icons/cg";
import Loader from "react-loader-spinner";
import Select from "react-select";
import { FaShapes } from "react-icons/fa";
import { MdCake } from "react-icons/md";
import { HiOutlineBadgeCheck } from "react-icons/hi";
import { FaDollarSign } from "react-icons/fa";

import Pagination from "react-js-pagination";
import { Link } from "react-router-dom";

require("bootstrap-less/bootstrap/bootstrap.less");

class Commandes extends Component {
  constructor() {
    super();
    // let redirect = false;
    this.state = {
      Commandes: [],
      CommandesT: [],
      CommandesN: [],
      CommandesR: [],
      nbrEspece: [],
      activePage: 1,
      nombrePages: [],
      currentPage: 1,
      annoncesPerPage: 12,
      loading: true,
      redirect: false,
      selectedOptionSort: null,
      optionsSort: [],
      selectedOptionSort1: null,
      optionsSort1: [
        { value: "", label: "Option de filtrage" },

        {
          value: "delai_avance",
          label: "Delai de paiement depasse de l'avance",
        },
        { value: "delai_reste", label: "Delai de paiement depasse du reste " },

        {
          value: "Reçu de l’avance non conforme",
          label: "Reçu non conforme de l'avance",
        },
        {
          value: "Reçu du reste non conforme",
          label: "Reçu non conforme du reste",
        },

        {
          value: "Montant de l’avance non reçu",
          label: "Montant non reçu de l'avance",
        },
        {
          value: "Montant du reste non reçu",
          label: "Montant non reçu du reste",
        },
        /**/
        {
          value: "en attente de paiement cash",
          label: "en attente de paiement cash",
        },
        {
          value: "paiement cash effectué",
          label: "paiement cash effectué",
        },
        /**/
        {
          value: "Annulation",
          label: "Annulation(s) effectuee(s) par moi-meme avant la livraison",
        },
        {
          value: "rejet",
          label: "Annulation(s) effectuee(s) Rejet a la livraison ",
        },
      ],
      selectedOptionSort2: null,
      optionsSort2: [
        { value: "", label: "Option de filtrage" },
        { value: "avance", label: "Avance moins cher au plus cher" },
        { value: "avance_dec", label: "Avance plus cher au moins cher" },

        { value: "deadline", label: "Delai de paiement Plus proche" },
        { value: "deadline_dec", label: "Delai de paiement plus lointaine" },
      ],
      selectedOptionSort3: null,
      optionsSort3: [
        { value: "", label: "Option de filtrage" },
        { value: "reste", label: "Reste moins cher au plus cher" },
        { value: "reste_dec", label: "Reste plus cher au moins cher" },

        { value: "deadline", label: "Delai de paiement Plus proche" },
        { value: "deadline_dec", label: "Delai de paiement plus lointaine" },
      ],
      selectedOptionSort4: null,
      optionsSort4: [
        { value: "", label: "Option de filtrage" },
        { value: "prix_total", label: "Prix Moins cher au plus cher" },
        { value: "prix_total_dec", label: "Prix Plus cher au moins cher" },

        {
          value: "en attente de validation reste",
          label: "Commande(s) en cours de validation",
        },
        { value: "validé", label: "Commande(s) validee(s)" },
      ],
    };
    this.paginate = this.paginate.bind(this);
    this.local = this.local.bind(this);

    this.sortData = this.sortData.bind(this);
  }
  local(annonce) {
    window.sessionStorage.setItem("ids", []);
    window.sessionStorage.setItem("reponses", []);
    window.sessionStorage.setItem(
      "prix_total",
      JSON.stringify(annonce.prix_total)
    );
    window.sessionStorage.setItem(
      "reste",
      JSON.stringify(annonce.prix_total - annonce.avance)
    );
    window.sessionStorage.setItem("avance", JSON.stringify(annonce.avance));
    window.sessionStorage.setItem(
      "complement",
      JSON.stringify(annonce.complement)
        ? JSON.stringify(annonce.complement)
        : 0
    );
  }

  sortData(e) {
    const sortProperty = Object.values(e)[0];
    const sorted = this.state.CommandesN;
    let sortCmd = sorted;
    this.setState({
      selectedOptionSort: Object.values(e)[1],
    });
    if (
      sortProperty === "Reçu de l’avance non conforme" ||
      sortProperty === "Reçu du reste non conforme" ||
      sortProperty === "Montant de l’avance non reçu" ||
      sortProperty === "Montant du reste non reçu"
    ) {
      this.setState({ loading: true }, () => {
        sortCmd = sorted.filter(
          (c) =>
            c.msg_refus_avance === sortProperty ||
            c.msg_refus_reste === sortProperty
        );
        this.setState({
          Commandes: sortCmd,
          loading: false,
        });
      });
    } else if (sortProperty === "validé") {
      this.setState({ loading: true }, () => {
        sortCmd = sorted.filter((c) => c.statut === sortProperty);
        this.setState({
          Commandes: sortCmd,
          loading: false,
        });
      });
    } else if (sortProperty === "en attente de validation reste") {
      this.setState({ loading: true }, () => {
        sortCmd = sorted.filter(
          (c) =>
            c.statut === "en attente de validation reste" ||
            c.statut === "en attente de validation complément"
        );
        this.setState({
          Commandes: sortCmd,
          loading: false,
        });
      });
    } else if (
      sortProperty === "avance" ||
      sortProperty === "reste" ||
      sortProperty === "prix_total"
    ) {
      this.setState({ loading: true }, () => {
        sorted.sort((a, b) => a[sortProperty] - b[sortProperty]);
        this.setState({
          Commandes: sorted,
          loading: false,
        });
      });
    } else if (
      sortProperty === "avance_dec" ||
      sortProperty === "reste_dec" ||
      sortProperty === "prix_total_dec"
    ) {
      const sort_ = sortProperty.substr(0, sortProperty.length - 4);
      this.setState({ loading: true }, () => {
        sorted.sort((a, b) => b[sort_] - a[sort_]);
        this.setState({ Commandes: sorted, loading: false });
      });
    } else if (sortProperty === "deadline") {
      this.setState({ loading: true }, () => {
        sorted.sort(function (a, b) {
          return (
            new Date(
              a[sortProperty].substr(6, 4),
              a[sortProperty].substr(3, 2),
              a[sortProperty].substr(0, 2),
              a[sortProperty].substr(12, 2),
              a[sortProperty].substr(15, 2),
              a[sortProperty].substr(18, 2)
            ) -
            new Date(
              b[sortProperty].substr(6, 4),
              b[sortProperty].substr(3, 2),
              b[sortProperty].substr(0, 2),
              b[sortProperty].substr(12, 2),
              b[sortProperty].substr(15, 2),
              b[sortProperty].substr(18, 2)
            )
          );
        });
        this.setState({ Commandes: sorted, loading: false });
      });
    } else if (sortProperty === "deadline_dec") {
      const sort_ = "deadline";
      this.setState({ loading: true }, () => {
        sorted.sort(function (a, b) {
          return (
            new Date(
              b[sort_].substr(6, 4),
              b[sort_].substr(3, 2),
              b[sort_].substr(0, 2),
              b[sort_].substr(12, 2),
              b[sort_].substr(15, 2),
              b[sort_].substr(18, 2)
            ) -
            new Date(
              a[sort_].substr(6, 4),
              a[sort_].substr(3, 2),
              a[sort_].substr(0, 2),
              a[sort_].substr(12, 2),
              a[sort_].substr(15, 2),
              a[sort_].substr(18, 2)
            )
          );
        });
        this.setState({ Commandes: sorted, loading: false });
      });
    } else if (sortProperty === "rejet") {
      this.setState({ loading: true }, () => {
        this.setState({
          Commandes: this.state.CommandesR,
          loading: false,
        });
      });
    } else if (sortProperty === "Annulation") {
      this.setState({ loading: true }, () => {
        sortCmd = sorted.filter((c) => c.statut === "annulée manuellement");
        this.setState({
          Commandes: sortCmd,
          loading: false,
        });
      });
    } else if (sortProperty === "delai_reste") {
      this.setState({ loading: true }, () => {
        sortCmd = sorted.filter(
          (c) =>
            c.reçu_montant_restant === null &&
            c.reçu_avance !== null &&
            c.statut === "commande annulée (deadline dépassé)"
        );
        this.setState({
          Commandes: sortCmd,
          loading: false,
        });
      });
    } else if (sortProperty === "delai_avance") {
      this.setState({ loading: true }, () => {
        sortCmd = sorted.filter(
          (c) =>
            c.reçu_avance === null &&
            c.statut === "commande annulée (deadline dépassé)"
        );
        this.setState({
          Commandes: sortCmd,
          loading: false,
        });
      });
    } else {
      this.setState({ loading: true }, () => {
        this.setState({
          Commandes: sorted,
          loading: false,
        });
      });
    }
  }

  paginate(pageNumber) {
    this.setState({ currentPage: pageNumber });
  }

  componentDidMount() {
    if (
      window.sessionStorage.getItem("ids") &&
      window.sessionStorage.getItem("ids").length > 0
    ) {
      Swal.fire({
        title: "Changement annuler ",
        icon: "error",
        width: 400,
        heightAuto: false,
        timer: 1500,
        showConfirmButton: false,
      });
      window.sessionStorage.setItem("ids", []);
    }
    const token = localStorage.getItem("usertoken");
    const statut = this.props.location.state.id;
    console.log(statut);
    let statuts = statut.split("#");
    const pageNumbers = [];
    if (this.props.location.state.id.split("#").includes("avarié")) {
      this.setState({
        optionsSort: this.state.optionsSort1,
        selectedOptionSort: this.state.selectedOptionSort1,
      });
    } else if (
      this.props.location.state.id
        .split("#")
        .includes("en attente de paiement avance") ||
      this.props.location.state.id
        .split("#")
        .includes("en attente de validation avance")
    ) {
      this.setState({
        optionsSort: this.state.optionsSort2,
        selectedOptionSort: this.state.selectedOptionSort2,
      });
    } else if (
      this.props.location.state.id
        .split("#")
        .includes("en attente de paiement du reste")
    ) {
      this.setState({
        optionsSort: this.state.optionsSort3,
        selectedOptionSort: this.state.selectedOptionSort3,
      });
    } else if (
      this.props.location.state.id
        .split("#")
        .includes("validé" || "en attente de validation reste")
    ) {
      this.setState({
        optionsSort: this.state.optionsSort4,
        selectedOptionSort: this.state.selectedOptionSort4,
      });
    } else if (
      this.props.location.state.id
        .split("#")
        .includes("en attente de paiement cash")
    ) {
      this.setState({
        optionsSort: this.state.optionsSort4,
        selectedOptionSort: this.state.selectedOptionSort4,
      });
    }

    const myToken = `Bearer ` + localStorage.getItem("myToken");
    this.setState({ loading: true }, () => {
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
        appendLeadingZeroes(current_datetime.getHours()) +
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
        axios
          .get("http://127.0.0.1:8000/api/commande", {
            headers: {
              // "x-access-token": token, // the token is a variable which holds the token
              "Content-Type": "application/json",
              Authorization: myToken,
            },
            params: {
              id_consommateur: token,
              order_by: "date_creation",
              order_mode: "asc",
            },
          })
          .then((res) => {
            this.setState({ CommandesT: res.data }, () => {
              switch (this.props.location.state.id) {
                case "en attente de paiement avance":
                  this.setState(
                    {
                      Commandes: [
                        ...new Set(
                          this.state.CommandesT.filter(
                            (Commandes) =>
                              Commandes.statut ===
                                "en attente de paiement avance" ||
                              (Commandes.statut === "avarié_changement" &&
                                Commandes.ancien_statut ===
                                  "en attente de paiement avance")
                          )
                        ),
                      ],
                    },
                    () => {
                      for (
                        let i = 1;
                        i <=
                        Math.ceil(
                          this.state.Commandes.length /
                            this.state.annoncesPerPage
                        );
                        i++
                      ) {
                        pageNumbers.push(i);
                      }
                      this.setState(
                        {
                          nombrePages: pageNumbers,
                          CommandesN: this.state.Commandes,
                          loading: false,
                        },
                        () => {}
                      );
                    }
                  );

                  break;
                case "en attente de validation avance":
                  this.setState(
                    {
                      Commandes: [
                        ...new Set(
                          this.state.CommandesT.filter(
                            (Commandes) =>
                              statuts.includes(Commandes.statut) === true
                          )
                        ),
                      ],
                    },
                    () => {
                      for (
                        let i = 1;
                        i <=
                        Math.ceil(
                          this.state.Commandes.length /
                            this.state.annoncesPerPage
                        );
                        i++
                      ) {
                        pageNumbers.push(i);
                      }
                      this.setState(
                        {
                          nombrePages: pageNumbers,
                          CommandesN: this.state.Commandes,
                          loading: false,
                        },
                        () => {}
                      );
                    }
                  );

                  break;
                case "en attente de paiement du reste":
                  this.setState(
                    {
                      Commandes: [
                        ...new Set(
                          this.state.CommandesT.filter(
                            (Commandes) =>
                              Commandes.statut ===
                                "en attente de paiement du reste" ||
                              (Commandes.statut === "avarié_changement" &&
                                Commandes.ancien_statut ===
                                  "en attente de paiement du reste")
                          )
                        ),
                      ],
                    },
                    () => {
                      for (
                        let i = 1;
                        i <=
                        Math.ceil(
                          this.state.Commandes.length /
                            this.state.annoncesPerPage
                        );
                        i++
                      ) {
                        pageNumbers.push(i);
                      }
                      this.setState(
                        {
                          nombrePages: pageNumbers,
                          CommandesN: this.state.Commandes,
                          loading: false,
                        },
                        () => {}
                      );
                    }
                  );

                  break;
                case "validé#en attente de validation reste#en attente de validation du complément":
                  this.setState(
                    {
                      Commandes: [
                        ...new Set(
                          this.state.CommandesT.filter(
                            (Commandes) =>
                              statuts.includes(Commandes.statut) === true ||
                              Commandes.statut ===
                                "en attente de validation complément" ||
                              (Commandes.statut === "avarié_changement" &&
                                Commandes.ancien_statut === "validé")
                          )
                        ),
                      ],
                    },
                    () => {
                      for (
                        let i = 1;
                        i <=
                        Math.ceil(
                          this.state.Commandes.length /
                            this.state.annoncesPerPage
                        );
                        i++
                      ) {
                        pageNumbers.push(i);
                      }
                      this.setState(
                        {
                          nombrePages: pageNumbers,
                          CommandesN: this.state.Commandes,
                          loading: false,
                        },
                        () => {}
                      );
                    }
                  );

                  break;
                case "en attente de paiement du complément":
                  this.setState(
                    {
                      Commandes: [
                        ...new Set(
                          this.state.CommandesT.filter(
                            (Commandes) =>
                              statuts.includes(Commandes.statut) === true ||
                              Commandes.statut ===
                                "en attente de paiement du complement"
                          )
                        ),
                      ],
                    },
                    () => {
                      for (
                        let i = 1;
                        i <=
                        Math.ceil(
                          this.state.Commandes.length /
                            this.state.annoncesPerPage
                        );
                        i++
                      ) {
                        pageNumbers.push(i);
                      }
                      this.setState(
                        {
                          nombrePages: pageNumbers,
                          CommandesN: this.state.Commandes,
                          loading: false,
                        },
                        () => {}
                      );
                    }
                  );

                  break;
                case "commande annulée (deadline dépassé)#reçu avance refusé#reçu reste refusé#reçu complément refusé#avarié#rejetée#annulée manuellement#remboursement#avarié_changement#avarié_remboursement#avarié_annulé":
                  this.setState(
                    {
                      Commandes: [
                        ...new Set(
                          this.state.CommandesT.filter(
                            (Commandes) =>
                              Commandes.statut ===
                                "commande annulée (deadline dépassé)" ||
                              Commandes.statut === "reçu avance refusé" ||
                              Commandes.statut === "reçu reste refusé" ||
                              Commandes.statut === "annulée manuellement" ||
                              Commandes.statut === "avarié" ||
                              Commandes.statut === "avarié_remboursement" ||
                              Commandes.statut === "avarié_annulée" ||
                              Commandes.statut === "rejetée"
                          )
                        ),
                      ],
                    },
                    () => {
                      for (
                        let i = 1;
                        i <=
                        Math.ceil(
                          this.state.Commandes.length /
                            this.state.annoncesPerPage
                        );
                        i++
                      ) {
                        pageNumbers.push(i);
                      }
                      this.setState(
                        {
                          nombrePages: pageNumbers,
                          CommandesN: this.state.Commandes,
                          loading: false,
                        },
                        () => {}
                      );
                    }
                  );
                  break;
                case "en attente de paiement cash":
                  this.setState(
                    {
                      Commandes: [
                        ...new Set(
                          this.state.CommandesT.filter(
                            (Commandes) =>
                              statuts.includes(Commandes.statut) === true
                          )
                        ),
                      ],
                    },
                    () => {
                      for (
                        let i = 1;
                        i <=
                        Math.ceil(
                          this.state.Commandes.length /
                            this.state.annoncesPerPage
                        );
                        i++
                      ) {
                        pageNumbers.push(i);
                      }
                      this.setState(
                        {
                          nombrePages: pageNumbers,
                          CommandesN: this.state.Commandes,
                          loading: false,
                        },
                        () => {}
                      );
                    }
                  );

                  break;
                case "paiement cash effectué":
                  this.setState(
                    {
                      Commandes: [
                        ...new Set(
                          this.state.CommandesT.filter(
                            (Commandes) =>
                              statuts.includes(Commandes.statut) === true
                          )
                        ),
                      ],
                    },
                    () => {
                      for (
                        let i = 1;
                        i <=
                        Math.ceil(
                          this.state.Commandes.length /
                            this.state.annoncesPerPage
                        );
                        i++
                      ) {
                        pageNumbers.push(i);
                      }
                      this.setState(
                        {
                          nombrePages: pageNumbers,
                          CommandesN: this.state.Commandes,
                          loading: false,
                        },
                        () => {}
                      );
                    }
                  );

                  break;
              }
            });
          });
      }
    });
  }
  handelDelete(c) {
    const myToken = `Bearer ` + localStorage.getItem("myToken");
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Etes-vous sûr?",
        text: "Voulez-vous annuler votre commande!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "  Oui!  ",
        cancelButtonText: "  Non!  ",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          axios
            .put(
              "http://127.0.0.1:8000/api/commande/" + c._id,
              {
                ancien_statut: c.statut,
                statut: "annulée manuellement",
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: myToken,
                },
              }
            )
            .then((res) => {
              c.espece.map((e) => {
                if (e.statut === "réservé") {
                  axios.put(
                    "http://127.0.0.1:8000/api/Espece/" + e._id,
                    {
                      statut: "disponible",
                    },
                    {
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: myToken,
                      },
                    }
                  );
                } else if (e.statut === "produit avarié") {
                  c.especes
                    .filter((esp) => esp.id_espece === e._id)[0]
                    .produits_changement.map((chang) => {
                      axios.put(
                        "http://127.0.0.1:8000/api/Espece/" + chang.id_espece,
                        {
                          statut: "disponible",
                        },
                        {
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: myToken,
                          },
                        }
                      );
                    });
                }
              });

              if (
                !this.props.location.state.id
                  .split("#")
                  .includes("annulée manuellement")
              ) {
                this.setState({
                  Commandes: this.state.Commandes.filter((cmd) => cmd !== c),
                });
              } else {
                this.state.Commandes.filter((cmd) => cmd === c)[0].statut =
                  "annulée manuellement";
                this.setState({
                  redirect: true,
                  Commandes: this.state.Commandes,
                });
              }

              swalWithBootstrapButtons.fire(
                "Annulation !",
                "Votre commande a bien été annulée",
                "success"
              );
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulation",
            "Commande non annulée !",
            "error"
          );
        }
      });
  }
  //nombre espece  pour chaque commande
  NbrEspece(e, c) {
    let nombre = 0;
    nombre = e.espece.filter((e) => e.espece === c).length;
    return nombre;
  }
  NbrEspeceMax() {
    function uniq(arr) {
      return arr.reduce(
        function (p, c) {
          var id = [c.espece, c.nbr].join("|");
          if (p.temp.indexOf(id) === -1) {
            p.out.push(c);
            p.temp.push(id);
          }
          return p;
        },
        { temp: [], out: [] }
      ).out;
    }
    let nbr = [];
    let max = 0;
    this.state.Commandes.map((e, i) => {
      nbr[i] = [];
      e.espece.map((c) => {
        nbr[i].push({ espece: c.espece, nbr: this.NbrEspece(e, c.espece) });
      });
      max = max > uniq(nbr[i]).length ? max : uniq(nbr[i]).length;
    });
    return max;
  }
  //image selon les catégories des especes dans chaque commande
  ImageEspece(e) {
    //une seule catégorie
    let image = e.espece[0].image_face;
    //mouton+vache+chevre
    if (this.NbrEspece(e, "mouton") > 1 && this.NbrEspece(e, "chevre") === 0) {
      image = "/Images/commandemouton.jpg";
    }
    //vache+chevre
    else if (
      this.NbrEspece(e, "mouton") === 0 &&
      this.NbrEspece(e, "chevre") > 1
    ) {
      image = "/Images/commandechevre.jpg";
    }
    //mouton+chevre
    else if (
      this.NbrEspece(e, "mouton") > 1 &&
      this.NbrEspece(e, "chevre") > 1
    ) {
      image = "/Images/commandemulti.jpg";
    }
    return image;
  }
  //max poids max age
  Max(c, p) {
    let max = 0;
    let m = 0;
    p === "poids"
      ? c.espece.map((e) => {
          m = e.poids;
          max = max < m ? m : max;
        })
      : c.espece.map((e) => {
          m = e.age;
          max = max < m ? m : max;
        });
    return max;
  }
  //min poids max age
  Min(c, p) {
    let min = Number.MAX_VALUE;
    let m = 0;
    p === "poids"
      ? c.espece.map((e) => {
          m = e.poids;
          min = min > m ? m : min;
        })
      : c.espece.map((e) => {
          m = e.age;
          min = min > m ? m : min;
        });

    return min;
  }

  render() {
    let titre = "";
    let message = null;

    switch (this.props.location.state.id) {
      case "commande annulée (deadline dépassé)#reçu avance refusé#reçu reste refusé#reçu complément refusé#avarié#rejetée#annulée manuellement#remboursement#avarié_changement#avarié_remboursement#avarié_annulé":
        titre = "annulées";
        message =
          "Liste des commandes annulées pour des raisons de non-conformité aux conditions générales de vente (délai de paiement dépassé, reçu non conforme, montant non reçu), ou bien suite à votre souhait d'annulation directe. Chacune de vos commandes sera conservée, à titre informatif, pendant 5 jours à la suite du processus d'annulation. Passé ce délai, elle sera définitivement supprimée de cette liste. Il vous est aussi possible de les supprimer avant.";
        break;
      case "en attente de paiement avance":
        titre = "Avance à payer ";
        break;
      case "en attente de validation avance":
        titre = "Produit(s) réservé(s) ";
        message =
          'Liste des commandes dont les ordres de virement des avances sont en phase de validation. Elles seront affectées à la rubrique "Reste à payer" suite à leur validation. ';

        break;
      case "en attente de paiement du reste":
        titre = "Reste à payer ";
        break;
      case "validé#en attente de validation reste#en attente de validation du complément":
        titre = "Prêt à livrer";
        message =
          "Liste des commandes dont les ordres de virement des restes à payer sont en phase de validation. Vous serez contactés pour la livraison suite à leur validation. ";
        break;
      case "en attente de paiement du complément":
        titre = "Complément à payer ";
        break;
      case "en attente de paiement cash":
        titre = "Totale à payer ";
        break;
      case "paiement cash effectué":
        titre = "Prêt";
        break;
    }

    const { loading } = this.state;
    const { optionsSort } = this.state;
    let AnnonceAll = [];
    let AnnonceA = [];
    this.state.Commandes.map((m) => {
      if (m.statut === "avarié") {
        AnnonceAll.push(m);
      } else {
        AnnonceA.push(m);
      }
    });

    const indexOfLastAnnonce =
      this.state.currentPage * this.state.annoncesPerPage;
    const indexOfFirstAnnonce = indexOfLastAnnonce - this.state.annoncesPerPage;
    const currentAnnonces = AnnonceAll.concat(AnnonceA).slice(
      indexOfFirstAnnonce,
      indexOfLastAnnonce
    );
    return (
      <div>
        <section className="">
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
              <Loader type="Oval" color="#7fad39" height="80" width="80" />
            </div>
          ) : (
            <div className="container">
              <style>{`.message   {display: none } .ico:hover ~.message   {display: block;color:#fe6927 } `}</style>

              <style>{`#gras{color :black} `}</style>
              <br></br>
              <br></br>

              <br></br>

              <h4 className="latest-product__item"> Mes commandes </h4>
              <br></br>
              <br></br>
              <div>
                <h5
                  style={
                    message !== null
                      ? { cursor: "pointer", maxWidth: "max-content" }
                      : { maxWidth: "max-content" }
                  }
                  className="text-primary ico"
                >
                  {message !== null ? (
                    <i
                      className="fa fa-exclamation-circle fa-sm "
                      aria-hidden="true"
                    ></i>
                  ) : null}
                  {" " + titre} : <span> {this.state.Commandes.length}</span>{" "}
                </h5>
                {message !== null ? (
                  <p className="message  ">{message}</p>
                ) : null}
              </div>
              <div>
                {currentAnnonces.length !== 0 ? (
                  <>
                    {" "}
                    <div
                      id="filterPlace"
                      className="col-lg-5 col-md-5 fa mt-4 "
                    >
                      <Select
                        id="filterPlace"
                        value={this.state.selectedOptionSort}
                        onChange={this.sortData}
                        options={optionsSort}
                        placeholder={
                          this.state.selectedOptionSort
                            ? this.state.selectedOptionSort
                            : "Trier par"
                        }
                      />
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </div>
              <br></br>

              <div className="row">
                <div className="col-lg-12 col-md-7">
                  <div className="row">
                    {currentAnnonces.map((Annonces) => (
                      <div className="col-lg-3 col-md-6 col-sm-6">
                        {Annonces ? (
                          <>
                            <div id="anonce" className="product__item">
                              <div
                                className="product__item__pic set-bg"
                                style={{ height: "170px" }}
                              >
                                <centre>
                                  {Annonces.especes.length === 1 ? (
                                    <>
                                      {" "}
                                      <img
                                        alt="ImageEspece"
                                        style={{
                                          width: "355px",
                                          height: "170px",
                                          borderTopRightRadius: "10%",
                                          borderTopLeftRadius: "10%",
                                          objectFit: "contain",
                                        }}
                                        src={Annonces.espece[0].image_face}
                                      />
                                    </>
                                  ) : (
                                    <>
                                      {" "}
                                      <img
                                        alt="ImageEspece2"
                                        style={{
                                          width: "355px",
                                          height: "170px",
                                          borderTopRightRadius: "10%",
                                          borderTopLeftRadius: "10%",
                                          objectFit: "contain",
                                        }}
                                        src={this.ImageEspece(Annonces)}
                                      />
                                    </>
                                  )}
                                </centre>

                                <ul className="product__item__pic__hover">
                                  {Annonces.isDelivered === true ? (
                                    <li>
                                      <Link
                                        to={{
                                          pathname: "/ConfirmeCommande",
                                          state: {
                                            id: Annonces,
                                          },
                                        }}
                                        type="submit"
                                      >
                                        {" "}
                                        <a
                                          onClick={this.local.bind(
                                            this,
                                            Annonces
                                          )}
                                        >
                                          {Annonces.statut ===
                                            "en attente de paiement avance" ||
                                          Annonces.statut ===
                                            "en attente de paiement du reste" ||
                                          Annonces.statut ===
                                            "en attente de paiement du complément" ||
                                          Annonces.statut ===
                                            "reçu avance refusé" ||
                                          Annonces.statut ===
                                            "reçu reste refusé" ? (
                                            <CgFileAdd className="fa-lg" />
                                          ) : Annonces.isDelivered === true ? (
                                            <i
                                              className="fa fa-star fa-lg"
                                              aria-hidden="true"
                                            ></i>
                                          ) : (
                                            <i className="fa fa-eye"></i>
                                          )}
                                        </a>
                                      </Link>
                                    </li>
                                  ) : (
                                    <li>
                                      <Link
                                        to={{
                                          pathname: "/DetailsCommande",
                                          state: {
                                            id: Annonces,
                                          },
                                        }}
                                        type="submit"
                                      >
                                        {" "}
                                        <a
                                          onClick={this.local.bind(
                                            this,
                                            Annonces
                                          )}
                                        >
                                          {Annonces.statut ===
                                            "en attente de paiement avance" ||
                                          Annonces.statut ===
                                            "en attente de paiement du reste" ||
                                          Annonces.statut ===
                                            "en attente de paiement du complément" ||
                                          Annonces.statut ===
                                            "reçu avance refusé" ||
                                          Annonces.statut ===
                                            "reçu reste refusé" ? (
                                            <CgFileAdd className="fa-lg" />
                                          ) : (
                                            <i className="fa fa-eye"></i>
                                          )}
                                        </a>
                                      </Link>
                                    </li>
                                  )}
                                  {Annonces.statut ===
                                    "commande annulée (deadline dépassé)" ||
                                  Annonces.statut === "reçu avance refusé" ||
                                  Annonces.statut === "reçu reste refusé" ||
                                  Annonces.statut ===
                                    "en attente de paiement avance" ||
                                  Annonces.statut ===
                                    "en attente de validation avance" ||
                                  Annonces.statut ===
                                    "en attente de paiement du reste" ||
                                  (Annonces.ancien_statut ===
                                    "avarié_changement" &&
                                    (Annonces.ancien_statut ===
                                      "en attente de paiement avance" ||
                                      Annonces.ancien_statut ===
                                        "en attente de paiement du reste" ||
                                      Annonces.ancien_statut ===
                                        "en attente de validation avance")) ? (
                                    <li>
                                      <a
                                        onClick={(e) =>
                                          this.handelDelete(Annonces)
                                        }
                                      >
                                        <i className="fa fa-trash"></i>
                                      </a>
                                    </li>
                                  ) : null}
                                </ul>
                              </div>
                              <div
                                className="  product__item__text p-2 text-justify"
                                style={
                                  titre === "annulées"
                                    ? {
                                        //height: 200 - -this.NbrEspeceMax() * 40,
                                        backgroundRepeat: "no-repeat",
                                        backgroundImage:
                                          Annonces.statut === "avarié"
                                            ? "linear-gradient(rgb(255,153,153), rgb(255,204,204))"
                                            : null,
                                        backgroundSize: "cover",
                                      }
                                    : titre === "Prêt à livrer"
                                    ? {
                                        //height: 300 - -this.NbrEspeceMax() * 40,
                                        backgroundRepeat: "no-repeat",
                                        backgroundImage:
                                          Annonces.statut === "avarié"
                                            ? "linear-gradient(rgb(255,153,153), rgb(255,204,204))"
                                            : null,
                                        backgroundSize: "cover",
                                      }
                                    : {
                                        //height: 250 - -this.NbrEspeceMax() * 40,
                                        backgroundRepeat: "no-repeat",
                                        backgroundImage:
                                          Annonces.statut === "avarié"
                                            ? "linear-gradient(rgb(255,153,153), rgb(255,204,204))"
                                            : null,
                                        backgroundSize: "cover",
                                      }
                                }
                              >
                                {Annonces.especes.length === 1 ? (
                                  <div
                                    className="region"
                                    style={{
                                      color: "#aaa",
                                      fontSize: "15px",
                                      textAlign: "center",
                                    }}
                                  >
                                    <div className="d-inline-block ">
                                      <span
                                        className="h6 "
                                        id="gras"
                                        style={{ marginRight: "5px" }}
                                      >
                                        {" "}
                                        №{" "}
                                      </span>
                                    </div>
                                    <div className="d-sm-inline-block  ">
                                      <span style={{ color: "black" }}>
                                        {" " + Annonces.espece[0].boucle}{" "}
                                      </span>
                                    </div>{" "}
                                  </div>
                                ) : (
                                  <div
                                    className="region"
                                    style={{
                                      color: "#aaa",
                                      fontSize: "15px",
                                      textAlign: "center",
                                    }}
                                  >
                                    <p className="mb-0">
                                      <h6 className="mb-0">
                                        {this.NbrEspece(Annonces, "mouton") !==
                                        0 ? (
                                          <span className="w-100">
                                            {this.NbrEspece(Annonces, "mouton")}{" "}
                                            {" : "}Mouton(s){" "}
                                          </span>
                                        ) : null}
                                      </h6>

                                      <h6 className="mb-0">
                                        {this.NbrEspece(Annonces, "vache") !==
                                        0 ? (
                                          <span className="w-100">
                                            {this.NbrEspece(Annonces, "vache")}
                                            {" : "}Vache(s){" "}
                                          </span>
                                        ) : null}
                                      </h6>

                                      <h6 className="mb-0">
                                        {" "}
                                        {this.NbrEspece(Annonces, "chevre") !==
                                        0 ? (
                                          <span className="w-100">
                                            {this.NbrEspece(Annonces, "chevre")}
                                            {" : "}Chevre(s)
                                          </span>
                                        ) : null}
                                      </h6>
                                    </p>{" "}
                                  </div>
                                )}
                                {Annonces.especes.length === 1 ? (
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
                                    {Annonces.espece[0].espece == "chevre"
                                      ? "Chèvre"
                                      : "Mouton"}
                                    <span className="float-right">
                                      <FaShapes
                                        style={{ marginRight: "5px" }}
                                      />
                                      {" " + Annonces.espece[0].race}
                                    </span>
                                  </div>
                                ) : null}

                                {this.Max(Annonces, "poids") ===
                                this.Min(Annonces, "poids") ? (
                                  <span className="float-right ">
                                    <GiWeight
                                      className=" mr-1 fa-lg "
                                      style={{ marginRight: "5px" }}
                                    />
                                    {this.Max(Annonces, "poids")} Kg{" "}
                                  </span>
                                ) : (
                                  <p
                                    className=" mb-0"
                                    style={{
                                      color: "black",
                                      fontWeight: "normal",
                                    }}
                                  >
                                    <GiWeight
                                      className=" mr-1 fa-lg "
                                      style={{ marginRight: "5px" }}
                                    />
                                    {this.Max(Annonces, "poids")} -{" "}
                                    {this.Min(Annonces, "poids")} Kg
                                  </p>
                                )}
                                {this.Max(Annonces, "age") ===
                                this.Min(Annonces, "age") ? (
                                  <p className=" mb-0">
                                    <div style={{ display: "inline-block" }}>
                                      <h6 id="gras">
                                        <MdCake
                                          className=" mr-1 fa-lg "
                                          style={{ marginRight: "5px" }}
                                        />
                                        <span
                                          style={{
                                            color: "black",
                                            fontWeight: "normal",
                                          }}
                                        >
                                          {this.Max(Annonces, "age")} mois
                                        </span>
                                      </h6>
                                    </div>
                                  </p>
                                ) : (
                                  <p className=" mb-0">
                                    <span
                                      style={{
                                        color: "black",
                                        fontWeight: "normal",
                                      }}
                                    >
                                      <MdCake
                                        className=" mr-1 fa-lg "
                                        style={{ marginRight: "5px" }}
                                      />
                                      {this.Max(Annonces, "age")} -
                                      {this.Min(Annonces, "age")} mois
                                    </span>
                                  </p>
                                )}

                                {Annonces.statut ===
                                  "en attente de paiement avance" ||
                                (Annonces.ancien_statut ===
                                  "en attente de paiement avance" &&
                                  Annonces.statut === "avarié_changement") ? (
                                  <p className=" mb-0">
                                    <h6 id="gras">
                                      <i
                                        className="fa fa-calendar-o"
                                        aria-hidden="true"
                                        style={{ marginRight: "5px" }}
                                      ></i>{" "}
                                      Dernier delai :{" "}
                                    </h6>
                                    <p className="text-danger mb-0 font-weight-bold">
                                      {(Annonces.deadline.slice(0, 15) + Annonces.deadline.slice(18, )).replace(",", " à ")}
                                    </p>
                                    <h6 id="gras">
                                      <i
                                        className="fa fa-usd"
                                        aria-hidden="true"
                                        style={{ marginRight: "5px" }}
                                      ></i>{" "}
                                      Avance à payer :
                                      <span className="text-danger ">
                                        {" "}
                                        {Annonces.avance} Dhs
                                      </span>{" "}
                                    </h6>
                                  </p>
                                ) : null}
                                {Annonces.statut ===
                                  "en attente de paiement du reste" ||
                                (Annonces.ancien_statut ===
                                  "en attente de paiement du reste" &&
                                  Annonces.statut === "avarié_changement") ? (
                                  <p className=" mb-0">
                                    <h6 id="gras" className=" mb-0">
                                      <i
                                        className="fa fa-calendar-o"
                                        aria-hidden="true"
                                      ></i>{" "}
                                      Dernier delai :{" "}
                                    </h6>
                                    <p className="text-danger mb-0 font-weight-bold">
                                      {Annonces.deadline.replace(",", " à ")}
                                    </p>
                                    <h6 id="gras" className="">
                                      <i
                                        className="fa fa-usd"
                                        aria-hidden="true"
                                      ></i>{" "}
                                      Reste à payer :{" "}
                                      <span className="text-danger ">
                                        {" "}
                                        {Annonces.reste} Dhs
                                      </span>
                                    </h6>
                                  </p>
                                ) : null}
                                {Annonces.statut ===
                                "en attente de paiement du complément" ? (
                                  <p className=" mb-0">
                                    <h6 id="gras" className="  mb-0">
                                      <i
                                        className="fa fa-calendar-o"
                                        aria-hidden="true"
                                      ></i>{" "}
                                      Dernier delai :{" "}
                                    </h6>
                                    <p className="text-danger mb-0 font-weight-bold">
                                      {Annonces.deadline.replace(",", " à ")}
                                    </p>
                                    <h6 id="gras" className="">
                                      <i
                                        className="fa fa-usd"
                                        aria-hidden="true"
                                      ></i>{" "}
                                      Complement à payer :{" "}
                                      <span className="text-danger ">
                                        {" "}
                                        {Annonces.complement} Dhs
                                      </span>{" "}
                                    </h6>
                                  </p>
                                ) : null}
                                {Annonces.statut ===
                                "en attente de validation avance" ? (
                                  <p className=" mb-0">
                                    <h6 id="gras">
                                      <i
                                        className="fa fa-usd"
                                        aria-hidden="true"
                                        style={{ marginRight: "5px" }}
                                      ></i>{" "}
                                      L'avance :
                                      <span className="text-danger ">
                                        {" "}
                                        {Annonces.avance} Dhs
                                      </span>{" "}
                                    </h6>
                                    <h6 className=" mt-0">
                                      <span id="gras">
                                        <i
                                          className="fa fa-calendar-o"
                                          aria-hidden="true"
                                        ></i>{" "}
                                        Payée le :
                                      </span>{" "}
                                      {Annonces.avance_transmis_le.substr(
                                        8,
                                        2
                                      ) +
                                        "-" +
                                        Annonces.avance_transmis_le.substr(
                                          5,
                                          2
                                        ) +
                                        "-" +
                                        Annonces.avance_transmis_le.substr(
                                          0,
                                          4
                                        ) +
                                        " à " +
                                        Annonces.avance_transmis_le.substr(
                                          11,
                                          5
                                        )}
                                    </h6>
                                  </p>
                                ) : null}
                                {Annonces.statut ===
                                  "en attente de validation reste" ||
                                Annonces.statut === "validé" ||
                                (Annonces.statut === "avarié_changement" &&
                                  Annonces.ancien_statut === "validé") ? (
                                  <p className=" mb-0">
                                    <h6 id="gras" className=" mb-0">
                                      <i
                                        className="fa fa-calendar-o"
                                        aria-hidden="true"
                                      ></i>{" "}
                                      reste transmis le :{" "}
                                    </h6>
                                    <h6 className="text-danger font-weight-bold mt-0">
                                      {Annonces.reste_transmis_le.substr(
                                        0,
                                        10
                                      ) +
                                        " à " +
                                        Annonces.reste_transmis_le.substr(
                                          11,
                                          8
                                        )}
                                    </h6>
                                  </p>
                                ) : null}
                                {Annonces.statut === "validé" &&
                                Annonces.date_de_livraison ? (
                                  <div>
                                    <p id="gras" className=" mb-0">
                                      <i
                                        className="fa fa-calendar-o"
                                        aria-hidden="true"
                                      ></i>{" "}
                                      Date de livraison :{" "}
                                    </p>
                                    <p className="text-danger font-weight-bold">
                                      {" "}
                                      {Annonces.date_de_livraison.replace(
                                        /-/g,
                                        " / "
                                      )}
                                    </p>
                                  </div>
                                ) : null}

                                {Annonces.statut ===
                                "en attente de validation complément" ? (
                                  <div>
                                    <p className="mb-0" id="gras">
                                      <i
                                        className="fa fa-calendar-o"
                                        aria-hidden="true"
                                      ></i>{" "}
                                      Complément transmis le :{" "}
                                    </p>
                                    <p className="text-danger font-weight-bold">
                                      {" "}
                                      {Annonces.complement_transmis_le.substr(
                                        0,
                                        10
                                      ) +
                                        " à " +
                                        Annonces.complement_transmis_le.substr(
                                          11,
                                          8
                                        )}
                                    </p>
                                  </div>
                                ) : null}

                                {this.props.location.state.id ===
                                "commande annulée (deadline dépassé)#reçu avance refusé#reçu reste refusé#reçu complément refusé#avarié#rejetée#annulée manuellement#remboursement#avarié_changement#avarié_remboursement#avarié_annulé" ? (
                                  Annonces.statut === "annulée manuellement" ? (
                                    <p className=" text-danger">
                                      <i
                                        className="fa fa-exclamation-circle"
                                        aria-hidden="true"
                                      ></i>{" "}
                                      Annulée manuellement{" "}
                                    </p>
                                  ) : null
                                ) : null}
                                {/* motif */}
                                <div className="icon-vendus">
                                  {Annonces.statut ===
                                  "commande annulée (deadline dépassé)" ? (
                                    <h1
                                      style={{
                                        borderRadius: "0% 0% 0% 40%",
                                        fontSize: "14px",
                                      }}
                                      className=" badge badge-danger  pt-1 w-100  "
                                    >
                                      <HiOutlineBadgeCheck className=" mr-1 fa-lg " />
                                      <span>Délai dépassé</span>{" "}
                                    </h1>
                                  ) : null}

                                  {Annonces.statut === "avarié" ? (
                                    <h1
                                      style={{
                                        borderRadius: "0% 0% 0% 40%",
                                        fontSize: "14px",
                                      }}
                                      className=" badge badge-danger  pt-1 w-100  "
                                    >
                                      <HiOutlineBadgeCheck className=" mr-1 fa-lg " />
                                      <span>Produit avarié</span>{" "}
                                    </h1>
                                  ) : null}
                                  {Annonces.statut ===
                                    "en attente de validation reste" ||
                                  Annonces.statut ===
                                    "en attente de validation complément" ? (
                                    <h1
                                      style={{
                                        borderRadius: "0% 0% 0% 40%",
                                        fontSize: "14px",
                                      }}
                                      className=" badge badge-success  pt-1 w-100  "
                                    >
                                      <HiOutlineBadgeCheck className=" mr-1 fa-lg " />
                                      <span>Validation en cours</span>{" "}
                                    </h1>
                                  ) : null}
                                  {Annonces.statut === "validé" ? (
                                    <h1
                                      style={{
                                        borderRadius: "0% 0% 0% 40%",
                                        fontSize: "14px",
                                      }}
                                      className=" badge badge-success  pt-1 w-100  "
                                    >
                                      <HiOutlineBadgeCheck className=" mr-1 fa-lg " />
                                      <span>Validé</span>{" "}
                                    </h1>
                                  ) : null}
                                </div>
                                {/* price */}
                                {Annonces.statut ===
                                "en attente de validation avance" ? (<span id="gras">
                                  <i
                                    className="fa fa-usd"
                                    aria-hidden="true"
                                    style={{ marginRight: "5px" }}
                                  ></i>{" "}
                                  Le reste :
                                </span>) : null
                                }
                                <div
                                  className="float-right "
                                  style={{
                                    color: "#fe6927",
                                    fontSize: "18px",
                                    fontWeight: "1000",
                                    textDecoration: "bold",
                                    alignContent: "center",
                                  }}
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
                                  {(Annonces.statut === "en attente de validation avance" ? 
                                    (Annonces.prix_total - Annonces.avance) : (Annonces.prix_total)) + "  Dhs"}
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          <></>
                        )}
                      </div>
                    ))}
                  </div>
                  {currentAnnonces.length !== 0 ? (
                    <>
                      {" "}
                      <div className="center-div">
                        <Pagination
                          activePage={this.state.currentPage}
                          itemsCountPerPage={9}
                          totalItemsCount={currentAnnonces.length}
                          pageRangeDisplayed={7}
                          onChange={this.paginate.bind(this)}
                          itemClass="page-item"
                          linkClass="page-link"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {" "}
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

                        <h3 style={{ color: "#28a745" }}>Aucune commande !</h3>
                      </div>
                    </>
                  )}

                  <br></br>
                  <br></br>
                </div>
              </div>
            </div>
          )}{" "}
        </section>
      </div>
    );
  }
}

export default Commandes;
