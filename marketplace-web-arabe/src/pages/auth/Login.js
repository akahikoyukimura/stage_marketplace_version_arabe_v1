import React, { Component } from "react";
import { login } from "./UserFunctions";
import Swal from "sweetalert2";
import axios from "axios";
import Loader from "react-loader-spinner";




import { FormattedMessage } from "react-intl";

const intl = JSON.parse(localStorage.getItem("intl"));


class Login extends Component {

  constructor() {
    super();
    this.state = {
      login: "",
      password: "",
      redirect: true,
      loading: false,
      isChecked: false,
      // timeConnexion: new(Date),
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  decryp(sample) {
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890;~!@#$%^&*()_+<>?,./|{}][".split("");
    var rot13Alphabet = "NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm0987654321[]}{|/.,?><+_)(*&^%$#@!~;".split("");
    var result = "";
    for (var x = 0; x < sample.length; x++) {
      for (var y = 0; y < alphabet.length; y++) {
        if (sample[x] === alphabet[y]) {
          result += rot13Alphabet[y];
        }
      }
      if (sample[x] === " ") {
        result += " ";
      }
    }
    return result;
  }
  cryp(str) {
    const input = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890;~!@#$%^&*()_+<>?,./|{}][';
    const output = 'NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm0987654321[]}{|/.,?><+_)(*&^%$#@!~;';
    let encoded = '';
    for (let i = 0; i < str.length; i++) {
      const index = input.indexOf(str[i]);
      encoded += output[index];
    }

    return encoded;
  }
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
    if ([e.target.name] === "login" && localStorage.getItem(e.target.value) != null) {
      var all = document.querySelectorAll('input[name="password"]')
      Array.from(all).map((a) => (a.value = this.decryp(localStorage.getItem(e.target.value))))
      this.setState({ password: this.decryp(localStorage.getItem(e.target.value)) })
      if (localStorage.getItem(e.target.value) !== null) {
        this.setState({ isChecked: true })
      }
      else {
        this.setState({ isChecked: false })
      }
    }
  }
  handleChecked() {
    this.setState({ isChecked: !this.state.isChecked });
  }

  componentDidMount() {
    localStorage.removeItem("usertoken");
    localStorage.removeItem("myToken");
    localStorage.removeItem("expiredTimeToken");


  }

  onSubmit(e) {
    e.preventDefault();

    const user = {
      login: this.state.login,
      password: this.state.password,
      remember_token: this.state.isChecked,
      role: "Consommateur",
    };

    this.setState({ loading: true }, () => {
      axios
        .post("http://127.0.0.1:8000/api/login", user)
        .then((res) => {
          localStorage.setItem("usertoken", res.data.success.token.token.user_id);
          localStorage.setItem("myToken", res.data.success.token.accessToken);
          localStorage.setItem("expiredTimeToken", res.data.success.token.token.expires_at);
          if (this.state.isChecked) {
            localStorage.setItem(this.state.login, this.cryp(this.state.password));
          }
          else {
            localStorage.removeItem(this.state.login);
          }
          this.props.history.push("/ToutesLesAnnonces");
          this.setState({ loading: false });
          window.location.reload();

        })
        .catch((err) => {
          this.setState({ loading: false });
          
          Swal.fire({
            /* title: "Erreur de connection",*/
            text:intl.messages.login_refus,
            icon: "error",
            width: 400,
            heightAuto: false,
            confirmButtonColor: "#7fad39",

            confirmButtonText: "Ok!",
          });
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
                        <br /> <h2 className="text-center"><FormattedMessage id="header_se_connecter" /></h2>
                      </center>
                      <br />
                      <br />{" "}
                      <div className="row" style={localStorage.getItem("lg") == "ar"? { direction: "rtl", textAlign: "centre", width:"100%" }: {}}>
                        <div id="LoginIcon" className="col-lg-1 col-md-1">
                          <p></p>
                          <span class="symbol-input100">
                            <i class="fa fa-envelope" aria-hidden="true"></i>
                          </span>{" "}
                        </div>
                        <div id="LoginIcon" className="col-lg-11 col-md-11">
                          <FormattedMessage id="login_email">
                            {(msg) => (
                              <input
                                type="text"
                                placeholder={msg}
                                aria-hidden="true"
                                name="login"
                                onChange={this.onChange}
                              />

                            )}
                          </FormattedMessage>


                        </div>
                      </div>
                      <p></p>
                      <div className="row" style={localStorage.getItem("lg") == "ar"? { direction: "rtl", textAlign: "centre", width:"100%" }: {}}>
                        <div id="LoginIcon" className="col-lg-1 col-md-1">
                          <p></p>
                          <span class="symbol-input100">
                            <i class="fa fa-lock" aria-hidden="true"></i>
                          </span>{" "}
                        </div>
                        <div id="LoginIcon" className="col-lg-11 col-md-11">
                        <FormattedMessage id="login_password">
                            {(msg) => (
                          <input
                            type="password"
                            placeholder={msg}
                            name="password"
                            onChange={this.onChange}
                          />
                        )}
                        </FormattedMessage>
                        </div>
                        <div class="custom-control custom-checkbox mt-4" style={localStorage.getItem("lg") == "ar"? { direction: "rtl", textAlign: "centre", width:"100%" }: {}}>
                          <input type="checkbox" name="remember"  class="custom-control-input" id="checkbox-1" onChange={() => this.handleChecked()} checked={this.state.isChecked} />
                          <label class="custom-control-label" for="checkbox-1" onChange={() => this.handleChecked()}>
                            <i className="text-right"><FormattedMessage id="login_remember" /> </i>
                          </label>
                        </div>
                      </div>
                      <p>




                      </p>
                    </div>
                    <p></p>
                    <div className="col-lg-12 text-center">
                      <p></p>
                      {loading ? (
                        <div
                          style={{
                            width: "100%",
                            height: "100",
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
                          <FormattedMessage id="login_login" />
                        </button>
                      )}
                      <p></p>
                    </div>
                    <div className="col-lg-12 text-center">
                      <a type="submit" href="/register" className="site-btn1">
                      <FormattedMessage id="login_signup" />
                      </a>
                    </div>
                    <div style={localStorage.getItem("lg") == "ar"? { direction: "rtl", textAlign: "centre", width:"100%" }: {}}>
                      <br />
                      <i className="text-right" >
                      <FormattedMessage id="login_forget" /> {" "}
                      </i>

                      <a type="submit" href="/changePassword">
                      <FormattedMessage id="login_change"   
                  
/>
                      </a>
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
export default Login;
