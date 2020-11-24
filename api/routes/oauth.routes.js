const router = require("express").Router();
const passport = require("passport");
const CLIENT_HOME_PAGE_URL = "http://localhost:3000";

router.get("/success", (req, res) => {
  if (req.user) {
    res.json({
      success: true,
      message: "user has successfully authenticated",
      user: req.user,
      cookies: req.cookies
    });
  }
});

router.get("/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "user failed to authenticate."
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(CLIENT_HOME_PAGE_URL);
});

router.get("/facebook", passport.authenticate("facebook"), function (req, res) {
  res.redirect(CLIENT_HOME_PAGE_URL);
});

router.get("/facebook/redirect",
  passport.authenticate("facebook", {
    successRedirect: CLIENT_HOME_PAGE_URL,
    failureRedirect: "/auth/login/failed"
  })
);

router.get("/github", passport.authenticate("github"), function (req, res) {
  res.redirect(CLIENT_HOME_PAGE_URL);
});

router.get("/github/redirect",
  passport.authenticate("github", {
    successRedirect: CLIENT_HOME_PAGE_URL,
    failureRedirect: "/auth/login/failed"
  })
);

router.get("/intra", passport.authenticate("42"), function (req, res) {
  res.redirect(CLIENT_HOME_PAGE_URL);
});

router.get("/intra/redirect",
  passport.authenticate("42", {
    successRedirect: CLIENT_HOME_PAGE_URL,
    failureRedirect: "/auth/login/failed"
  })
);

module.exports = router;