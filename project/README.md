# CG 2024/2025

# TODO LIST

- Parametrizar Panorama
- Fix helicopter velocity
- Extinguish Fire


## Group T02G03

## Project Notes

### Part 1 - Sky-Sphere

![Screenshot 1](screenshots/project-t02g03-1.png)

### Part 2 - Fire-fighters Building

Na implementação da classe **MyBuilding**, optou-se por passar uma textura em vez de uma cor como argumento do construtor. Além disso, é possível selecionar entre escolher várias texturas para o edifício, o que permite um maior realismo e facilita a personalização do seu aspeto.

![Screenshot 2](screenshots/project-t02g03-2.png)

### Part 3 - Trees and Forest

Na implementacão da classe **MyTree**, em vez de passar diretamente a cor da copa como parâmetro, é utilizado um valor booleano que indica se a árvore vai usar ou não textura. Se não usar textura, irá ter diferentes tons de verde. Caso utilize textura, é aplicada a textura que está especificada no último argumento do construtor. Este argumento, que contém o path da textura, permite mudar facilmente a textura da copa das árvores consoante a estação do ano, permitindo representar árvores no verão, outono e inverno.<br>
Na implementacao da classe **MyForest**, foi utilizado um desvio aleatório (offset) à posicão de cada árvore, de forma a evitar a formação de uma grelha perfeita e tornar a distribuição mais natural.

![Screenshot 3](screenshots/project-t02g03-3.png)

### Part 4 - Helicopter

#### Helicopter Modeling

![Screenshot 4](screenshots/project-t02g03-4.png)

#### Final Helicopter

![Screenshot 5](screenshots/project-t02g03-5.png)

### Part 5 - Water and Fire

![Screenshot 6](screenshots/project-t02g03-6.png)
