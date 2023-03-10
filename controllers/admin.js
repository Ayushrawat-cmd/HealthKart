const Student = require("../models/Student");
const fs = require("fs");
const { parse } = require("csv-parse");
const { stringify } = require("csv-stringify");
const  json2csv  = require("json2csv").Parser;

exports.getAddStudent = (req, res, next) => {
  res.render("admin/add-student", {
    pageTitle: "Add Student",
    path: "/admin/add-student",
    editing: false,
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postAddStudent = (req, res, next) => {
  const name = req.body.name;
  const roll_no = req.body.roll_no;
  const address = req.body.address;
  const institute = req.body.institute;
  const course = req.body.course;
  const email = req.body.email;
  // console.log(req.user);
  Student.findOne({ Email: email }).then((stud) => {
    if (!stud) {
      const student = new Student({
        Name: name,
        Roll_No: roll_no,
        Address: address,
        Institute: institute,
        Course: course,
        Email: email,
      });
      student.save()
        .then((result) => {
          // console.log(result);
          console.log("Created Student");
          res.redirect("/");
        })
        .catch((err) => {
          console.log(err);
        });
    }
    else
      res.redirect("/");
  });
};

exports.postAddfile = (req, res, next) => {
  const file = req.body.file;
  const students = []
  const emails = new Set()
  fs.createReadStream(file)
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data",function (row) {
      students.push({
        Name: row[0],
        Roll_No: row[1],
        Address: row[2],
        Institute: row[3],
        Course: row[4],
        Email: row[5],
      })
    })
    .on("end", function () {
      students.forEach(element => {
        if(!emails.has(element["Email"])){
          const student = new Student({
                Name: element["Name"],
                Roll_No: element["Roll_No"],
                Address: element["Address"],
                Institute: element["Institute"],
                Course: element["Course"],
                Email: element["Email"],
                userId: element["userId"],
              });
               student.save()
               .then((result) => {
                console.log("Succesfully added the student");
                // console.log(result);
              })
              .catch((err) => {
                console.log(err);
              });
              emails.add(element["Email"]);
            }
          
          // console.log(element["Email"]);
      });
      // console.log(students);
      res.redirect("/");
      // console.log("finished");
    })
    .on("error", function (error) {
      console.log(error.message);
    });
};

exports.getDownloadFile = (req, res, next) => {
  
  const columns = [
    "Name",
    "Roll_No",
    "Address",
    "Address",
    "Institution",
    "Course",
    "Email",
  ];
  Student.find().then(
    students=>{
      let studs =[];
      students.forEach((obj) => {
        const { Name,
        Roll_No,
        Address,
        Institution,
        Course,
        Email, } = obj;
        studs.push({ Name,
          Roll_No,
          Address,
          Institution,
          Course,
          Email, });
      });
      stud = JSON.parse(JSON.stringify(students));
      let JsonData = new json2csv({columns});
      let csvdata = JsonData.parse(studs);
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename = sample_data.csv");
      res.end(csvdata);
    }
  ).catch(err => {
    console.log(err);
  });
};
