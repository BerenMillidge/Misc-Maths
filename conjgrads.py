#okay, this is just for random testing, esp. in my test/misc directory. I think I'm going to try to see if I understand new methosd by attempting to implement them in python. It should be fun both from an understanding and a coding perspective. so, let's try it out! First we can try steepest descent.


from __future__ import division
import numpy as np
import matplotlib.pyplot as plt
import scipy
import math

# A generic test function:
def funct(x):
	return 0.01*x**4 -x**3 + 4*x**2 + 5*x + 7
	#return math.cos(x)
	
A = np.array([[3,2],[2,6]])
b = np.array([2,-8])
#x = np.dot(np.linalg.inv(A),b)
#print x



xs = []
ys = []
def steepestdescent(A,b,start):
	res = b - np.dot(A,start)
	print res
	if res.all() != 0:
		alpha = np.dot(res.T,res)/np.dot(res.T,np.dot(A,res))
		update = start + alpha*res
		xs.append(update[0])
		ys.append(update[1])
		print update
		steepestdescent(A,b,update)
	else:
		print "done!"

def jacobiD(A):
	#this is going to be a really inefficient method of doing the jacobi matrix splitting, but I don't care as it's for test purposes only:
	x,y = A.shape
	D = np.empty([x,y])
	for i in xrange(x):
		for j in xrange(y):
			if i !=j:
				D[i][j] =0
			else:
				D[i][j] = A[i][j]
	return D

def jacobiE(A):
	#this is going to be a really inefficient method of doing the jacobi matrix splitting, but I don't care as it's for test purposes only:
	x,y = A.shape
	E = np.empty([x,y])
	for i in xrange(x):
		for j in xrange(y):
			if i ==j:
				E[i][j] =0
			else:
				E[i][j] = A[i][j]
	return E

def jacobi(A,b,start):
	D = jacobiD(A)
	E = jacobiE(A)
	#print D
	#print E
	inv = np.linalg.inv(D)
	update = np.dot(inv,np.dot(E,start)) + np.dot(inv,b)
	print update
	if np.array_equal(update,[2,-2]) == False:
		update = jacobi(A,b,update)
	print update
	return update


# okay, this is going to be tricky, let's try to implement conjugate directions, to show we don't understand it!

def gramschmidtDirections(A,N):
	#first generate N linearly independent vectors - we use coord axes
	U = []
	for i in xrange(N):
		u = np.zeros(N)
		u[i] = 1
		U.append(u)
	D = []
	D.append(U[0])
	#then do the clever bit and make them A-orthogonal. We use coord axis as base then subtract away all non-A-orthogonal components. beta is the sum of all non-A-orthogonal components of the coord axis.
	for j in xrange(N-1):
		sum = 0
		for k in xrange(len(D)):
			beta = -(np.dot(U[j+1].T,(np.dot(A,D[k])))/np.dot(D[k].T,np.dot(A,D[k])))
			sum += np.dot(beta,D[k])
		D.append(U[j+1] + sum)
	return D
	#Well, this gives some kind of results... not sure if correct under any circumstances, but it might be?!

def conjugateDirections(A,b,start,index=0):
	N = len(A)
	D = gramschmidtDirections(A,N)
	res = b - np.dot(A,start)
	print "RES! ", res
	if res.any() != 0:
		alpha = np.dot(D[index].T,res)/np.dot(D[index].T,np.dot(A,D[index]))
		update = start + np.dot(alpha,D[index])
		print "Update ", update
		conjugateDirections(A,b,update,index=index+1)
	else:
		print "Done!"

def ConjugateGradients(A,b,start):
	res  = b-np.dot(A,start)
	print res
	conjloop(A,b,start,res,res)

def conjloop(A,b,start,res,d):
	alpha = np.dot(res.T,res)/np.dot(d.T,np.dot(A,d))
	print alpha
	newres = res - np.dot(alpha,np.dot(A,d))
	print "RES ",newres
	beta = np.dot(newres.T,newres)/np.dot(res.T,res)
	newd = newres + np.dot(beta,d)
	update = start + np.dot(alpha,d)
	print update
	if newres.any() !=0:
		conjloop(A,b,update,newres,newd)
	else:
		print "done!"
		return update
	

ConjugateGradients(A,b,[-9,1])


#print gramschmidtDirections(A,2)
#conjugateDirections(A,b,[0,0])
#jacobi(A,b,[5,-2])



#steepestdescent(A,b,[5,-2])
#plt.plot(xs,ys)
#plt.show()
	


