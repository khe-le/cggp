import matplotlib.pyplot as plt

f = open('Fitness.txt', 'r')
DATA = list(f.read())
N_GEN = 100000
GRAPH_TITLE = 'Fitness of x + y - z'


plt.scatter(N_GEN, DATA, cmap='Green', edgecolor = 'black', linewidth = 1, alpha=0.75)  #data on the y axis
plt.title(GRAPH_TITLE)
plt.xlabel("Generation")
plt.ylabel("Fitness Score")
plt.show()
#print(DATA)
