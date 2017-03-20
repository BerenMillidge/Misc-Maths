from __future__ import division
import numpy as np
import math
import matplotlib.pyplot as plt

s = np.array([[1,0],[0,1]])
print s.shape

#x = np.random.multivariate_normal([0,0],s)
points = []
for i in xrange(10000):
	x = np.random.multivariate_normal([0,0],s)
	points.append(x)
points = np.array(points)
print points.shape
xs = points[0]
ys = points[1]
plt.plot(xs,ys,".")
plt.show()


