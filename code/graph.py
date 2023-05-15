import matplotlib.pyplot as plt
import numpy as np

# Max no. of generations
n_gen = 10000

# Get fitnesses and formula
f = open('Fitness.txt', 'r')
data = f.read()
yValues = data.split(',')
t = open('Solution.txt', 'r')
formula = t.read()

# Close all files
f.close()
t.close()


xValues= np.array(list(range(0,len(yValues))))
title = "Fitness of: '{}'".format(formula)

# Plot
plt.plot(xValues, yValues)
plt.title(title)
plt.xlabel("Generation (No. of generations = {}, Max = {})".format(len(xValues),n_gen))
plt.ylabel("Fitness Score")
plt.show()
