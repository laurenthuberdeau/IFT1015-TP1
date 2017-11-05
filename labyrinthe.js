
// Nom du programme: labyrinthe.js
// Auteurs: Laurent Huberdeau (p1171029) & Mario Dubreuil (p0152501)
// Date de création: 2017-OCT-21
// Description:
// ...

// TODO: Modifier les fonctions ASSERT sur les tableaux pour valider que le tableau passé en paramètre n'a pas été modifié par la fonction


////////////////////////////////////////////////////////////////////////////////
//  Fonctions du spec (Excluant laby et labySol)
////////////////////////////////////////////////////////////////////////////////

// Cette fonction prend 1 paramètre (n) et retourne un tableau de longueur n
// contenant en ordre les valeurs entières entre 0 et n-1 inclusivement
// "n" est un nombre entier >= 0
var iota = function (n) {
    var tab = new Array(n);
    // initialise les n éléments avec les valeurs 0, 1, ..., n-1
    while (n-- > 0) {
        tab[n] = n;
    }
    return tab;
};

// Cette fonction prend 2 paramètres (tab et x) et retourne l'index du nombre si x est
// contenu dans le tableau tab sinon elle retourne -1 pour indiquer que x n'est pas dans
// le tableau
// "tab" est un tableau de nombres
// "x" est l'élément dont la position est cherchée dans le tableau
var contientIndex = function (tab, x) {
    return tab.indexOf(x);
};

// Cette fonction prend 2 paramètres (tab et x) et retourne true si x est
// contenu dans le tableau tab sinon elle retourne false
// "tab" est un tableau de nombres
// "x" est l'élément cherchée dans le tableau
var contient = function (tab, x) {
    return (contientIndex(tab, x) != -1); // i != -1 => on a trouvé le nombre, donc on retourne true sinon false
};

// Cette fonction prend 2 paramètres (tab et x) et retourne un nouveau tableau
// avec le même contenu que tab sauf que x est ajouté à la fin s'il n'y est pas déjà
// "tab" est un tableau de nombres
// "x" est le nombre à ajouter
var ajouter = function (tab, x) {
    var nouvTab = tab.slice(0, tab.length); // crée un nouveau tableau identique à celui passé en paramètre
    if (!contient(tab, x)) { // ajoute x au tableau s'il n'y est pas déjà
        nouvTab.push(x);
    }
    return nouvTab; // on retourne le nouveau tableau
};

// Cette fonction prend 2 paramètres (tab et x) et retourne un nouveau tableau
// avec le même contenu que tab sauf que x est retiré du tableau s'il s'y trouvait
// "tab" est un tableau de nombres
// "x" est le nombre à retirer
// NB: tab est un ensemble au sens mathématique du terme, c'est à dire une collection
// d'éléments sans duplication
var retirer = function (tab, x) {
    var index = contientIndex(tab, x); // Obtient l'index du nombre dans le tableau (-1 s'il n'y est pas)
    var nouvTab;
    if (index != -1) { // on copie tous les éléments précédents x et ensuite tous les suivants x (donc tous les éléments sauf x)
        nouvTab = tab.slice(0, index).concat(tab.slice(index + 1, tab.length));
    }
    else { // on copie tous les éléments puisque x n'y est pas
        nouvTab = tab.slice(0, tab.length);
    }
    return nouvTab; // on retourne le nouveau tableau
};

// Cette fonction prend 3 paramètres (x, y et nx) et retourne le no de la cellule correspondante
// à la coordonnée (x, y) d'un tableau de longueur nx (la coordonnée en haut à gauche est (0,0))
// selon la formule no = x + y * nx
// "x" est un nombre entier >= 0 et < nx
// "y" est un nombre entier >= 0
// "nx" est un nombre entier > 0
var xy2no = function (x, y, nx) {
    return (x + y * nx); // retourne le no de la cellule
};

// Cette fonction prend 2 paramètres (no et nx) et retourne le coordonnée x de la cellule no
// d'un tableau de longueur nx (la coordonnée en haut à gauche est (0,0))
// selon la formule x = no % nx
// "no" est le numéro de la cellule et est un nombre entier >= 0
// "nx" est la largeur du labyrinthe et est un nombre entier > 0
var no2x = function (no, nx) {
    return (no % nx); // retourne la coordonnée x de la cellule
};

// Cette fonction prend 2 paramètres (no et nx) et retourne le coordonnée y de la cellule no
// d'un tableau de longueur nx (la coordonnée en haut à gauche est (0,0))
// selon la formule x = Math.floor(no / nx)
// "no" est le numéro de la cellule et est un nombre entier >= 0
// "nx" est la largeur du labyrinthe et est un nombre entier > 0
var no2y = function (no, nx) {
    return Math.floor(no / nx); // retourne la coordonnée y de la cellule
};

// Cette fonction prend 4 paramètres (x, y, nx et ny) et retourne un tableau
// contenant les numéros des cellules voisines à la cellule (x, y) d'un tableau de
// dimension nx par ny
// "x" est un nombre entier >= 0 et < nx
// "y" est un nombre entier >= 0 et < ny
// "nx" est un nombre entier > 0
// "ny" est un nombre entier > 0
var voisins = function (x, y, nx, ny) {
    var tab = Array(0); // création d'un tableau vide auquel on va ajouter les cellules voisines
    var no = xy2no(x, y, nx); // calcul du numéro correspondant à la cellule (x, y)
    if (y > 0) { // si la cellule (x, y) n'est pas sur la première ligne du tableau alors on ajoute la cellule en haut de celle-ci
        tab.push(no - nx);
    }
    if (x > 0) { // si la cellule (x, y) n'est pas sur la première colonne du tableau alors on ajoute la cellule à gauche de celle-ci
        tab.push(no - 1);
    }
    if (x + 1 < nx) { // si la cellule (x, y) n'est pas sur la dernière colonne du tableau alors on ajoute la cellule à droite de celle-ci
        tab.push(no + 1);
    }
    if (y + 1 < ny) { // si la cellule (x, y) n'est pas sur la dernière ligne du tableau alors on ajoute la cellule en bas de celle-ci
        tab.push(no + nx);
    }
    return tab; // on retourne le tableau des cellules voisines
};


////////////////////////////////////////////////////////////////////////////////
//  Laby
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  Laby - Dessin murs
////////////////////////////////////////////////////////////////////////////////

// Cette fonction prend 4 paramètres (murV, pas, nx et ny) et dessine un mur vertical de
// longueur pas pixels et utilise murV, nx et ny pour positioner le mur
// "murV" est le numéro du mur et est un nombre entier >= 0
// "pas" est la longueur du mur en pixels et est un nombre entier > 0
// "nx" est la largeur du labyrinthe et est un nombre entier > 0
// "ny" est la largeur du labyrinthe et est un nombre entier > 0
var dessinerMurV = function (murV, pas, nx, ny) {
    var xCenterOffset = nx / 2 * pas;
    var yCenterOffset = ny / 2 * pas;
    var x = murV % (nx + 1) * pas - xCenterOffset; // coordonée x de l'extrémité supérieure du mur
    var y = yCenterOffset - Math.floor(murV / (nx + 1)) * pas; // coordonée y de l'extrémité supérieure du mur
    pu();
    mv(x, y); // positioner le crayon au haut du mur
    pd();
    mv(x, y - pas); // dessiner le mur vers le bas
};

// Cette fonction prend 4 paramètres (murH, pas, nx et ny) et dessine un mur horizontal de
// longueur pas pixels et utilise murH, nx et ny pour positioner le mur
// "murH" est le numéro du mur et est un nombre entier >= 0
// "pas" est la longueur du mur en pixels et est un nombre entier > 0
// "nx" est la largeur du labyrinthe et est un nombre entier > 0
// "ny" est la largeur du labyrinthe et est un nombre entier > 0
var dessinerMurH = function (murH, pas, nx, ny) {
    var xCenterOffset = nx / 2 * pas;
    var yCenterOffset = ny / 2 * pas;
    var x = murH % nx * pas - xCenterOffset; // coordonée x de l'extrémité gauche du mur
    var y = yCenterOffset - Math.floor(murH / nx) * pas; // coordonée x de l'extrémité gauche du mur
    pu();
    mv(x, y); // positioner le crayon au haut du mur
    pd();
    mv(x + pas, y); // dessiner le mur vers le bas
};

// Cette fonction prend 4 paramètres (murs, pas, nx et ny) et dessine tous les murs
// "murs" est l'objet contenant 2 tableux (celui des murs horizontaux et celui des murs verticaux)
// "pas" est la longueur du mur en pixels et est un nombre entier > 0
// "nx" est la largeur du labyrinthe et est un nombre entier > 0
// "ny" est la largeur du labyrinthe et est un nombre entier > 0
var dessinerMurs = function (murs, pas, nx, ny) {
    for (var i = 0; i < murs.v.length; i++) { // dessiner les murs verticaux
        dessinerMurV(murs.v[i], pas, nx, ny);
    }
    for (var i = 0; i < murs.h.length; i++) { // dessiner les murs horizontaux
        dessinerMurH(murs.h[i], pas, nx, ny);
    }
};


////////////////////////////////////////////////////////////////////////////////
//  Laby - Génération labyrinthe
////////////////////////////////////////////////////////////////////////////////

// Cette fonction prend 2 paramètres (nx et ny) et retourne un object contenant 2 tableaux (celui de l'ensemble des murs horizontaux
// et celui de l'ensemble des murs verticaux)
// "nx" est la largeur du labyrinthe et est un nombre entier > 0
// "ny" est la largeur du labyrinthe et est un nombre entier > 0
var creerMurs = function (nx, ny) {
    return {h: iota(nx * (ny + 1)), v: iota(ny * (nx + 1))}; // retourne un tableau avec l'ensemble des murs horizontaux
};

// Cette fonction prend 2 paramètres (nx et ny) et retourne un tableau contenant la cavité initiale choisie aléatoirement
// "nx" est la largeur du labyrinthe et est un nombre entier > 0
// "ny" est la largeur du labyrinthe et est un nombre entier > 0
var creerCave = function (nx, ny) {
    return [Math.floor(Math.random() * nx * ny)]; // retourne un tableau contenant la cellule cavité initiale choisie aléatoirement
};

// Cette fonction prend 3 paramètres (cavite, nx et ny) et retourne un tableau contenant les cellules sur la frontière de la cavité initiale
// "cavite" est la cavité initiale et est un monbre entier entre 0 et nx * ny - 1
// "nx" est la largeur du labyrinthe et est un nombre entier > 0
// "ny" est la largeur du labyrinthe et est un nombre entier > 0
var creerFront = function (cavite, nx, ny) {
    return voisins(no2x(cavite, nx), no2y(cavite, nx), nx, ny); // retourne un tableau contenant les cellules sur la frontière de la cavité initiale
};

// Cette fonction prend 1 paramètre (front) et retourne la nouvelle cellule cavité chosie aléatoirement parmis les cellules sur la frontière de la cavité
// "front" est le tableau des cellues qui sont sur la frontière de la cavité
var obtenirNouvCavite = function (front) {
    return front[Math.floor(Math.random() * front.length)]; // retourne la nouvelle cellule cavité chosie aléatoirement parmis les cellules sur la frontière de la cavité
};

// Cette fonction prend 1 paramètre (murs) et retourne un objet ayant la même structure et pointant sur le même tableau des
// murs verticaux (puisque celui n'est pas affecté par la fonction) mais pointant sur un nouveau tableau des murs horizontaux
// étant donné qu'on doit lui retirer le premier mur pour créer l'entrée du labyrinthe et le dernier mur pour créer la sortie
// "murs" est l'objet contenant 2 tableux (celui des murs horizontaux et celui des murs verticaux)
var retirerMursHorEntreeSortie = function (murs) {
    return {h: murs.h.slice(1, murs.h.length - 1), v: murs.v}; // retourne un objet ayant la même structure et pointant sur le même tableau des murs verticaux (puisque celui n'est pas affecté par la fonction) mais pointant sur un nouveau tables des murs horizontaux étant donné qu'on doit lui retirer le premier mur pour créer l'entrée du labyrinthe et le dernier mur pour créer la sortie
};

// Cette fonction prend 4 paramètres (murs, nouvCavite, caviteVoisine et nx) et retourne un objet murs ayant la même structure mais dont le
// mur entre les 2 cavités a été retiré (si c'est un mur horizontal qui a été retiré alors l'objet pointe sur un nouveau tableau horizontal et sur
// le même tableau vertical (puisque celui n'est pas affecté par la fonction) et inversement si c'est un mur vertical qui a été retiré.
// "murs" est l'objet contenant 2 tableux (celui des murs horizontaux et celui des murs verticaux)
// "nouvCavite" est la nouvelle cavité qui a été chosie pour être ajoutée à la cavité
// "caviteVoisine" est une cellule voisine de la nouvelle cavité et qui est déjà dans la cavité
// "nx" est la largeur du labyrinthe et est un nombre entier > 0
var retirerMur = function (murs, nouvCavite, caviteVoisine, nx) {
    var mursH = murs.h; // pointe sur le même tableau que celui passé en paramètre
    var mursV = murs.v; // pointe sur le même tableau que celui passé en paramètre

    // calcul des coordonnées des 2 cavités
    var xNouvCavite = no2x(nouvCavite, nx);
    var yNouvCavite = no2y(nouvCavite, nx);
    var xCaviteVoisine = no2x(caviteVoisine, nx);
    var yCaviteVoisine = no2y(caviteVoisine, nx);

    if (xNouvCavite == xCaviteVoisine) { // elles sont une au dessus de l'autre, i.e. on doit retirer un mur horizontal
        var murRetirer = xNouvCavite + (yNouvCavite + (yCaviteVoisine > yNouvCavite)) * nx; // calcul du numéro du mur horizontal entre les 2 cavités
        mursH = retirer(mursH, murRetirer); // retirer le mur horizontal
    }
    else { // elles sont une à côté de l'autre, i.e. on doit retirer un mur vertical
        var murRetirer = (xCaviteVoisine > xNouvCavite) + xNouvCavite + yNouvCavite * (nx + 1); // calcul du numéro du mur vertical entre les 2 cavités
        mursV = retirer(mursV, murRetirer); // retirer le mur vertical
    }
    return {h: mursH, v: mursV}; // retourne un objet murs ayant la même structure mais dont le mur entre les 2 cavités a été retiré (si c'est un mur horizontal qui a été retiré alors l'objet pointe sur un nouveau tableau horizontal et sur le même tableau vertical (puisque celui n'est pas affecté par la fonction) et inversement si c'est un mur vertical qui a été retiré
};

// Cette fonction prend 4 paramètres (nouvCavite, nx, ny et cave) et retourne un objet avec la cellule cavité voisine chosie aléatoirement parmis
// les cellues cavités voisines et un tableau des cellules voisines qui ne sont pas dans la cavité (qui seront éventuellement ajouter à front)
// "nouvCavite" est la nouvelle cavité qui a été chosie pour être ajoutée à la cavité
// "nx" est la largeur du labyrinthe et est un nombre entier > 0
// "nx" est la hauteur du labyrinthe et est un nombre entier > 0
// "cave" est un tableau des cellues faisant parties de la cavité
var obtenirVoisins = function (nouvCavite, nx, ny, cave) {
    var voisinsCave = Array(0); // tableau qui va contenir toutes les cellules voisines de la nouvelle cellule cavité et qui sont déjà dans la cavité
    var voisinsFront = Array(0); // tableau qui va contenir toues les cellues voisines de la nouvelle cellule cavité et qui devront être ajoutées à la frontière puisqu'elles ne sont pas dans la cavité
    var voisinsNouvCavite = voisins(no2x(nouvCavite, nx), no2y(nouvCavite, nx), nx, ny); // obtenir les cellules voisines de la nouvelle cellule de la cavité
    // ajouter les cellules voisines au bon tableau selon qu'elle se trouve dans la cavité ou pas
    for (var i = 0; i < voisinsNouvCavite.length; i++) {
        if (contient(cave, voisinsNouvCavite[i])) {
            voisinsCave.push(voisinsNouvCavite[i]);
        }
        else {
            voisinsFront.push(voisinsNouvCavite[i]);
        }
    }
    var caviteVoisine = voisinsCave[Math.floor(Math.random() * voisinsCave.length)]; // choisir la cellule voisine qui est déjà dans la cavité, c'est entre celle-ci et la nouvelle cellule de la cavité que le mur sera retiré
    return {cavite: caviteVoisine, front: voisinsFront}; // retourne un objet avec la cellule cavité voisine chosie aléatoirement parmis les cellues cavités voisines et un tableau des cellules voisines qui ne sont pas dans la cavité et qui seront éventuellement ajouter à la frontiere
};

// Cette fonction prend 2 paramètres (cave et nouvCavite) et retourne un tableau des cellules de la cavité comprenant la nouvelle cellule de la cavité
// "cave" est un tableau des cellues faisant parties de la cavité
// "nouvCavite" est la nouvelle cavité qui a été chosie pour être ajoutée à la cavité
var ajouterCavite = function (cave, nouvCavite) {
    return ajouter(cave, nouvCavite); // retourne un tableau des cellules de la cavité comprenant la nouvelle cellule de la cavité
};

// Cette fonction prend 3 paramètres (front, nouvCavite, voisinsFront) et retourne un tableau des cellules de la nouvelle frontière
// Elle retire la nouvelle cellule de cavité de la frontière et y ajoute ces cellules voisines qui ne sont pas dans la cavité
// "front" est un tableau des cellules faisant parties de la frontière
// "nouvCavite" est la nouvelle cavité qui a été chosie pour être ajoutée à la cavité
// "voisinsFront" est un tableau des cellules voisines qui ne sont pas dans la cavité
var obtenirNouvFront = function (front, nouvCavite, voisinsFront) {
    var nouvFront = retirer(front, nouvCavite); // retire la nouvelle cellule cavité de la frontière
    for (var i = 0; i < voisinsFront.length; i++) {
        nouvFront = ajouter(nouvFront, voisinsFront[i]); // ajoute les cellules voisines qui ne sont pas dans la cavité
    }
    return nouvFront; //retourne un tableau des cellules de la nouvelle frontière
};

var genererLaby = function (nx, ny, pas) {
    var murs = creerMurs(nx, ny); // créer l'objet contenant le tableau des murs horizontaux et le tableau des murs verticaux
    var cave = creerCave(nx, ny); // créer le tableau contenant la cavité initiale choisie aléatoirement
    var front = creerFront(cave[0], nx, ny); // créer le tableau contenant les cellules sur la frontière de la cavité initiale

    // on boucle tant qu'il y a de cellules qui sont dans la frontière (i.e. tant que toutes les cellules ne sont pas dans la cavité)
    while (front.length != 0) {
        var nouvCavite = obtenirNouvCavite(front); // obtenir la nouvelle cellule cavité chosie aléatoirement parmis les cellules sur la frontière de la cavité
        var voisins = obtenirVoisins(nouvCavite, nx, ny, cave); // obtenir l'objet contenant la cellule voisine déjà dans la cavité et le tableau des cellules qui devront être ajoutées à la frontière
        murs = retirerMur(murs, nouvCavite, voisins.cavite, nx); // retire le mur entre les 2 cavités
        cave = ajouterCavite(cave, nouvCavite); // ajouter la nouvelle cellule à la cavité
        front = obtenirNouvFront(front, nouvCavite, voisins.front); // retirer la nouvelle cellule cavité de la frontière et y ajouter les nouvelles cellules voisines qui ne sont pas dans la cavité
    }

    murs = retirerMursHorEntreeSortie(murs); // retirer 2 murs horizontaux pour créer l'entrée et la sortie du labyrinthe

    return murs; // on return l'objet murs puisqu'il sera utilisé par la fonction genererEtDessinerSol
};


////////////////////////////////////////////////////////////////////////////////
// Laby - Résolution labyrinthe
////////////////////////////////////////////////////////////////////////////////

// Numéro du mur Nord de la cellule (x,y)
var noMurN = function (x, y, nx) {
    return (x + y * nx);
};

// Numéro du mur Sud de la cellule (x,y)
var noMurS = function (x, y, nx) {
    return (x + (y + 1) * nx);
};

// Numéro du mur Est de la cellule (x,y)
var noMurE = function (x, y, nx) {
    return (1 + x + y * (nx + 1));
};

// Numéro du mur Ouest de la cellule (x,y)
var noMurO = function (x, y, nx) {
    return (x + y * (nx + 1));
};

// Retoure la direction normalisée
// 0: sud
// 1: est
// 2: nord
// 3: ouest
var obtenirDirectionNormalisee = function (direction) {
    // On s'assure d'aller chercher le restant (rem) et non le modulo (mod).
    // forall x < 0: rem(x) /= mod(x)
    return (4 + (direction % 4)) % 4;
};

// Vérifie si un mur est devant la position en la direction donnée
var murDevantExiste = function (position, direction, nx, murs) {
    var noMur = [noMurS, noMurE, noMurN, noMurO];
    var idx = obtenirDirectionNormalisee(direction);
    var mursContient = idx % 2 == 0 ? murs.h : murs.v; // si l'index est pair c'est un mur horizontal sinon vertical
    return contient(mursContient, noMur[idx](position.x, position.y, nx));
};

// Vérifie si un mur est à droite de la position en la direction donnée
var murDroitExiste = function (position, direction, nx, murs) {
    var noMur = [noMurO, noMurS, noMurE, noMurN];
    var idx = obtenirDirectionNormalisee(direction);
    var mursContient = idx % 2 == 0 ? murs.v : murs.h; // si l'index est pair c'est un mur vertical sinon horizontal
    return contient(mursContient, noMur[idx](position.x, position.y, nx));
};

// Rotate vers la gauche la tortue et la position
var tournerGauche = function (direction) {
    lt(90);
    return direction + 1;
};

// Rotate vers la droite la tortue et la position
var tournerDroite = function (direction) {
    rt(90);
    return direction - 1;
};

// Avance jusqu'à rencontrer un mur
var avancerDevant = function (position, direction, distance, pas) {
    fd(2 * distance * pas); // on va à la cellule devant
    var nouvPosition = {x: position.x, y: position.y};
    switch(obtenirDirectionNormalisee(direction)) {
        case 0: // sud
            nouvPosition.y++;
        break;
        case 1: // est
            nouvPosition.x++;
        break;
        case 2: // nord
            nouvPosition.y--;
        break;
        default: // 3 - ouest
            nouvPosition.x--;
    }
    return nouvPosition; // on retourne la nouvelle position
};

// Longe le mur jusqu'au bout de la cellule
var longerMur = function (distance, pas) {
    fd((1 - 2 * distance) * pas);
};

// Recrée le mur horizontal 0 afin de fermer l'entrée du labyrinthe.
// Ceci est pour s'assurer que l'algorithme de Pledge sorte bien par la sortie du labyrinthe
var refermerEntreeLaby = function (murs) {
    return {h: ajouter(murs.h, 0), v: murs.v};
};

// Entre dans la première cellule du labyrinthe, l'entrée.
var entrerDansLaby = function (nx, ny, pas, distance) {

    // positionner le crayon juste au dessus de l'entrée du labyrinthe et l'orienter vers l'intérieur du labyrinthe
    var xCrayon = -nx / 2 * pas; // coordonée x du coin supérieur gauche du labyrinthe (donc de l'entrée)
    var yCrayon = ny / 2 * pas; // coordonée y du coin supérieur gauche du labyrinthe (donc de l'entrée)
    xCrayon += distance * pas; // On déplace le crayon pour que la tracé soit à la bonne distance du mur
    yCrayon += distance * pas;
    pu();
    mv(xCrayon, yCrayon); // positioner le crayon au dessus de l'entrée du labyrinthe
    rt(180); // le faire pointer vers le bas (i.e. lintérieur du labyrinthe)
    setpc(1, 0, 0); // changer sa couleur pour rouge
    pd();
    var direction = 0; // direction initiale vers le sud, i.e vers l'intérieur du labyrinthe
    var position = {x: 0, y: -1}; // positionnement initiale (0, -1), c'est à dire juste au dessus de l'entrée qui est à (0, 0)
    position = avancerDevant(position, direction, distance, pas); // on entre dans le labyrinthe dans la cellule d'entrée
    longerMur(distance, pas); // on longe le mur pour traverser la cellule

    return {position: position, direction: direction};

};

// Résoud le labyrinthe graphiquement une fois l'entrée fermée
var sortirLaby = function (nx, ny, pas, distance, murs, position, direction) {

    while (true) {
        if (murDevantExiste(position, direction, nx, murs)) { // si mur devant existe
            direction = tournerGauche(direction); // on tourne à gauche
        }
        else {
            position = avancerDevant(position, direction, distance, pas); // on avance à la cellule devant
            if (position.x == nx - 1 && position.y == ny) {
                // fin de la boucle puisqu'on vient de sortir du labyrinthe
                break;
            }
            if (direction != 0 && !murDroitExiste(position, direction, nx, murs)) { // si direction != 0 et pas de mur à notre droite
                direction = tournerDroite(direction); // on tourne à droite
                position = avancerDevant(position, direction, distance, pas); // on avance à la cellule devant
                if (position.x == nx - 1 && position.y == ny) { // fin de la boucle puisqu'on vient de sortir du labyrinthe
                    break;
                }
                if (direction != 0 && !murDroitExiste(position, direction, nx, murs)) { // si direction <> 0 et pas de mur à notre droite
                    direction = tournerDroite(direction); // on tourne à droite
                    position = avancerDevant(position, direction, distance, pas); // on avance à la cellule devant
                    if (position.x == nx - 1 && position.y == ny) { // fin de la boucle puisqu'on vient de sortir du labyrinthe
                        break;
                    }
                }
            }
        }
        longerMur(distance, pas); // on longe le mur (qui pourrait être fictif si direction = 0) sans changer de cellule
    }
};

// Résoud un labyrinthe en s'assurant de fermer l'entrée du labyrinthe
var resoudreLaby = function (nx, ny, pas, mursLaby) {

    var distance = 1/4; // le tracer du labyrinthe sera à une distance de 1/4 de pas du mur
    var murs = refermerEntreeLaby(mursLaby); // on recrée le mur horizontal 0 afin de fermer l'entrée du labyrinthe, ceci est pour s'assurer que l'algorithme de Pledge sorte bien par la sortie du labyrinthe
    var gps = entrerDansLaby(nx, ny, pas, distance); // on entre dans le labyrinthe
    sortirLaby(nx, ny, pas, distance, murs, gps.position, gps.direction); // on navigue le labyrinthe jusqu'à la sortie

};


////////////////////////////////////////////////////////////////////////////////
// Laby - Fonctions du spec (laby et bonus)
////////////////////////////////////////////////////////////////////////////////

// Cette fonction prend 3 paramètres (nx, ny et pas) et crée et dessine un labyrinthe
// aléatoire (largeur=nx et hauteur=ny)
// "nx" est un nombre entier > 0 et représente la largeur du labyrinthe
// "ny" est un nombre entier > 0 et représente la hauteur du labyrinthe
// "pas" est un nombre entier > 0 et représente la largeur et la hauteur (en pixel) de chacune des cellules carées du labyrinthe
var laby = function (nx, ny, pas) {
    var mursLaby = genererLaby(nx, ny, pas); // génère un labyrinthe
    dessinerMurs(mursLaby, pas, nx, ny); // dessine le labyrinthe
};

// Cette fonction prend 3 paramètres (nx, ny et pas) et crée et dessine un labyrinthe
// aléatoire (largeur=nx et hauteur=ny)
// "nx" est un nombre entier > 0 et représente la largeur du labyrinthe
// "ny" est un nombre entier > 0 et représente la hauteur du labyrinthe
// "pas" est un nombre entier > 0 et représente la largeur et la hauteur (en pixel) de chacune des cellules carées du labyrinthe
var labySol = function (nx, ny, pas) {
    var mursLaby = genererLaby(nx, ny, pas); // génère un labyrinthe
    dessinerMurs(mursLaby, pas, nx, ny); // dessine le labyrinthe
    resoudreLaby(nx, ny, pas, mursLaby); // Résoud et dessine le labyrinthe et la solution
};


////////////////////////////////////////////////////////////////////////////////
// Tests unitaires
////////////////////////////////////////////////////////////////////////////////

var testerFonctions = function() {

    // Tests unitaires pour la fonction iota
    var testIota = function () {
        assert(iota(0) == ""); // test vide
        assert(iota(1) == "0"); // test 1 élément
        assert(iota(7) == "0,1,2,3,4,5,6"); // test plusieurs éléments
    };

    // Tests unitaires pour la fonction contient
    var testContientIndex = function () {
        assert(contientIndex([9,2,5],9) == 0); // test - contient premier
        assert(contientIndex([9,2,5],5) == 2); // test - contient dernier
        assert(contientIndex([9,2,5],2) == 1); // test - contient !premier && !dernier
        assert(contientIndex([9,2,5],4) == -1); // test - contient pas
        assert(contientIndex([7],7) == 0); // test liste 1 element - contient
        assert(contientIndex([7],8) == -1); // test liste 1 element - contient pas
        assert(contientIndex([],5) == -1); // test liste vide
    };

    // Tests unitaires pour la fonction contient
    var testContient = function () {
        assert(contient([9,2,5],9)); // test - contient premier
        assert(contient([9,2,5],5)); // test - contient dernier
        assert(contient([9,2,5],2)); // test - contient !premier && !dernier
        assert(!contient([9,2,5],4)); // test - contient pas
        assert(contient([7],7)); // test liste 1 element - contient
        assert(!contient([7],8)); // test liste 1 element - contient pas
        assert(!contient([],5)); // test liste vide
    };

    // Tests unitaires pour la fonction ajouter
    var testAjouter = function () {
        assert(ajouter([9,2,5],6) == "9,2,5,6"); // test - ajouter
        assert(ajouter([9,2,5],9) == "9,2,5"); // test - déjà dans la liste - premier
        assert(ajouter([9,2,5],5) == "9,2,5"); // test - déjà dans la liste - dernier
        assert(ajouter([9,2,5],2) == "9,2,5"); // test - déjà dans la liste - !premier && !dernier
        assert(ajouter([3],7) == "3,7"); // test liste 1 élement - ajouter
        assert(ajouter([3],3) == "3"); // test liste 1 élement - déjà dans la liste
        assert(ajouter([],8) == "8"); // test liste vide
    };

    // Tests unitaires pour la fonction ajouter
    var testRetirer = function () {
        assert(retirer([9,2,5,11,8],6) == "9,2,5,11,8"); // test - pas dans la liste
        assert(retirer([9,2,5,11,8],9) == "2,5,11,8"); // test - retirer premier
        assert(retirer([9,2,5,11,8],8) == "9,2,5,11"); // test - retirer dernier
        assert(retirer([9,2,5,11,8],5) == "9,2,11,8"); // test - !premier && !dernier
        assert(retirer([3],3) == ""); // test liste 1 élement - retirer
        assert(retirer([3],7) == "3"); // test liste 1 élement - pas dans la liste
        assert(retirer([],8) == ""); // test liste vide
    };

    // Tests unitaires pour la fonction ajouter
    var testXy2no = function () {
        assert(xy2no(7, 2, 8) == 23); // nx=8, x=7, y=2
        assert(xy2no(7, 1, 8) == 15); // y=1
        assert(xy2no(7, 0, 8) == 7); // y=0

        assert(xy2no(2, 3, 5) == 17); // nx=5, y=3, x=2
        assert(xy2no(1, 3, 5) == 16); // x=1
        assert(xy2no(0, 3, 5) == 15); // x=0

        assert(xy2no(0, 0, 4) == 0); // première coordonnée
        assert(xy2no(3, 3, 4) == 15); // dernière coordonnée (nx=4)
    };

    // Tests unitaires pour la fonction ajouter
    var testNo2x = function () {
        assert(no2x(0, 8) == 0); // nx=8, (première cellule de la première ligne)
        assert(no2x(10, 8) == 2); // (3ième cellule de la 2ième ligne)
        assert(no2x(31, 8) == 7); // (dernière cellule de la 4ième ligne)

        assert(no2x(15, 3) == 0); // nx=3, (première cellule de la 6ième ligne)
        assert(no2x(16, 3) == 1); // (celulle du milieu de la 6ième ligne)
        assert(no2x(17, 3) == 2); // (dernière cellule de la 6ième ligne)

        assert(no2x(0, 1) == 0); // nx=1, (première et seule cellule de la 1ère ligne)
        assert(no2x(1, 1) == 0); // (première et seule cellule de la 2ième ligne)
        assert(no2x(2, 1) == 0); // (première et seule cellule de la 3ième ligne)
    };

    // Tests unitaires pour la fonction ajouter
    var testNo2y = function () {
        assert(no2y(0, 8) == 0); // nx=8, (première cellule de la première ligne)
        assert(no2y(10, 8) == 1); // (3ième cellule de la 2ième ligne)
        assert(no2y(31, 8) == 3); // (dernière cellule de la 4ième ligne)

        assert(no2y(15, 3) == 5); // nx=3, (première cellule de la 6ième ligne)
        assert(no2y(16, 3) == 5); // (celulle du milieu de la 6ième ligne)
        assert(no2y(17, 3) == 5); // (dernière cellule de la 6ième ligne)

        assert(no2y(0, 1) == 0); // nx=1, (première et seule cellule de la 1ère ligne)
        assert(no2y(1, 1) == 1); // (première et seule cellule de la 2ième ligne)
        assert(no2y(2, 1) == 2); // (première et seule cellule de la 3ième ligne)
    };

    // Tests unitaires pour la fonction ajouter
    var testVoisins = function () {
        assert(voisins(7, 2, 8, 4) == "15,22,31");

        assert(voisins(0, 0, 8, 4) == "1,8");
        assert(voisins(0, 1, 8, 4) == "0,9,16");
        assert(voisins(0, 2, 8, 4) == "8,17,24");
        assert(voisins(0, 3, 8, 4) == "16,25");

        assert(voisins(1, 0, 8, 4) == "0,2,9");
        assert(voisins(1, 1, 8, 4) == "1,8,10,17");
        assert(voisins(1, 2, 8, 4) == "9,16,18,25");
        assert(voisins(1, 3, 8, 4) == "17,24,26");

        assert(voisins(2, 0, 8, 4) == "1,3,10");
        assert(voisins(2, 1, 8, 4) == "2,9,11,18");
        assert(voisins(2, 2, 8, 4) == "10,17,19,26");
        assert(voisins(2, 3, 8, 4) == "18,25,27");

        assert(voisins(3, 0, 8, 4) == "2,4,11");
        assert(voisins(3, 1, 8, 4) == "3,10,12,19");
        assert(voisins(3, 2, 8, 4) == "11,18,20,27");
        assert(voisins(3, 3, 8, 4) == "19,26,28");

        assert(voisins(4, 0, 8, 4) == "3,5,12");
        assert(voisins(4, 1, 8, 4) == "4,11,13,20");
        assert(voisins(4, 2, 8, 4) == "12,19,21,28");
        assert(voisins(4, 3, 8, 4) == "20,27,29");

        assert(voisins(5, 0, 8, 4) == "4,6,13");
        assert(voisins(5, 1, 8, 4) == "5,12,14,21");
        assert(voisins(5, 2, 8, 4) == "13,20,22,29");
        assert(voisins(5, 3, 8, 4) == "21,28,30");

        assert(voisins(6, 0, 8, 4) == "5,7,14");
        assert(voisins(6, 1, 8, 4) == "6,13,15,22");
        assert(voisins(6, 2, 8, 4) == "14,21,23,30");
        assert(voisins(6, 3, 8, 4) == "22,29,31");

        assert(voisins(7, 0, 8, 4) == "6,15");
        assert(voisins(7, 1, 8, 4) == "7,14,23");
        assert(voisins(7, 2, 8, 4) == "15,22,31");
        assert(voisins(7, 3, 8, 4) == "23,30");
    };

    // Tests unitaires pour la fonction dessinerMurV
    var testDessinerMurV = function () {
        // On ne fait pas de tests unitaires pour cette fonction puisqu'elle dessine des murs
    };

    // Tests unitaires pour la fonction dessinerMurH
    var testDessinerMurH = function () {
        // On ne fait pas de tests unitaires pour cette fonction puisqu'elle dessine des murs
    };

    // Tests unitaires pour la fonction dessinerMurs
    var testDessinerMurs = function () {
        // On ne fait pas de tests unitaires pour cette fonction puisqu'elle dessine des murs
    };

    // Tests unitaires pour la fonction creerMurs
    var testCreerMurs = function () {
        assert(creerMurs(1, 5).h == "0,1,2,3,4,5");
        assert(creerMurs(1, 5).v == "0,1,2,3,4,5,6,7,8,9");

        assert(creerMurs(5, 1).h == "0,1,2,3,4,5,6,7,8,9");
        assert(creerMurs(5, 1).v == "0,1,2,3,4,5");

        assert(creerMurs(5, 3).h == "0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19");
        assert(creerMurs(5, 3).v == "0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17");

        assert(creerMurs(3, 3).h == "0,1,2,3,4,5,6,7,8,9,10,11");
        assert(creerMurs(3, 3).v == "0,1,2,3,4,5,6,7,8,9,10,11");
    };

    // Tests unitaires pour la fonction creerCave
    var testCreerCave = function () {
        // Impossible de tester en comparant des valeurs, car aléatoire.
        // On peut toujours tester ses propriétés, mais si on teste une propriété
        // dépendante de la valeur aléatoire, il faut répéter plusieurs fois le
        // test - ce qu'on ne fera pas.
        // On test que le tableau retourné contient bien 1 élément
        assert(creerCave(1, 5).length == 1);
    };

    // Tests unitaires pour la fonction creerFront
    var testCreerFront = function () {
        assert(creerFront(0, 5, 5) == "1,5");
        assert(creerFront(4, 5, 5) == "3,9");
        assert(creerFront(5, 5, 5) == "0,6,10");
        assert(creerFront(24, 5, 5) == "19,23");

        assert(creerFront(0, 6, 3) == "1,6");
        assert(creerFront(5, 6, 3) == "4,11");
        assert(creerFront(6, 6, 3) == "0,7,12");
        assert(creerFront(8, 6, 3) == "2,7,9,14");
        assert(creerFront(17, 6, 3) == "11,16");
    };

    // Tests unitaires pour la fonction obtenirNouvCavite
    var testObtenirNouvCavite = function () {
        // Aléatoire, donc impossible à tester
    };

    // Tests unitaires pour la fonction retirerMursHorEntreeSortie
    var testRetirerMursHorEntreeSortie = function () {

    };

    // Tests unitaires pour la fonction retirerMur
    var testRetirerMur = function () {
        // TODO
    };

    // Tests unitaires pour la fonction obtenirVoisins
    var testObtenirVoisins = function () {
        // TODO
    };

    // Tests unitaires pour la fonction ajouterCavite
    var testAjouterCavite = function () {
        // TODO
    };

    // Tests unitaires pour la fonction obtenirNouvFront
    var testObtenirNouvFront = function () {
        // TODO
    };

    var testNoMurN = function () {
        assert(noMurN(7, 2, 8) == 23); // nx=8, x=7, y=2
        assert(noMurN(7, 1, 8) == 15); // y=1
        assert(noMurN(7, 0, 8) == 7); // y=0

        assert(noMurN(2, 3, 5) == 17); // nx=5, y=3, x=2
        assert(noMurN(1, 3, 5) == 16); // x=1
        assert(noMurN(0, 3, 5) == 15); // x=0

        assert(noMurN(0, 0, 4) == 0); // première coordonnée
        assert(noMurN(3, 3, 4) == 15); // dernière coordonnée (nx=4)
    };

    var testNoMurS = function () {
        assert(noMurS(7, 2, 8) == 31); // nx=8, x=7, y=2
        assert(noMurS(7, 1, 8) == 23); // y=1
        assert(noMurS(7, 0, 8) == 15); // y=0

        assert(noMurS(2, 3, 5) == 22); // nx=5, y=3, x=2
        assert(noMurS(1, 3, 5) == 21); // x=1
        assert(noMurS(0, 3, 5) == 20); // x=0

        assert(noMurS(0, 0, 4) == 4); // première coordonnée
        assert(noMurS(3, 3, 4) == 19); // dernière coordonnée (nx=4)
    };

    var testNoMurE = function () {
        assert(noMurE(7, 2, 8) == 26); // nx=8, x=7, y=2
        assert(noMurE(7, 1, 8) == 17); // y=1
        assert(noMurE(7, 0, 8) == 8); // y=0

        assert(noMurE(2, 3, 5) == 21); // nx=5, y=3, x=2
        assert(noMurE(1, 3, 5) == 20); // x=1
        assert(noMurE(0, 3, 5) == 19); // x=0

        assert(noMurE(0, 0, 4) == 1); // première coordonnée
        assert(noMurE(3, 3, 4) == 19); // dernière coordonnée (nx=4)
    };

    var testNoMurO = function () {
        assert(noMurO(7, 2, 8) == 25); // nx=8, x=7, y=2
        assert(noMurO(7, 1, 8) == 16); // y=1
        assert(noMurO(7, 0, 8) == 7); // y=0

        assert(noMurO(2, 3, 5) == 20); // nx=5, y=3, x=2
        assert(noMurO(1, 3, 5) == 19); // x=1
        assert(noMurO(0, 3, 5) == 18); // x=0

        assert(noMurO(0, 0, 4) == 0); // première coordonnée
        assert(noMurO(3, 3, 4) == 18); // dernière coordonnée (nx=4)
    };

    var testObtenirDirectionNormalisee = function () {
        // todo
    };

    var testMurDevantExiste = function () {
        // todo
    };

    var testMurDroitExiste = function () {
        // todo
    };

    var testTournerGauche = function () {
        // todo
    };

    var testTournerDroit = function () {
        // todo
    };

    var testAvancerDevant = function () {
        // todo
    };

    var testLongerMur = function () {
        // todo
    };

    var testRefermerEntreeLaby = function () {
        // todo
    };

    var testSortirLaby = function () {
        // todo
    };

    var testGenererLaby = function () {
        // todo
    };

    var testResoudreLaby = function () {
        // todo
    };

    testIota();
    testContientIndex();
    testContient();
    testAjouter();
    testRetirer();
    testXy2no();
    testNo2x();
    testNo2y();
    testVoisins();
    testDessinerMurV();
    testDessinerMurH();
    testDessinerMurs();
    testCreerMurs();
    testCreerCave();
    testCreerFront();
    testObtenirNouvCavite();
    testRetirerMursHorEntreeSortie();
    testRetirerMur();
    testObtenirVoisins();
    testAjouterCavite();
    testObtenirNouvFront();
    testNoMurN();
    testNoMurS();
    testNoMurE();
    testNoMurO();
    testObtenirDirectionNormalisee();
    testMurDevantExiste();
    testMurDroitExiste();
    testTournerGauche();
    testTournerDroit();
    testAvancerDevant();
    testLongerMur();
    testRefermerEntreeLaby();
    testSortirLaby();
    testGenererLaby();
    testResoudreLaby();
};

testerFonctions();

//laby(8, 4, 40);
//laby(10, 9, 20);
labySol(10, 9, 20);
//laby(6, 6, 36);
