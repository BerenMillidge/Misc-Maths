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
hs = []
abscissae_derivatives = []

def get_hs(abscissae, fn):
	hs =[]
	for i in xrange(abscissae):
		hs.append(fn(abscissae[i]))
	hs = np.array(hs)
	return hs

def calculate_abscissae_derivatives_and_hs(abscissae, fn):
	hs= []
	abscissae_derivatives = []
	for i in xrange(len(abscissae)):
		hs.append(fn(abscissae[i]))
		abscissae_derivatives.append(finite_difference(fn, abscissae[i]))
	abscissae_derivatives = np.array(abscissae_derivatives)
	hs = np.array(hs)
	return abscissae_derivatives, hs

		
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

# I'm really not sure what datastructures we're going to use to figure this out. first let's actually try to sample a point and see what's going on

def get_piece_cumsum(hx, hdashx, z, zminus,x):
	int1 = np.exp((hx - x*hdashx)/hdashx))
	int2 = np.exp(z*hdashx) - np.exp(zminus*hdashx)
	return int1*int2

def get_cumsums(abscissae, abscissae_derivatives, zs,hs):
	cumsums = []
	total = 0
	# I think there should be one less z than xs so that's good, so lets assert that and then ope for the bes
	assert len(abscissae) == len(abscissae_derivatives) == len(hs) == len(zs) +1, 'lengths are incorrect'
	for i in xrange(len(zs)):
		if i == 0:
			cumsum= get_piece_cumsum(hs[i], abscissae_derivatives[i], zs[i], 0,abscissae[i])
			cumsums.append(cumsum)
			total += cumsum
		cumsum= get_piece_cumsum(hs[i], abscissae_derivatives[i],zs[i], zs[i-1], abscissae[i])
		cumsums.append(cumsum)
		total +=cumsum
	cumsums = np.array(cumsums)
	return cumsums, total
	

def get_index_upper(cumsums, total):
	curr = 0
	for i in xrange(len(cumsums)):
		curr += cumsums[i]
		if total <= curr:
			diff = curr - total
			return i,diff
	#I don't think we should need this, as it should always return in the loop, I think
	#if it goes through all of them
	raise ValueError('total is greater than cumulative sum!')
	#return len(cumsum)

def sample_single_piece(cum, hdashx, hx,x):
	frac = (cum *hdashx)/(np.exp(hdashx) - (x*hdashx))
	return (1/hdashx)*np.log((np.exp(hdashx) + frac))

def sample_upper(xs, hs, hdashes,zs):
	u = np.random.uniform(0,1)
	#we ned cumulative sum now
	cumsums, total = get_cumsums(xs, hdashes, zs, hs)
	c = u*total
	#now we need to get the index of the cumulative sum so we can calculate the region we need it in
	i,diff = get_index_upper(cumsums, c)
	sample = sample_single_piece(diff, hdashes[i],hs[i],xs[i])	


# okay, now we can sample from that distribution what is the next step
# we assume the abscissae are sorted into ascending value
def get_nearest_abscissa_indices(value, abscissae):
	for i in xrange(len(abscissae)):
		if value > abscissae[i]:
			return i-1, i
	raise ValueError('Provided value greater than domain of this distribution')
		
def get_nearest_zs_index(value, zs):
	for i in xrange(len(zs)):
		if value > zs[i]:
			return i-1,i
	raise ValueError('Provided value greater than the domain of this distribution')


def get_lower_hull(value, xs, hs):
	i, iplus = get_nearest_abscissa_indices(value, xs)
	return (((xs[iplus]-value)*hs[i]) +((value-xs[i])*hs[iplus]))/xs[iplus]-xs[i]

def get_upper_hull_value(value, xs,zs):
	i, iplus = get_nearest_zs_index(value, zs)
	x = xs[]
	hx= hs[i]
	hdashx = hdashxs[i]
	return hx + (value - x)*hdashx


def add_new_point_to_hull(point):
	pass 
	
	#this logic will be truly horrible. implement later

def initialise_ars():
	pass
	#also do this logic later

# now we should have all the helper functions we need to create the actual adapter rejection sampler
def rejection_sample(fn,N):
	samples = []
	tries = []
	n=0
	num_acceptances = 0
	num_rejections =0
	while n < N:
		xstar = sample_upper(xs, hs, hdashes, zs)
		u = np.random.uniform(0,1)
		w = xstar*u
		#squeezing step!
		if w <= np.exp(get_lower_hull(xstar,hs,zs)-get_upper_hull_value(xstar,xs,zs)):
			#we accept
			samples.append(xstar)
			tries.append(1)
			n+=1
			num_acceptances +=1
		else:
			if w<=np.exp(fn(xstar)-get_upper_hull_value(xstar, xs,zs)):
				samples.append(xstar)
				tries.append(1)
				add_new_point_to_hull(fn(xstar))
				n+=1
				num_acceptances +=1
			else:
				#we reject - dagnabbit!
				tries.append(0)
				num_rejections +=1

	return samples, num_acceptances, num_rejections, tries
	
# so that's a very simple oeriew of the algorithm ,which is cool and nice and wonderful.
# I mean it will never work, but we kind of understand it and get the complexity behind it which is cool. funnily enough it's the sampling from the upper which is the worst of the work
# this is also kind of a huge overhead so it'sgot to be worth it over additoinal function evlauations, but perhaps it is?
# I wonder if our GAN method can do better?
	
	




