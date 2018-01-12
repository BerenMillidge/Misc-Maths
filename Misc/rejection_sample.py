# okay, time to test this out here
# in a simple python script

import numpy as np
import random

def rejection_sample(fn, envelope_fn, squeeze_fn, N):
	samples = []
	num_accepted = 0
	num_rejected = 0
	for i in xrange(N):
		position = sample(envelope_fn) # sample a position from the envelope function
		height_multiplier = np.random.uniform(0,1) # sample a height multiplier from the random uniform - this is what generates the independent samlpes
		env_height = envelope_fn(position) # evaluate the envelope functoin at the point provided
		squeeze_height = squeeze_fn(position)
		sample_height = env_height * height_multiplier
		if sample_height <= squeeze_height:
			samples.append(sample_height)
			num_accepted +=1
		if sample_height > squeeze_height:
			distribution_height = fn(position)
			if sample_height <= distribution_height:
				samples.append(sample_height)
				num_accepted +=1
			if sample_height > distribution_height
				num_rejected +=1
	
	samples = np.array(samples)
	return samples, num_accepted, num_rejected


# okay, let's try to implement this thing somehow. Not totally sure how but get the basic ideas
# so how are we going to represent these things. we're going to need to represent a bunch of piecewise functoins, and a good datastructure to dothat. We're also going to have to do the standard rejection sampling and chord test in a way that hopefully makes some kind of sense. Further, we're going to have to do beginning and initialisatoin and all sorts of stuff really
# and provide a functoin to calculate the density. we've got to work out how that's going to work too. so let's get on this

# the good thing is this ars method is really complicated and requires a huge amount of horrible calculations so it's no fun at all really and makes the GAN seem much more reasonable!
		
# let's start doing some truly horrible calculatoins, which I hate... dagnabbit! I'm not sure of good datastructuresfor doing this... some kind of binary trees? for now let's assume we have a vector of absiccae

#we're also going to calculate finite differences. let's do thatquick

def finite_difference(fn, point, peturbation = 1e-6):
	return (fn(point + peturbation) - fn(point))/peturbation

# okay, now let's get our points of abscissae
abscissae = []
abscissae_derivatives = []

def calculate_abscissae_derivatives(abscissae, fn):
	abscissae_derivatives = []
	for i in xrange(len(abscissae)):
		abscissae_derivatives.append(finite_difference(fn, abscissae[i]))
	abscissae_derivatives = np.array(abscissae_derivatives)
	return abscissae_derivatives

		
def get_tangent_intersection_points(abscissae, abscissae_derivatives):
	assert len(abscissae) == len(abscissae_derivatives), 'all points must have a corresponding derivative'
	zs = []
	for i in xrange(len(abscissae)-1):
		x = abscissae[i]
		xplus=abscissae[i+1]
		hx = abscissae[i]
		hdashx = abscissae_derivatives[i]
		hxplus = abscissae[i+1]
		hdashxplus = abscissae_derivatives[i+1]
		zs.append((hxplus - hx -(xplus*hdashxplus) + (x*hdashx))/(hdashx - hdashxplus))
	zs = np.array(zs)
	return zs


