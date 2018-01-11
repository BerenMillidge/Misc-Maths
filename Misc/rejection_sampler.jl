# okay, test to see if rejection sampling works

abstract type Sampler end
abstract type MCMCSampler <: Sampler end
abstract type RejectionSampler <: MCMCSampler end

type StandardRejectionSampler <: RejectionSampler 

end