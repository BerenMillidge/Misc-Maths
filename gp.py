# okay, ehre is where I'm going to try to do my gaussian processes beginning in python.
#I'm first going to attempt to do a simple GP prior draw. from there we will move onto inference in toy problems, and hopefully beyond.

from __future__ import division
import numpy as np
import matplotlib.pyplot as plt

N = 100
l=0.01

#this generates my xgrid. it's probably really inefficient, but hey.
xgrid = []
for i in xrange(N):
	xgrid.append(-0.5+(1/N)*i)
xgrid = np.array(xgrid)
print xgrid.shape

def kernel(x,y,l):
	return np.exp(-(x-y)**2/l)
	#this is a very simple pseudogaussian kernel. should be pretty straightforward.

def construct_covmatrix(xgrid,l):
	sigma = []
	for i in xrange(len(xgrid)):
		col = []
		for j in xrange(len(xgrid)):
			col.append(kernel(xgrid[i],xgrid[j],l))
		col = np.array(col)
		sigma.append(col)
	sigma=np.array(sigma)
	return sigma


sigma = construct_covmatrix(xgrid,l)

def drawGpPrior(N,covmatrix): # we're assuming zero mean for now!
	mus = np.zeros(N)
	print mus.shape
	draw = np.random.multivariate_normal(mus,covmatrix)
	return draw

prior = drawGpPrior(N,sigma)
plt.plot(xgrid,prior)
plt.show()
#Wow! Holy crap it actually works. This straight up gives me a good prior draw. yay. So the distribution over such draws of functions is our prior. That actually makes sense.The multivariate normal is our distribution.Also, this isn't saved is it. That's def something we nered to do before we go to forresthill or something, so this can update the file sysetems. lert's now get back to work
