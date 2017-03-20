from __future__ import division
import numpy as np
import matplotlib.pyplot as plt


sampgen = []
laxgen = []
for i in xrange(10000):
	sampgen.append(np.random.normal(100,15))
	laxgen.append(np.random.normal(115,15))

plt.hist(sampgen,bins=50)
plt.show()
