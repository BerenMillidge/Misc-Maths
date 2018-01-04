// so the aim of this is just a functoin that takes other functions and "bombards" them 
// with all kind of inputs to form a useful testing program ratherthan anything
// kind of silly to be honest like anything else
// I don't even know to be honest
// like the opint of testing isn't really to confirm the path works, but for edge cases
// where this is difficult
// so I don't even know

// okay, our big functoin, I honestly do not even know how this won't work in js
// like there are probably loads of useful javascript specific things to do, I don't know



const standard_val = {

	// this is just our huge javascript object which will be our standard value hers
	// of numbers and stuff, I don't know
}

function bombard!(fn, num_args, user_input_args, standard_vals = standard_val, print_results = true) {


		// how do we do the combinatorial exlposion here-  this will take an awfully long time tbh
		// especially in an untyped language like javascript, if done naively
		// let's do itthe naive way first though probably

		// so the main thing here will be the operations loop, tbh
		// to be honest we should probably have the run function thing itslf
		// be a separate command, so we can see if it works

		// yeah, the combinatorial exlposion is going to be seriously problematic here
		// I'm not suer how else to do it

		// I'm sure we can figure out some clever looping logic thoughg!
}

run_function(fn, args){

	try: {
		res = fn(...args);
		return {args: res};
	} 
	catch(e): {
		return {args: e}

	}
}



function print_results(res){

	// we do the iteration here
	$.each(res, function(k,v){
		
		
	})
}

function increment_warn(warn, val){
	if (val>warn) {
		return val;
	}
	return warn;
}


function print_obj(o) {
	var str = '';
	const arg_type = typeof(o);
	var warn=0;


	if (o instanceof Array) {
		str = "["
		for (var el in o) {
			str += " " + print_obj(el)
		}
		str += " ]";

	}

	if(o===null) {
			str='null';
		}
		else if(o===undefined) {
			str = 'undefined';
		}
		else if (!o.toString ||o.ToString()==='[object Object]') {
			// this checks if it's an object basically
			str = JSON.stringify(o, null,'  ');
		} else if (arg_type==='string') {
			str = '"' + o.toString() + '"';
		} else {
			str = o.toString();
		}
}