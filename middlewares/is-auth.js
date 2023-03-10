const jwt = require("jsonwebtoken");

module.exports = (req,res,next) =>{
   
  try {
    const token =req.user.token;
    console.log(token);
  if (!token || !req.session.isLoggedIn) {
    return res.redirect("/login");
  }
    const decoded = jwt.verify(token,"my secret" );
    req.user = decoded;
    return next();
    } 
    catch (err) {
        console.log(err);
        return res.redirect("/login");
    }
}
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjQwYWVkYWJhYWNiYzUzNWMwMzM5OGQxIiwiZW1haWwiOiJhYmMxMjNAbWFpbC5jb20iLCJpYXQiOjE2Nzg0NDcyOTIsImV4cCI6MTY3ODYyMDA5Mn0.n-FZppeVjdJQ_r4OksPZo-SwIELn13SUG_OSur-yAZM