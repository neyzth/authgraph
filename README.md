
# Authgraph
Script basique créé avec node.js permettant de récupérer les ip présentes dans votre /var/log/auth.log (le fichier de logs de connexion à votre machine). Ces ips sont ensuite comptés en fonction de leur pays d'origine afin de tracer un merveilleux graphique pour savoir d'où proviennent les bots qui vous ciblent en majorité.




## Exemple
<img src="https://github.com/neyzth/authgraph/blob/main/exemple.jpg" alt="Graphique d'exemple">




## Installation

Récupérer le code du projet sur votre machine
```bash
  git clone https://github.com/neyzth/authgraph.git
```
Acceder au répertoire du projet
```bash
  cd authgraph/
```
Installer les modules nécessaires à l'utilisation de ce projet
```bash
  npm i 
```
Et enfin pour lancer l'éxecution 
```bash
  npm start
```

A la fin de l'éxecution un fichier " graph.jpg " aura été créé !
