import { Link } from "gatsby"
import PropTypes from "prop-types"

import "../css/font-awesome.css"
import "bootstrap/dist/css/bootstrap.css"
import "../css/style.css"
import logo from "../images/oneshopper-logo.png"
import React from 'react'



const Header = ({ siteTitle }) => (
  <header className="site-header">
    <div className="container">
    
      <div className="row">
        <div className="col-sm-12 col-md-4 align-self-center">
          <Link className="header-logo" to="/">
            <img src={logo} alt="OneShopper logo"></img>
          </Link>
        </div>
        <div className="col-sm-12 col-md-8 align-self-center">
          <nav>
            <ul className="navbar-nav mr-auto">
              <li className="nav-item active">
                <Link className="nav-link" to="/">
                  Home
                </Link>
                
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">
                  About
                </Link>
              </li>
              <li className="nav-item">
                <li>
                  <Link className="nav-link" to="/search">Search</Link>
                </li>
              </li>
            </ul>
            <div className="header-cart">
              <Link
                className="Header__summary snipcart-summary snipcart-checkout"
                to="#"
              >
                <i className="fas fa-cart-plus"></i>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </div>
  </header>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
