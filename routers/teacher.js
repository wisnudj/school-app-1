const express = require('express')
const router = express.Router()
const model = require('../models');

router.get('/', (req, res) => {
  model.Teacher.findAll({order:['first_name']}).then((teachers) => {
    var arrPromiseTeacher = teachers.map((teacher) => {
      return new Promise((resolve, reject) => {
        teacher.getSubject().then((subject) => {
          if(subject == null) {
            teacher.subject_name = ''
          }
          else {
            teacher.subject_name = subject.subject_name
          }
            resolve(teacher)
        })
      })
    })
    Promise.all(arrPromiseTeacher).then((hasil) => {
      res.render('teacher', {teacher: hasil})
    })
  })
})
// res.render('teacher', {teacher: teacher})

router.get('/add', (req, res) => {
  model.Subject.findAll().then((subject) => {
    res.render('teacheradd', {subject: subject})
  })
})


router.post('/add', (req, res) => {
  model.Teacher.create({first_name: req.body.first_name, last_name: req.body.last_name, email: req.body.email, SubjectId: req.body.SubjectId}).then(() => {
    res.redirect('/teachers')
  })
})

router.get('/delete/:id', (req, res) => {
  model.Teacher.destroy({where : {id: req.params.id}}).then(() => {
    res.redirect('/teachers')
  })
})

router.get('/edit/:id', (req, res) => {
  model.Teacher.findOne({where:{id:req.params.id}}).then((teacher) => {
    model.Subject.findAll().then((subject) => {
      res.render('teacheredit', {teacher:teacher, subject:subject})
    })
  })
})


router.post('/edit/:id', (req, res) => {
  model.Teacher.update({first_name: req.body.first_name, last_name: req.body.last_name, email: req.body.email, SubjectId: req.body.SubjectId}, {where: {id: req.params.id}}).then(() => {
    res.redirect('/teachers')
  })
})

module.exports = router
