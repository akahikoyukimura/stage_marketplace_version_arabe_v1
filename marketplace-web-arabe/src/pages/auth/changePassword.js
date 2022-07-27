import React, { Component } from "react";
import { login } from "./UserFunctions";
import Swal from "sweetalert2";
import axios from "axios";
import Loader from "react-loader-spinner";
import { FormattedMessage } from "react-intl";


const intl = JSON.parse(localStorage.getItem("intl"));


class changePassword extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      redirect: true,
      loading: false,
      // timeConnexion: new(Date),
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();
    const adress = this.state.email;
    console.log(this.state.email);
    this.setState({ loading: true }, () => {
      axios
        .post(
          "http://127.0.0.1:8000/api/password/email",
          { email: adress },
          {
            headers: {
              // "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
              Accept: "application/json",
              //Authorization: myToken,
              // "Access-Control-Allow-Origin": "*",
            },
          }
        )
        .then((res) => {
          this.props.history.push("/ToutesLesAnnonces");
          this.setState({ loading: false });
          Swal.fire({
            title: intl.messages.change_reinitialiser_title,
            text: intl.messages.change_lien,
            icon: "success",
            width: 400,
            heightAuto: false,
            confirmButtonColor: "#7fad39",

            confirmButtonText: "Ok",
          });
        })
        .catch((err) => {
          this.setState({ loading: false });
          console.log(err.response.data.error);
          if (
            err.response.data.error ===
            "You have requested password reset recently, please check your email.."
          ) {
            Swal.fire({
              /* title: "Erreur de connection",*/
              text: intl.messages.change_repete,
              icon: "info",
              width: 400,
              heightAuto: false,
              confirmButtonColor: "#7fad39",

              confirmButtonText: "Ok",
            });
          } else if (
            err.response.data.error ===
            "We can't find a user with that e-mail address."
          ) {
            Swal.fire({
              /* title: "Erreur de connection",*/
              text: intl.messages.change_email_erreur,
              icon: "error",
              width: 400,
              heightAuto: false,
              confirmButtonColor: "#7fad39",

              confirmButtonText: "Ok",
            });
          } else {
            Swal.fire({
              title: intl.messages.change_oups,
              text: intl.messages.change_erreur,
              icon: "info",
              width: 400,
              heightAuto: false,
              confirmButtonColor: "#7fad39",

              confirmButtonText: "Ok",
            });
          }
        });
    });
  }
  render() {
    const { loading } = this.state;
    return (
      <div className="text-center">
        <div className="contact-form spad">
          <div className="container">
            <div className="row">
              <div className="col-lg-12"></div>
            </div>
            <centre>
              <form
                action="#"
                className="text-center"
                noValidate
                onSubmit={this.onSubmit}
              >
                <center>
                  {" "}
                  <div
                    id="loginStyle"
                    className="row col-lg-6 col-md-6 text-center shoping__checkout"
                  >
                    <div className="col-lg-12 col-md-12">
                      <center>
                        {" "}
                        <br />{" "}
                        <h2 className="text-center">
                          <FormattedMessage id="change_reinitialiser" />
                        </h2>
                      </center>
                      <br />
                      <br />{" "}
                      <div className="row" style={localStorage.getItem("lg") == "ar"? { direction: "rtl", textAlign: "centre", width:"100%" }: {}}>
                        <div id="LoginIcon" className="col-lg-1 col-md-1">
                          <p></p>
                          <span className="symbol-input100">
                            <i
                              className="fa fa-envelope"
                              aria-hidden="true"
                            ></i>
                          </span>{" "}
                        </div>
                        <div id="LoginIcon" className="col-lg-11 col-md-11">
                        <FormattedMessage id="login_email">
                        {(msg) => (
                          <input
                            type="text"
                            placeholder={msg}
                            aria-hidden="true"
                            name="email"
                            onChange={this.onChange}
                          />

                        )}
                      </FormattedMessage>
                        </div>
                      </div>
                      <p></p>
                    </div>
                    <p></p>
                    <div className="col-lg-12 text-center">
                      <p></p>
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
                            height="50"
                            width="50"
                          />
                        </div>
                      ) : (
                        <button type="submit" className="site-btn">
                                        <FormattedMessage id="change_valider" />

                        </button>
                      )}
                      <p></p>
                    </div>
                  </div>
                </center>
              </form>
            </centre>
          </div>
        </div>
      </div>
    );
  }
}
export default changePassword;
