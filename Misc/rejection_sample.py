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
		
		
		
