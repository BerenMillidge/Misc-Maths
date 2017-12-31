# okaty, this is the code from the sequential decision problem that stumped milton friedman, frmo here https://lectures.quantecon.org/jl/wald_friedman.html

using Distributions
using QuantEcon.compute_fixed_point, QuantEcon.DiscreteRV, QuantEcon.draw, QuantEcon.LinInterp
using Plots
pyplots() #can't remember if thi scauses issues outside of jupyter notebook
using LateXStrings

#okay, our los functions

# for given probability return expected los of choosing model 0

function expect_loss_choose_0(p::Real, L0::Real)
	return (1-p)*L0
end

#for given probability return expected lsos of choosing model 1

function expect_loss_choose_1(p::Real, L1::Real)
	return p*L1
end

#we need to evaluate  the expectation of our bellman equation J. so we need current probability that model 0 is correct, distributions are f0, f1, and a function that can evaluate bellman equatoin

function EJ(p::Real, f0::AbstractVector, f1::AbstractVector, J::LinInterp)
	#get current distribution we believe - i.e p*fo + 1-p*f1

	curr_dist = p*f0 + (1-p)*f1

	#get tomorrows expected distribution through bayes law
	tp1_dist = clamp.((p*f0) ./(p*f0 (1-p)*f1), 0,1)

	#evaluate the expectation
	EJ = dot(curr_dist, J.tp1_dist))
	return EJ
end

# evaluate valiye function for given continuation value

function expect_loss_cont(p::Real, c::Real, f0::AbstractVector, f1::AbstractVector, j::LinInterp)
	return c+EJ(p, f0, f1,J)
end

function bellman_operator(pgrid::AbstractVector, c::Real, f0::AbstractVector, f1::AbstractVector, L0::Real, L1::Real, J::AbstractVector)
	m = length(pgrid)
	@assert m == length(J)
	
	J_out = zeros(m)
	j_interp = LinInterp(pgrid, J)
	
	for (p_ind, p) in enumerate(pgrid)
		#payoff of chooseing model 0
		p_c_0 = expect_loss_choose_0(p, L0)
		p_c_1 expect_loss_choose_1(p,L1)
		p_con = expect_loss_cont(p,c,f0,f1,J_interp)

		J_out[p_ind] = min(p_c_0, p_c_1, p_con)
	end
	return J_out
end

# this gets us through the bellman equatino, no wwe just create two istributions over 50 values for k usingdiscrete beta distribution

p_m1 = linspace(0,1,50)
f0 = clamp.(pdf(Beta(1,1),p_m1),1e-8, Inf)
f0 = f0/sum(f0)
f1 = clam.(pdf(Beta(9,9), p_m1), 1e-8, Inf)
f1 = f1/sum(f1)

# to solve 
pg = linspace(0,1,251)
J1 = compute_fixed_point(x->bellman_operator(pg, 0.5, f0,f1,5.0,5.0,x), zeros(length(pg)), err_tol=1e-6, print_skip = 5)

# okay, sorted, that's kind of crazy to be honest, but it might or might not work. dagnabbit julia. good ol' solving stuff marting freedman couldn't. there's a better implementation also with more comments and so forth, and we'll do that in a bit. I also need to do my actual phd work. But I kind of understand how this works now, and how powerful bellmans and dynamic programming isfor simple things like this!




