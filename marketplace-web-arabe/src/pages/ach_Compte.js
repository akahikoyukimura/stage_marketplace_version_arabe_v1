import React, { Component } from "react";
import axios from "axios";
/* import { Link } from "react-router-dom";
 */import "bootstrap-less";
/* import Loader from "react-loader-spinner";
import Swal from "sweetalert2";
import { GiWeight, GiSheep } from "react-icons/gi";
import { HiOutlineBadgeCheck } from "react-icons/hi";
import { FaShapes } from "react-icons/fa";
import ReactDOM from "react-dom"; */
import Modal from "react-modal";

import { FormattedMessage } from "react-intl";


const intl = JSON.parse(localStorage.getItem("intl"));

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

require("bootstrap-less/bootstrap/bootstrap.less");

class Compte extends Component {
  constructor() {
    super();
    this.state = {
      Data: [],
      nbr: null,
      loading: true,
      modalIsOpen: false,
    };
    let subtitle;
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

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
      this.setState({ loading: true }, () => {
        axios
          .get("http://127.0.0.1:8000/api/consommateur/" + token, {
            headers: {
              // "x-access-token": token, // the token is a variable which holds the token
              // "Content-Type": "application/json",
              Authorization: myToken,
            },
          })
          .then((res) => {
            this.setState({
              Data: res.data,
              loading: false,
            });
          });
      });
    }
  }

  openModal() {
    this.setState({
      modalIsOpen: true,
    });
    console.log(this.state.modalIsOpen);
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = "#f00";
  }

  closeModal() {
    this.setState({
      modalIsOpen: false,
    });
  }

  render() {
    return (
      <div>
        <Modal
          isOpen={this.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <h2 ref={(_subtitle) => (this.subtitle = _subtitle)}>Hello</h2>
          <button onClick={this.closeModal}>close</button>
          <div>I am a modal</div>
          <form>
            <input />
            <button>tab navigation</button>
            <button>stays</button>
            <button>inside</button>
            <button>the modal</button>
          </form>
        </Modal>
        <div className="container" style={localStorage.getItem("lg") == "ar"? { direction: "rtl", textAlign: "centre", width:"100%" }: {}}>
          {this.state.Data.length != 0 ? (
            <>
              <div className="cont">
                <div className="first item">
                  <div className="picture item">
                    <centre>
                      {this.state.Data.civilisation == "Mr" ? (
                        <img
                          src="/Images/man.png"
                          alt="item"
                          className="product__item__pic set-bg"
                          style={{
                            width: "200px",
                            height: "200px",
                          }}
                        />
                      ) : (
                        <img
                          src="/Images/woman.png"
                          alt="item"
                          className="product__item__pic set-bg"
                          style={{
                            width: "200px",
                            height: "200px",
                          }}
                        />
                      )}
                    </centre>{" "}
                  </div>
                  <div className="information item" style={localStorage.getItem("lg") == "ar"? { direction: "rtl", textAlign: "right", width:"100%" }: {}}>
                    <div className="details">
                      <ul className="pt-4">
                        <li>
                          <b><FormattedMessage  id="compte_civilisation"/></b>{" "}
                          <span>{this.state.Data.civilisation}</span>{" "}
                        </li>
                        <li>
                          <b><FormattedMessage  id="signup_nom"/></b> <span>{this.state.Data.nom}</span>{" "}
                        </li>
                        {/*<li>
                          <b>Categorie</b> <span>{this.state.Espece.categorie}</span>
                        </li>*/}
                        <li>
                          <b><FormattedMessage  id="signup_prenom"/></b> <span>{this.state.Data.prenom}</span>{" "}
                        </li>
                        <li>
                          <b><FormattedMessage  id="compte_tel"/></b> <span>{this.state.Data.tel} </span>{" "}
                        </li>
                        <li>
                          <b><FormattedMessage  id="signup_email"/></b> <span>{this.state.Data.email} </span>{" "}
                          {/* <button onClick={this.openModal}>
                            {" "}
                            <img src="/Images/edit.png" alt="item" />
                          </button> */}
                        </li>
                        <li>
                          <b><FormattedMessage  id="signup_adresse"/></b> <span>{this.state.Data.adresse} </span>{" "}
                        </li>
                        <li>
                          <b><FormattedMessage  id="signup_ville"/></b> <span>{this.state.Data.ville} </span>{" "}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="item"></div>
              </div>
            </>
          ) : (
            <>
              {" "}
              <div style={{ height: "80em" }}></div>
            </>
          )}
        </div>
      </div>
    );
  }
}
export default Compte;
