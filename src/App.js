"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactRouterDom = require("react-router-dom");
var _AuthContext = require("./contexts/AuthContext");
var _Navbar = _interopRequireDefault(require("./components/Navbar"));
var _Home = _interopRequireDefault(require("./pages/Home"));
var _Login = _interopRequireDefault(require("./pages/Login"));
var _Stats = _interopRequireDefault(require("./pages/Stats"));
var _ProtectedRoute = _interopRequireDefault(require("./components/ProtectedRoute"));
require("bootstrap/dist/css/bootstrap.min.css");
require("./styles/styles.scss");
var _Test = _interopRequireDefault(require("./pages/Test"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function App() {
  return /*#__PURE__*/_react.default.createElement(_AuthContext.AuthProvider, null, /*#__PURE__*/_react.default.createElement(_reactRouterDom.BrowserRouter, null, /*#__PURE__*/_react.default.createElement("div", {
    className: "app-container"
  }, /*#__PURE__*/_react.default.createElement(_Navbar.default, null), /*#__PURE__*/_react.default.createElement("main", {
    className: "main-content"
  }, /*#__PURE__*/_react.default.createElement(_reactRouterDom.Routes, null, /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
    path: "/",
    element: /*#__PURE__*/_react.default.createElement(_Home.default, null)
  }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
    path: "/login",
    element: /*#__PURE__*/_react.default.createElement(_Login.default, null)
  }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
    path: "/stats",
    element: /*#__PURE__*/_react.default.createElement(_ProtectedRoute.default, null, /*#__PURE__*/_react.default.createElement(_Stats.default, null))
  }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
    path: "/tests",
    element: /*#__PURE__*/_react.default.createElement(_ProtectedRoute.default, null, /*#__PURE__*/_react.default.createElement(_Test.default, null))
  }))))));
}
var _default = exports.default = App;