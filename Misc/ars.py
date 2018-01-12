# so I think the aim here is that we construct stuff which kind of works, but I really don't kno
# we add hulls to the things, I think seeign a straightforward algorithmic implementation woudl be good
# and further it would be really cool if we had something that works nicely, so let's try this out and see if it can shed light on the algorithm at all?
# so it just iteratively consructs the envelope function g(x) as the list of the things cmoing from it, which is nice, as tangents to the plane and the rest, so that is really cool
# and doesn't necessarily make sense per se, but that doesn't matter overmuch, so let's work on this and copy this to see if we get a greater understanding of how the algorithm fits together

import numpy as np
import random
import matplotlib.pyplot as plt

class ARS():
	#PDF must be univariate(!!) and log-concave!
	#doesn't exlpoit lower hull atm

	def __init__(self, f, fprima, xi=[-4,1,4], lb=np.Inf, ub=nb.Inf, use_lower=False, ns=50, **fargs):
		#so params:
		#f: a function that compues log(f(u...) for given u where f(u) is proportioante to the density we want to sample from - i.e. this is our function evaluation
		#fprima is the derivative d/du log(f(U,...))
		#zi is the ordered vector of starting points in which log(fu is defined) to initisliae the hulls
	#d is domain limits
	#use_lower means that lower squeezing will be used which is more efficient as it eliminates/reduces useless chcks
	#lb is the lower bound of the domain
	#ub is the upper bound of the domain
	#ns is the maximum number of points for the hull
	#fargs is argments for f and frprima

	self.lb = lb
	self.ub = ub
	self.f = f
	self.fprima = fprima
	self.fargs = fargs

	self.ns = ns
	self.x = np.array(xi)#intiailise x, the vector of absicassae at which functoin h has been evaluated
	self.h = self.f(self.x, **self.fargs) # this is the result of our functoin	
	self.hprime = self.fprima(self.x, **self.fargs)

	#avoid under/overflow errors as the envelope and pdf are only proportional so we can choose any constant of roportoinality
	self.offset = np.amax(self.h)
	self.h = self.h - self.offset

	#derivative at first point in xi must be > 0
	#and at last point in xi < 0 # concave restriction
	if not(self.hprime[0] > 0):
		print self.hprime
		raise IOError('initial anchor points must span mode of pdf')
	if not(self.hprime[-1]<0):
		print self.hprime
		raise IOError('initial anchor points must span mode of pdf')
	self.insert()


	#okay draws n samples and update upper and lower hulls
	def draw(self,N):
		samples = np.zeros(N)
		n = 0
		while n < N:
			[xt,i] = self.sampleUpper()
			#should perform squeezing test but haven't yet in their implenetation ugh
			ht = self.f(xt, **self.fargs)
			hprimet = self.fprima(xt, **self.fargs)
			ht = ht - self.offset
			ut = self.h[i[ + (xt - self.x[i])*self.hprime[i]

			#accept sample? doesn't use lower atm
			u = random.random()
			if u(np.exp(ht-ut):
				samples[n] =xt
				n+=1

			#update hull with new function evluations
			if self.u.__len__() < self.ns:
				self.insert([xt],[ht],[hprimet])
		return samples



    
    def insert(self,xnew=[],hnew=[],hprimenew=[]):
        '''
        Update hulls with new point(s) if none given, just recalculate hull from existing x,h,hprime
        '''
        if xnew.__len__() > 0:
            x = np.hstack([self.x,xnew])
            idx = np.argsort(x)
            self.x = x[idx]
            self.h = np.hstack([self.h, hnew])[idx]
            self.hprime = np.hstack([self.hprime, hprimenew])[idx]

        self.z = np.zeros(self.x.__len__()+1)
        
        # This is the formula explicitly stated in Gilks. 
        # Requires 7(N-1) computations 
        # Following line requires 6(N-1)
        # self.z[1:-1] = (np.diff(self.h) + self.x[:-1]*self.hprime[:-1] - self.x[1:]*self.hprime[1:]) / -np.diff(self.hprime); 

        self.z[1:-1] = (np.diff(self.h) - np.diff(self.x*self.hprime))/-np.diff(self.hprime) 
        
        self.z[0] = self.lb; self.z[-1] = self.ub
        N = self.h.__len__()
        self.u = self.hprime[[0]+range(N)]*(self.z-self.x[[0]+range(N)]) + self.h[[0]+range(N)]

        self.s = np.hstack([0,np.cumsum(np.diff(np.exp(self.u))/self.hprime)])
        self.cu = self.s[-1]


    def sampleUpper(self):
        '''
        Return a single value randomly sampled from the upper hull and index of segment
        '''
        u = random.random()
        
        # Find the largest z such that sc(z) < u
        i = np.nonzero(self.s/self.cu < u)[0][-1] 

        # Figure out x from inverse cdf in relevant sector
        xt = self.x[i] + (-self.h[i] + np.log(self.hprime[i]*(self.cu*u - self.s[i]) + 
        np.exp(self.u[i]))) / self.hprime[i]

        return [xt,i]

    def plotHull(self):
        '''
        Plot the piecewise linear hull using matplotlib
        '''
        xpoints = self.z
        #ypoints = np.hstack([0,np.diff(self.z)*self.hprime])
        ypoints = np.exp(self.u) 
        plt.plot(xpoints,ypoints)
        plt.show()
        '''
        for i in range(1,self.z.__len__()):
            x1 = self.z[i]
            y1 = 0
            x2 = self.z[i+1]
            y2 = self.z[i+1]-self.z[i] * hprime[i]
        '''

