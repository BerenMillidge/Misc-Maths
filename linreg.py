#linear regression w1 demo

from __future__ import division
import numpy as np
import matplotlib.pyplot as plt
import math

def sigmoid(x,v,b):
	vals = []
	for val in x:
		y = 1/(1+math.exp((-v*val)-b))
		vals.append(y)
	return vals


def plot_func():
	grid_size = 0.1
	x_grid = np.arange(-10, 10, grid_size)
	v = 1
	b = 1
	f_vals = sigmoid(x_grid,v,b)
#	f_vals = np.cos(x_grid)
	plt.clf(); plt.hold('on')
	plt.plot(x_grid, f_vals, 'b-')
	plt.plot(x_grid, f_vals, 'r.')
	plt.show()


def phi_poly(X,N):
	phi  = np.zeros(N)
	#print phi
	phi = np.reshape(phi,[len(phi),1])
	for x in X:
		lin = []
		for i in xrange(N):
			lin.append(x**i)
		lin = np.array(lin)
		#print lin
		#print phi.shape
		#print lin.shape
		phi = np.vstack([phi,lin])
	print phi.shape
	phi = np.reshape(phi,[len(X)+1,N])
	phi = np.delete(phi,phi[0],axis=0)
	#print phi
	#phi = np.reshape(phi,[3,N])
	#print phi
	return phi
			
	

# now for some proper linear regression:
#X = [[0.8,1.9,3.1],[0.9,2.5,3.3]]#,[0.8,2.3,3,0]]
N = 10
X = np.array([0.8,1.9,3.1,1.2,2.1,4.5])
X = np.reshape(X,[len(X),1])
y = np.array([1.5,3.1,6.2,2.7,4.2,8.8])
linw = np.linalg.lstsq(X,y)[0] # well, that's a good regression. I'm pretty sure that's what we're meant to do though. there's no bias so no origin term. i.e. the linreg line = y = 1.027414x. it does actually work though!
#poly:
phi = phi_poly(X,N)
polyw = np.linalg.lstsq(phi,y)[0]
#polyw = np.array([0,2,0])
polyw = np.reshape(polyw,[len(polyw),1])
preds = np.dot(phi,polyw)
#print preds
reg_y = np.hstack([y,np.zeros(N)])
reg_y = np.reshape(reg_y,[len(reg_y),1])
l = 0
lambds = np.full(N,math.sqrt(l))
lambds = np.diag(lambds)
regphi = np.vstack([phi,lambds])
#print regphi.shape
#print reg_y
#print reg_y.shape
regw = np.linalg.lstsq(regphi,reg_y)[0]
regpreds = np.dot(regphi,regw)
#print regpreds


def makepoly(x,coeffs):
	sum = 0
	i = 0
	for coeff in coeffs:
		sum +=coeff*(x**i)
		i +=1
	return sum

def plotf(w,N,regw):
	grid_size = 0.1
	x_grid = np.arange(0, 3, grid_size)
	f_vals = []
	for x in x_grid:
		f_vals.append(makepoly(x,w))
	reg_vals = []
	for reg in x_grid:
		reg_vals.append(makepoly(x,regw))
	plt.plot(x_grid, f_vals, 'b-')
	plt.plot(x_grid, f_vals, 'r.')
	plt.plot(x_grid, reg_vals, 'b-')
	plt.plot(x_grid, reg_vals, 'r.')

	plt.show()

plotf(polyw,10,regw)


## see, I'm confused by even the simples working of this model, which sucks majorly. I just don't know what's wrongs with me.
#Like how does linear regression run on datasets that aren't evensquare? but square matrices must be a major ask! what if it's not invertible? then how do we find it?
# right, so we massively expand the dataset with basis functions. WHich I think is what Im' missing. so for EACH data input, we create D basis function values. i.e. for N inputs we produce a DxN matrix from it! but why? why does this help?
#plt.plot(X,yy)
#plt.show()
# okay, so X must be square. this makes sense because tb...
# wait... X must be SQUARE????? so we must have equal dimensions to inputs.? something is wrong here... seriously wrong!
#how do we solve it in this case? we must have overdetermined or something? I'm so confused even with the basics of linear regression. fuck my life.

#linear fit. no bias
#print X.shape
#xinv = np.linalg.inv(X)
