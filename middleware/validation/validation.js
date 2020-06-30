const Joi = require('joi')

function validateObj(obj, schema) {
    let result = null
    Joi.validate(obj, schema, (err, data) => {
        if (err) {
            result = [false, err]
        }
        else {
            result = [true, data]
        }
    })
    return result
}

function childValidation(child) {
    const childSchema = Joi.object().keys({
        name: Joi.string().trim().min(5).max(100).required(),
        sex: Joi.string().trim().max(1).required(),
        dob: Joi.date(),
        father_name:Joi.string().trim().min(5).max(100).required(),
        mother_name:Joi.string().trim().min(5).max(100).required(),
        district_id:Joi.string().trim().max(10).required(),
        photo: Joi.string().trim().max(10).required(),
    })
    return validateObj(child, childSchema)
}
function stateValidation(state) {
    const stateSchema = Joi.object().keys({
        state: Joi.string().trim().min(5).max(100).required(),
    })
    return validateObj(state, stateSchema)
}
function districtValidation(district) {
    const districtSchema = Joi.object().keys({
        state_id: Joi.string().trim().min(5).max(100).required(),
        district: Joi.string().trim().min(5).max(100).required(),
    })
    return validateObj(district, districtSchema)
}
function requiresLogin(req,res,next) {
	if(req.session && req.session.userId) {
		return next();
		
	}
	var err = new Error("Please login to view profile");
		err.status = 401;
		return next(err);
}

function loggedOut(req,res,next) {
	if( req.session && req.session.userId) {
		return res.redirect('/profile');
	}
	return next();
}

module.exports = {
    stateValidation: stateValidation,
    districtValidation: districtValidation,
    childValidation: childValidation,


}

module.exports.loggedOut = loggedOut;
module.exports.requiresLogin = requiresLogin;

