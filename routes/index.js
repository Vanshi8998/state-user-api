const express = require('express')
const ChildModel = require('../models/ChildModel')
const UserModel = require('../models/UserModel')
const StateModel = require('../models/StateModel')
const DistrictModel = require('../models/DistrictModel')
const validation = require('../middleware/validation/validation')
const bcrypt = require('bcrypt')
const userValidation = validation.userValidation
const stateValidation = validation.stateValidation
const districtValidation = validation.districtValidation
const childValidation = validation.childValidation




const router = express.Router()

//create state
router.post('/state', (req, res) => {

    let [result, data] = stateValidation(req.body.state)

    if (!("state" in req.body)) {
        res.status(400).json({ message: "State information is needed in request body" })
    }
    const state = new StateModel({ state: req.body.state })
    state.save()
        .then(data => {
            if (data) {
                state.save()
                    .then(data => res.status(200).json(data))
            }
        })
        .catch(err => res.status(404).json({ message: err }))

})


//create district
router.post('/district', (req, res) => {

    let [result, data] = stateValidation(req.body.state)
    if (!("district" in req.body)) {
        res.status(400).json({ message: "district information is needed in request body" })
    }
    const district = new DistrictModel({ district: req.body.district })
    district.save()
        .then(data => {
            if (data) {
                district.save()
                    .then(data => res.status(200).json(data))
            }
        })
        .catch(err => res.status(404).json({ message: err }))

})

//create a child 
router.post('/child', (req, res) => {

    let [result, data] = childValidation(req.body)
    if (!("name" in req.body)) {
        res.status(400).json({ message: "Child information is needed in request body" })
    }
    const child = new ChildModel(req.body)
    child.save()
        .then(data => {
            if (data) {
                child.save()
                    .then(data => res.status(200).json({sucess:"true",data,message:"Operation performed successfully"}))
            }
        })
        .catch(err => res.status(404).json({ message: err }))

})




//view details of state
router.get('/state', (req, res) => {
    StateModel.find(req.body.state, (err, data) => {
        if (err) res.status(404).json({ message: err })
        if (data) res.status(200).json(data)
    })
})

//view details of district
router.get('/district', (req, res) => {
    DistrictModel.find(req.body.district, (err, data) => {
        if (err) res.status(404).json({ message: err })
        if (data) res.status(200).json(data)
    })
})

//view details of child
router.get('/child', (req, res) => {
    ChildModel.find(req.body.child, (err, data) => {
        console.log(data)
        if (err) res.status(404).json({ message: err })
        if (data) res.status(200).json(data)
    })
})



router.get('/register', function(req,res,next) {
	return res.render('register', {title: 'Sign Up'});
});

// /POST for register 
router.post('/register', function(req,res,next) {
	if(req.body.email 
		&& req.body.name
		&& req.body.password 
		&& req.body.confirmPwd 
		&& req.body.hiking){
	if(req.body.password !== req.body.confirmPwd) {
				var err = new Error('Passwords ids do not match');
				err.status = 400;
				return next(err);
			}
	//create object model from input
		var userData = {
			email: req.body.email,
			password: req.body.password,
			name: req.body.name,
			hiking: req.body.hiking
		};

	// use schema's create mehtod
	UserModel.create(userData, function(error, user) {
		if(error) {
			return next(error);
		}
		else {
			req.session.userId = user._id;
			return res.redirect('/profile');
		}
	});		
	}
	else {
		var err = new Error('All fields required');
		err.status = 400;
		return next(err);
	}
});

//GET logout
router.get('/logout', function(req,res,next) {
	if(req.session) {
		// delete session object
		req.session.destroy(function(err) {
			if(err) {
				return next(err);
			}
			else {
				return res.redirect('/');
			}
		});
	}
});
// /GET profile
router.get('/profile', validation.requiresLogin, function(req, res, next) {
		
	UserModel.findById(req.session.userId).exec(function(error, user) {
		if(error) {
			return next(error);
		}
		else {
			return res.render('profile', {title: 'Profile',
										  name: user.name,
								 		  email: user.email,
								 		  hiking: user.hiking});	
		}
	})
});

//GET /login
router.get('/login', validation.loggedOut, function(req,res,next) {
	return res.render('login', {title: 'Log In'});
})

//POST /login
router.post('/login', function(req,res,next) {
	if(req.body.email &&  req.body.password) {
		UserModel.authenticate(req.body.email, req.body.password, function(error, user) {
			if(error || !user) {
				var err = new Error('Please enter correct login credentials');
				err.status = 401;
				return next(err);
			}
			else {
				req.session.userId = user._id;
				return res.redirect('/profile');
			}
		});
	}
	else {
		var err = new Error('Enter email and password');
		err.status = 401;
		return next(err);
	}
});




module.exports = router