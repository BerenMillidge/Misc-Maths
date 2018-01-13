# okay, test to see if rejection sampling works

# a very simple rejection sampling algorithm

using Distributions

abstract type Sampler end
abstract type MCMCSampler <: Sampler end
abstract type RejectionSampler <: MCMCSampler end

type StandardRejectionSampler <: RejectionSampler 
	envelope:: Function
	tries:: AbstractArray{Integer}
	samples:: AbstractArray{Number}



function rejectionsample(sampler<:RejectionSampler, distribution, num_samples, envelope_fn)
	
	samples =[]
	num_acceptances =0
	num_rejections = 0

	for i in 1:num_samples
		#somehow figure this out
		u = random_normal(0,1) # sample from a random random normal
		xstar = sample(envelope_fn) # get our thing
		sample_height = u*envelope_fn(xstar)
		distribution_height = distribution(xstar)
		if sample_height <= distribution_height
			push!(samples, sample_height)
			num_acceptances+=1
		end
	else
		num_rejections +=1
	end
	end
end