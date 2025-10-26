"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactRouterDom = require("react-router-dom");
var _reactBootstrap = require("react-bootstrap");
var _AuthContext = require("../contexts/AuthContext");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var Home = function Home() {
  var _useAuth = (0, _AuthContext.useAuth)(),
    currentUser = _useAuth.currentUser;

  // redirect to /login if user is not signed in
  if (!currentUser) {
    return /*#__PURE__*/_react.default.createElement(_reactRouterDom.Navigate, {
      to: "/login",
      replace: true
    });
  }
  return /*#__PURE__*/_react.default.createElement(_reactBootstrap.Container, null, /*#__PURE__*/_react.default.createElement(_reactBootstrap.Row, {
    className: "justify-content-center"
  }, /*#__PURE__*/_react.default.createElement(_reactBootstrap.Col, {
    md: 8
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "text-center"
  }, /*#__PURE__*/_react.default.createElement("h1", {
    className: "display-4 mb-4"
  }, "Are you Smarter Than a Monkey?"), /*#__PURE__*/_react.default.createElement("p", {
    className: "lead mb-4"
  }, "Click the squares in order according to their numbers. Let's see if you have a better memory than a monkey!"), /*#__PURE__*/_react.default.createElement("div", {
    className: "mt-4"
  }, currentUser ? /*#__PURE__*/_react.default.createElement(_reactRouterDom.Link, {
    to: "/test",
    className: "btn btn-success btn-lg"
  }, "Start Test") : /*#__PURE__*/_react.default.createElement(_reactRouterDom.Link, {
    to: "/login",
    className: "btn btn-primary btn-lg"
  }, "Sign Up to Get Started"))))));
};
var _default = exports.default = Home;