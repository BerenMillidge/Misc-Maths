// so the aim of this is just a functoin that takes other functions and "bombards" them 
// with all kind of inputs to form a useful testing program ratherthan anything
// kind of silly to be honest like anything else
// I don't even know to be honest
// like the opint of testing isn't really to confirm the path works, but for edge cases
// where this is difficult
// so I don't even know

// okay, our big functoin, I honestly do not even know how this won't work in js
// like there are probably loads of useful javascript specific things to do, I don't know

///STANDARD SIMPLE TEST FUNCTIONS

const a = function(){
	return null;
}
const b = function() {
	true = false;
	+ = -;
	try: {
		return 1/0
	} catch(e) {
		return e
	}
}
const c = function() {
	die();
}

const d = function(e) {
	e.map(function(){
		return 2+2;
	})
}

// STANDARD TEST OBJECTS

const o1 = {
	a = null,
	b = undefined,
	c=4,
	e = function(){
		return null;
	}
}

const o2e = {};

// STANDARD TEST ARRAYS

const arr1 = [1,2,3,4,5]
const arr2 = ["a","b","c","d","e"]
const arr3 = [1,2,3,undefined, 4,null,0,NaN]
const arr4 = ["a", 4, undefined, "", "b","c",null]



const standard_val = {

	nums: [1,10,1000,100000000,0,-1,-10,-100000000, 0.4, 2.0, 10/3, 1/0, Infinity, NaN],
	strings: ["hello", "test", "\n", "\SELECT * FROM * WHEN 1==1" "\n \1\32ba\h\\\l\ka", "", "   "],
	vals:[null, undefined, Nothing, true, false],
	fns: [a,b,c,d],
	objs: [o1,o2],
	arrs: [arr1, arr2, arr3, arr4]

	// this is just our huge javascript object which will be our standard value hers
	// of numbers and stuff, I don't know
}

function bombard!(fn, num_args, user_input_args, N = 1000, standard_vals = standard_val,
 print_results = true, colourConfig = null, sanity_check = default_sanity_check) {


		// how do we do the combinatorial exlposion here-  this will take an awfully long time tbh
		// especially in an untyped language like javascript, if done naively
		// let's do itthe naive way first though probably

		// so the main thing here will be the operations loop, tbh
		// to be honest we should probably have the run function thing itslf
		// be a separate command, so we can see if it works

		// yeah, the combinatorial exlposion is going to be seriously problematic here
		// I'm not suer how else to do it

		// I'm sure we can figure out some clever looping logic thoughg!

		// what we're going to do, at least for now, is have N random selectoin tested
		// so it tests them against it, and have them be different combinations so we can see
		// if it worked


		// here we set up our colour config
		const colours = colourConfig;
		if (colours ==null) {
			colours = {
			0: '\x1b[2m',
			1: '\x1b[35m',
			2: '\x1b[31m'
			}
			
		}


		var tried_combs = []
		results = {};
		o = convert_obj_keys(standard_vals)
		// now we do our random for loop
		console.log('Beginning overall bombardment');
		for (var i = 0; i<N; i++) {
			var args = [];
			for (var j = 0; j<num_args; j++) {
				args.push(generate_arg(o));
			}
			var index = tried_combs.indexOf(args);
			if (index >1) {
				res = run_fun(fn, args);
				tried_combs.push(args);
				results[args] = res;
			}
			if (index <=-1) {
				i -=1;
				// we need to reset the loop counter so we don't use up a run
			}


		}

		console.log('Bombardment over');
		console.log(str(N) + ' combinations tried');

		if(print) {
			print_results(results, colours, sanity_check);
		}

		return results;

}

// okay, this still all needs testing, but it should have a fairly basic skeleton sorted out
// obviously will need a lot of development work still, but that's just the way of things.

function getRandom(max, min=0) {
	return Math.floor(Math.random()*max) + min;
}

function generate_arg(o) {
	const len = Object.keys(o).length;
	var r1 = getRandom(len);
	var arr = o[r1];
	var r2 = getRandom(arr.length);
	var val = arr[r2];
	return val;
}

function convert_obj_keys(o) {
	var converted = {}
	var i = 0
	for (var key in o) {
		if(o.hasOwnProperty(key) {
			converted[i] = o[key];
			i +=1;
		})
	}
	return converted;
}

run_function(fn, args){

	try: {
		res = fn(...args);
		return res
	} 
	catch(e): {
		console.log('Caught error in function: ' + fn.name);
		return e;

	}
}



function print_results(res, colour_key, sanity_check){


	var total_pass =0;
	var total_warning = 0;
	var total_error = 0;
	var total =0;

	console.log('Testing function: ' + res.function_name + '\n');
	console.log('Bombardment commencing...  \n');


	// we do the iteration here
	$.each(res, function(k,v){
		const k_obj = print_obj(k, warn=false)
		const k_str = k_obj[string]
		//const k_warn = k_obj[warn]
		const v_obj = print_obj(v)
		const v_str = v_obj[string]
		const v_warn = v_obj[warn]

		//const total_warn = increment_warn(k_warn, v_warn);

		var str = total + ": " + k_str + " : " + v_str + '\n';

		// and finally we print it
		console.log(colour_key[v_warn], str);



		// increment our totals
		if (total_warn==0) {
			total_pass +=1;
		}
		if (total_warn ==1) {
			total_warning +=1;
		}
		if (total_warn ==2) {
			total_error +=1;
		}
		total +=1
		
	});
	console.log('Function bombardment completed  \n')
	console.log('Total passes: ' + total_pass + '\n');
	console.log('Total warns: ' + total_warn + '\n');
	console.log('Total Errors' + total_error + '\n');
	console.log('\n');

}

function increment_warn(warn, val){
	if (val>warn) {
		return val;
	}
	return warn;
}

function default_sanity_check(o) {

	// the point of this is to define the standard warning messages
	// you can (and should!) perhaps define your own functions if you like
	// instead of this one
	// and pass in your own coloru config

	const ERROR = 2;
	const WARNING = 1;
	const SANE = 0;

	if (o instanceof Error) {
		return ERROR;
	}
	if (o == null || o == undefined) {
		return WARNING;
	}
	if (isNaN(o)) {
		return WARNING;
	}
	if (!isFinite()) {
		return WARNING;
	}
	return SANE;

}


function print_obj(o, sanity_check, warn=true) {
	var str = 'UNKNOWN';
	var warn_val=0;


	if (o instanceof Array) {
		str = "["
		for (var el in o) {
			obj = print_obj(el);
			str += " ";
			str += obj[string];
		}
		str += " ]"; 

	}

	if(o instanceof Error) {
		if(o.hasOwnProperty('message')) {
			str = "Error: " + o.message;
		} else {
			str = "Error: " + JSON.stringify(o);
		}

	}

	if(o===null) {
			str='null';
	}

	if ( o === undefined) {
		str = 'undefined';
	}

	if( !o.toString || o.toString() = '[object Object]'){
		str = JSON.stringify(o, null, '  ');
	}

	if (typeof(o) ==='string' {
		str = o;
	}
	if (warn) {
		warn_val = sanity_check(o);
	}
		// this is our return object, so it's not too horrendously hopefulyl
	return {
		string: str,
		warn: warn_val
	}
}