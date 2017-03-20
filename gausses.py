#This is where I experiment with plotting gaussians so I can attempt to see visually what changing the covariances does. This is a really critical part of my intuitions about ML systems which I desperately need to work on.

from __future__ import division
import numpy as np
import matplotlib.pyplot as plt

N = 1000

def TwoDGauss(N):
	mu = [0,0]
	sigma = [[1,0],[0,1]]
	s = np.random.multivariate_normal(mu,sigma,N)
	print s.shape
	print s
	plt.plot(s.T[0],s.T[1],"o")
	plt.show()
#TwoDGauss(N)

def ThreeDGauss(N):
	mu = [0,0,0]
	sigma = [[1,0,0],[0,1,0],[0,0,1]]
	s = np.random.multivariate_normal(mu,sigma,N)
	print s.shape

ThreeDGauss(N)
