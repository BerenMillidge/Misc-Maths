# okay, let's try outsome very basic stuff here to see if it works

import numpy as np
import matplotlib.pyplot as plt

#first let's draw points from standard bivariate normal

mu = [0,0]
sigma = [[1,0],[0,1]]
samples = np.random.multivariate_normal(mu, sigma, 1000000)
#now we need to plot said samples on 2d graph
print type(samples)
print samples.shape

x = samples[:,0]
y = samples[:,1]

#fig = plt.figure()
#ax1 = fig.add_subplot(121)
#plt.hist(x)
#plt.title('x dimension')

#ax2 = fig.add_subplot(122)
#plt.hist(y)
#plt.title('y dimension')

#plt.show(fig)

# now we get the conditional distributions
def get_cond(samps,vals,val, sample_width):
	rets = []
	for i in xrange(len(samps)):
		samp = samps[i]
		if samp <=val+sample_width and samp >=val-sample_width:
			rets.append(vals[i])
	np.array(rets)
	return rets

conds = get_cond(x,y,-2,0.3)
fig = plt.figure()
ax1 = fig.add_subplot(121)
plt.hist(y)
plt.title('y dimension by itself')

ax2 = fig.add_subplot(122)
plt.hist(conds)
plt.title('y | x ~0')

plt.show(fig)

# yeah, the trouble is it changes. we can plot KLs for all of them and mean them if you like
# or do some other kind of thing. there are probably more reasonable ways to test this
# but the trouble is,in mcmc we won't get samples for these points realistically anyhow
# and it'll take ages to assume this generally, and I'm not sure how to get general conds
# and i'm not sure it will help!!! dagnabbit. it is a cool method though!
# to be fair gibbs sampling is basically what I'm just inventing here ,but done much better and more sensibly than my way which is insane, and tries to peel off dimensions at random and without much success to be honest, but it might be good as a quick and dirty approximation, but who knows?
# gaussian processes also
#but its still hard to compete with piecewise linear
# I suppose the hope is it won't scale to high dimensions at all, but we honestly don't know
# and for arbitrary nonconcave functions
# we could try using gaussian processes, or somethign. the trouble with nns is really just that they don't do well without lots of data, and that is difficult. also, what is the objective function? is it differentiable. so we could try gps first for it if we can come up with an adaptive algorithm here. I wnoder what theirs is, and it could be cool for all i know!? yeah, their algorithm makes a whole load number of better steps, and that's cool.. who knew it was so good the ARS?
# yeah so far I think they're mostly for univariate, which is useless for any kind of serious inference in the real world mostly, unless you have dimensional decompositoin
# we cuold try a GP to hold up the method, but really we just want fast and effective function approximation to rapidly do it. the piecewise linear is some kind of taylor thing perhaps? which I doubt works in high dmiensions?

# I'msure somebody has already tried to simualte the rejection sampling envelope distributoin with a neural network. I'm not sure how much better it is, but NNs are definitely awesome function approximators, so it seems reasonable and possible, and definitely a cool paper perhaps if I can figure out a reasonable objective functoin and haven't got a straight up result already in the literature. it could be seriosuly useful generally and cool and so forth, and I just dno't know, and it would be good to have some kind of papers somewhere aroudn!
## I suppose the problem would be guaranteeing that the NN learns a function that completely coversit although I don't understand why you just straight up wouldn't just calculate f(x) for every y you want if you want to do that vs rejecion sampling as it makes no sense to e!
# we should also be able to use ANNs to help us model te distributions to be approxed via mcmc to speed up that sampling process. should be very important generally, hopefuly!

# also people can use piecewise linear functions for this. and apparently it works well. I suppose the challenge is showing that NNs work better, which is nowhere near guaranteed!?

# the conditioal distribution is another normal but a different one
# but it doesn't realy matter. waht mattersi s how we approximate it empirically
## that will be very slow and error prone presumably

# okay, so what we do is mcmc standard sampling without serious issues
# then after we've accumulated a bit, we basically get samples of all the conditional distributiosn - not sure how we avoid the problem of them needing the conditional for a specific value. I think that's the hangup where we're going to fail tbh
# but if it'sconditional in a region, we could argue that it should be conditional everywhere
# at least for a couple of regions
# so if we have common points, it should hold generally, hopefully
# at least that's the aim, and we can use bayesian opt to do that hopefully
# let's try it
# we could gaussian process it
# but that still doesn't give us the actual cond distribution right
# unless once again we GP it
# but that introduces yet another source of error into the works
# and another overhead... dagnabbit!
#wait a second, this doesn't actually help us at all, as basically we're just trying to calculate p(x,y) which is what we wanted in the first lpace!
# okay, great, sothat works. now let's try to figure out the conditional distribution empirically # well an obvious thing to do is to try to sample a bunch of points from the full posterior - we can do that right??? via mcmc smapling or something and from there calcualte the conditionals and what not and from there calculate dimensional coupling so the overhead won't actually be that large as you'll be doing mcmc sampling in the first place itwill just be an approximation method which will hopefully improve the speed of the mcmc samlpers in the first place, as that's quiet nice, and it'll just be a fairly standard overhead to be honest. so let's think about this

